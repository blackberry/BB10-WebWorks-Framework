/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <stdio.h>
#include <webworks_utils.hpp>
#include <QList>
#include <sstream>
#include <string>
#include <utility>
#include <map>

#include "account_folder_mgr.hpp"

AccountFolderManager::AccountFolderManager(ServiceProvider* provider) : m_pProvider(provider)
{
}

bbpimAccount::Account AccountFolderManager::GetAccount(bbpim::AccountId accountId, bool fresh)
{
    if (fresh || m_accountsMap.find(accountId) == m_accountsMap.end()) {
        fetchAccounts();
    }

    AccountMap::const_iterator found = m_accountsMap.find(accountId);

    if (found != m_accountsMap.end()) {
        return found->second;
    } else {
        return bbpimAccount::Account(); // return invalid account if not found
    }
}

QList<bbpimAccount::Account> AccountFolderManager::GetAccounts(bool fresh)
{
    if (fresh || m_accountsMap.empty()) {
        fetchAccounts();
    }

    QList<bbpimAccount::Account> list;
    for (AccountMap::const_iterator i = m_accountsMap.begin(); i != m_accountsMap.end(); i++) {
        list.append(i->second);
    }

    return list;
}

bbpimAccount::Account AccountFolderManager::GetDefaultAccount(bool fresh)
{
    if (fresh || !m_defaultAccount.isValid()) {
        fetchDefaultAccount();
    }

    return m_defaultAccount;
}

bbpim::CalendarFolder AccountFolderManager::GetDefaultFolder(bool fresh)
{
    if (fresh || !m_defaultFolder.isValid()) {
        fetchDefaultFolder();
    }

    return m_defaultFolder;
}

bool AccountFolderManager::IsDefaultFolder(const bbpim::CalendarFolder& folder, bool fresh)
{
    bbpim::CalendarFolder defaultFolder = GetDefaultFolder(fresh);
    return (folder.accountId() == defaultFolder.accountId() && folder.id() == defaultFolder.id());
}

bbpim::CalendarFolder AccountFolderManager::GetFolder(bbpim::AccountId accountId, bbpim::FolderId folderId, bool fresh)
{
    std::string key = GetFolderKey(accountId, folderId);

    if (fresh || m_foldersMap.find(key) == m_foldersMap.end()) {
        fetchFolders();
    }

    FolderMap::const_iterator found = m_foldersMap.find(key);

    if (found != m_foldersMap.end()) {
        return found->second;
    } else {
        return bbpim::CalendarFolder(); // return invalid folder if not found
    }
}

QList<bbpim::CalendarFolder> AccountFolderManager::GetFolders(bool fresh)
{
    if (fresh || m_foldersMap.empty()) {
        fetchFolders();
    }

    QList<bbpim::CalendarFolder> list;
    for (FolderMap::const_iterator i = m_foldersMap.begin(); i != m_foldersMap.end(); i++) {
        list.append(i->second);
    }

    return list;
}

QList<bbpim::CalendarFolder> AccountFolderManager::GetFoldersForAccount(bbpim::AccountId accountId, bool fresh)
{
    QList<bbpim::CalendarFolder> folders = GetFolders(fresh);
    QList<bbpim::CalendarFolder> result;

    for (QList<bbpim::CalendarFolder>::const_iterator i = folders.constBegin(); i != folders.constEnd(); i++) {
        bbpim::CalendarFolder folder = *i;

        if (folder.accountId() == accountId) {
            result.append(folder);
        }
    }

    return result;
}

Json::Value AccountFolderManager::GetAccountJson(const bbpimAccount::Account& account, bool fresh)
{
    Json::Value val;

    val["id"] = webworks::Utils::intToStr(account.id());
    val["name"] = account.displayName().toStdString();
    val["enterprise"] = account.isEnterprise();

    Json::Value foldersVal;
    QList<bbpim::CalendarFolder> folders = GetFoldersForAccount(account.id(), fresh);
    for (QList<bbpim::CalendarFolder>::const_iterator i = folders.constBegin(); i != folders.constEnd(); i++) {
        bbpim::CalendarFolder folder = *i;
        foldersVal.append(GetFolderJson(folder, false, false));
    }

    val["folders"] = foldersVal;

    return val;
}

Json::Value AccountFolderManager::GetFolderJson(const bbpim::CalendarFolder& folder, bool skipDefaultCheck, bool fresh)
{
    Json::Value val;

    val["id"] = webworks::Utils::intToStr(folder.id());
    val["accountId"] = webworks::Utils::intToStr(folder.accountId());
    val["name"] = folder.name().toStdString();
    val["readonly"] = folder.isReadOnly();
    val["ownerEmail"] = folder.ownerEmail().toStdString();
    val["type"] = folder.type();
    val["color"] = QString("%1").arg(folder.color(), 6, 16, QChar('0')).toUpper().toStdString();
    val["visible"] = folder.isVisible();
    val["default"] = skipDefaultCheck ? true : IsDefaultFolder(folder, fresh);
    val["enterprise"] = GetAccount(folder.accountId(), false).isEnterprise() == 1 ? true : false;

    return val;
}

void AccountFolderManager::fetchAccounts()
{
    if (mutex_lock() == 0) {
        m_accountsMap.clear();
        QList<bbpimAccount::Account> accounts = getAccountService()->accounts(bbpimAccount::Service::Calendars);
        for (QList<bbpimAccount::Account>::const_iterator i = accounts.constBegin(); i != accounts.constEnd(); i++) {
            bbpimAccount::Account account = *i;
            m_accountsMap.insert(std::pair<bbpim::AccountId, bbpimAccount::Account>(account.id(), account));
        }
        mutex_unlock();
    }
}

void AccountFolderManager::fetchFolders()
{
    if (mutex_lock() == 0) {
        m_foldersMap.clear();
        QList<bbpim::CalendarFolder> folders = getCalendarService()->folders();

        for (QList<bbpim::CalendarFolder>::const_iterator i = folders.constBegin(); i != folders.constEnd(); i++) {
            bbpim::CalendarFolder folder = *i;
            std::string key = GetFolderKey(folder.accountId(), folder.id());
            m_foldersMap.insert(std::pair<std::string, bbpim::CalendarFolder>(key, folder));
        }
        mutex_unlock();
    }
}

void AccountFolderManager::fetchDefaultAccount()
{
    if (mutex_lock() == 0) {
        m_defaultAccount = getAccountService()->defaultAccount(bbpimAccount::Service::Calendars);
        mutex_unlock();
    }
}

void AccountFolderManager::fetchDefaultFolder()
{
    bbpim::AccountId accountId = GetDefaultAccount().id();
    if (mutex_lock() == 0) {
        bbpim::FolderId folderId = bbpim::FolderId(getAccountService()->getDefault(bb::pim::account::Service::Calendars));
        mutex_unlock();

        std::string key = GetFolderKey(accountId, folderId);
        if (m_foldersMap.find(key) == m_foldersMap.end()) {
            fetchFolders();
        }

        m_defaultFolder = m_foldersMap[key];
    }
}

std::string AccountFolderManager::GetFolderKey(const bbpim::AccountId accountId, const bbpim::FolderId folderId)
{
    std::string str(webworks::Utils::intToStr(accountId));
    str += '-';
    str += webworks::Utils::intToStr(folderId);
    return str;
}

bbpim::CalendarService* AccountFolderManager::getCalendarService()
{
    return m_pProvider->GetCalendarService();
}

bbpimAccount::AccountService* AccountFolderManager::getAccountService()
{
    return m_pProvider->GetAccountService();
}
