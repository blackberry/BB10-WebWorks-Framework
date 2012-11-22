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

#ifndef PIM_CALENDAR_ACCT_FOLDER_MGR_HPP_
#define PIM_CALENDAR_ACCT_FOLDER_MGR_HPP_

#include <json/value.h>
#include <bb/pim/account/Account>
#include <bb/pim/account/AccountService>
#include <bb/pim/calendar/CalendarFolder>
#include <string>
#include <map>

#include "service_provider.hpp"
#include "thread_sync.hpp"

namespace bbpim = bb::pim::calendar;
namespace bbpimAccount = bb::pim::account;

typedef std::map<std::string, bbpim::CalendarFolder> FolderMap;
typedef std::map<bbpim::AccountId, bbpimAccount::Account> AccountMap;

class AccountFolderManager : public ThreadSync {
public:
    explicit AccountFolderManager(ServiceProvider* provider);
    bbpimAccount::Account GetAccount(bbpim::AccountId accountId, bool fresh = true);
    bbpimAccount::Account GetDefaultAccount(bool fresh = true);
    QList<bbpimAccount::Account> GetAccounts(bool fresh = true);
    bbpim::CalendarFolder GetFolder(bbpim::AccountId accountId, bbpim::FolderId folderId, bool fresh = true);
    bbpim::CalendarFolder GetDefaultFolder(bool fresh = true);
    QList<bbpim::CalendarFolder> GetFolders(bool fresh = true);
    QList<bbpim::CalendarFolder> GetFoldersForAccount(bbpim::AccountId accountId, bool fresh = true);
    bool IsDefaultFolder(const bbpim::CalendarFolder& folder, bool fresh = true);
    Json::Value GetFolderJson(const bbpim::CalendarFolder& folder, bool skipDefaultCheck = false, bool fresh = true);
    Json::Value GetAccountJson(const bbpimAccount::Account& account, bool fresh = true);
    static std::string GetFolderKey(const bbpim::AccountId accountId, const bbpim::FolderId);

private:
    bbpim::CalendarService* getCalendarService();
    bbpimAccount::AccountService* getAccountService();
    void fetchAccounts();
    void fetchFolders();
    void fetchDefaultAccount();
    void fetchDefaultFolder();

    FolderMap m_foldersMap;
    AccountMap m_accountsMap;
    bbpimAccount::Account m_defaultAccount;
    bbpim::CalendarFolder m_defaultFolder;
    ServiceProvider* m_pProvider;
};

#endif // PIM_CALENDAR_ACCT_FOLDER_MGR_HPP_
