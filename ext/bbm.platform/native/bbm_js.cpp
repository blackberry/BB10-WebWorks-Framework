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

#include <bps/bps.h>
#include <pthread.h>
#include <json/reader.h>
#include <sstream>
#include <string>

#include "bbm_js.hpp"

static bool eventsInitialized = false;

void* BBM::BBMEventThread(void *parent)
{
    // Parent object is casted so we can use it
    BBM *pParent = static_cast<BBM *>(parent);

    webworks::BBMBPS *bbmEvents = new webworks::BBMBPS(pParent);

    if (bbmEvents->InitializeEvents()) {
        eventsInitialized = true;
        bbmEvents->WaitForEvents();
    }

    return NULL;
}

BBM::BBM(const std::string& id) : m_id(id), m_thread(0)
{
    m_pBBMController = new webworks::BBMBPS(this);

    m_pBBMController->SetActiveChannel(m_pBBMController->GetActiveChannel());
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "BBM";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "BBM") {
        return 0;
    }

    return new BBM(id);
}

std::string BBM::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");

    string strCommand = command.substr(0, index);
    string strParam = command.substr(index + 1, command.length());

    Json::Reader reader;
    Json::Value obj;

    if (strCommand == "startEvents") {
        StartEvents();
    }

    if (!eventsInitialized) {
        return "";
    } else if (strCommand == "stopEvents") {
        StopEvents();
    } else if (strCommand == "startContactEvents") {
        StartEvents();
        m_pBBMController->StartContactEvents();
    } else if (strCommand == "stopContactEvents") {
        m_pBBMController->StopContactEvents();
    } else if (strCommand == "register") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        const std::string uuid = obj["uuid"].asString();

        m_pBBMController->Register(uuid);
    } else if (strCommand == "self.getProfile") {
        return m_pBBMController->GetProfile(strParam);
    } else if (strCommand == "self.getDisplayPicture") {
        m_pBBMController->GetDisplayPicture();
    } else if (strCommand == "self.setStatus") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        int status = 0;
        const std::string strStatus = obj["status"].asString();
        const std::string strStatusMessage = obj["statusMessage"].asString();

        if (strStatus == "available") {
            status = 0;
        } else if (strStatus == "busy") {
            status = 1;
        }

        m_pBBMController->SetStatus(status, strStatusMessage);
    } else if (strCommand == "self.setPersonalMessage") {
        m_pBBMController->SetPersonalMessage(strParam);
    } else if (strCommand == "self.setDisplayPicture") {
        m_pBBMController->SetDisplayPicture(strParam);
    } else if (strCommand == "self.profilebox.addItem") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        m_pBBMController->ProfileBoxAddItem(obj);
    } else if (strCommand == "self.profilebox.removeItem") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        m_pBBMController->ProfileBoxRemoveItem(obj);
    } else if (strCommand == "self.profilebox.clearItems") {
        m_pBBMController->ProfileBoxClearItems();
    } else if (strCommand == "self.profilebox.registerIcon") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        m_pBBMController->ProfileBoxRegisterIcon(obj);
    } else if (strCommand == "self.profilebox.getItemIcon") {
        if (!reader.parse(strParam, obj)) {
            return "";
        }

        m_pBBMController->ProfileBoxGetItemIcon(obj);
    } else if (strCommand == "self.profilebox.getItems") {
        return m_pBBMController->ProfileBoxGetItems();
    } else if (strCommand == "self.profilebox.getAccessible") {
        return m_pBBMController->ProfileBoxGetAccessible();
    } else if (strCommand == "users.inviteToDownload") {
        m_pBBMController->InviteToDownload();
    } else if (strCommand == "users.getContactsWithApp") {
        m_pBBMController->GetContactsWithApp();
    }

    return "";
}

bool BBM::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void BBM::NotifyEvent(const std::string& event)
{
    std::string eventString = m_id;
    eventString.append(" ");
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

void BBM::StartEvents()
{
    if (!m_thread) {
        eventsInitialized = false;
        int error = pthread_create(&m_thread, NULL, BBMEventThread, static_cast<void *>(this));

        if (error) {
            m_thread = 0;
        }
    }
}

void BBM::StopEvents()
{
    if (m_thread) {
        // Ensure that the secondary thread was initialized
        while (!eventsInitialized);

        webworks::BBMBPS::SendEndEvent();
        eventsInitialized = false;
        pthread_join(m_thread, NULL);
        m_thread = 0;
    }
}

