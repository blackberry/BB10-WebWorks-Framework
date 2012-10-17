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

#include <json/reader.h>
#include <stdio.h>
#include <string>
#include "push_js.hpp"
#include "push_ndk.hpp"


Push::Push(const std::string& id) : m_id(id)
{
    m_pushNDK = new webworks::PushNDK(this);
}

Push::~Push()
{
    if (m_pushNDK) {
        delete m_pushNDK;
    }
}

char* onGetObjList()
{
    static char name[] = "Push";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    if (className != "Push") {
        return NULL;
    }

    return new Push(id);
}

std::string Push::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");
    string strCommand = command.substr(0, index);

    // Parse JSON object
    Json::Value obj;

    if (static_cast<int>(command.length()) > index && index != -1) {
        std::string jsonObject = command.substr(index + 1, command.length());
        Json::Reader reader;

        bool parse = reader.parse(jsonObject, obj);
        if (!parse) {
            fprintf(stderr, "%s", "error parsing\n");
            return "Cannot parse JSON object";
        }
    }

    if (strCommand == "startService") {
        std::string invokeTargetId = obj["invokeTargetId"].asString();
        std::string appId = obj["appId"].asString();
        std::string ppgUrl = obj["ppgUrl"].asString();

        m_pushNDK->StartService(invokeTargetId, appId, ppgUrl);
        return "";

    } else if (strCommand == "createChannel") {
        m_pushNDK->CreateChannel();
        return "";

    } else if (strCommand == "destroyChannel") {
        m_pushNDK->DestroyChannel();
        return "";

    } else if (strCommand == "extractPushPayload") {
        // NOTE: The push data uses a NULL character to seperate the metadata and
        // the payload. If the invoke framework changes and does not use base64 anymore,
        // we should check if the NULL character will cause problems with the string
        // library functions.
        std::string data = obj["data"].asString();
        return m_pushNDK->ExtractPushPayload(data);

    } else if (strCommand == "registerToLaunch") {
        m_pushNDK->RegisterToLaunch();
        return "";

    } else if (strCommand == "unregisterFromLaunch") {
        m_pushNDK->UnregisterFromLaunch();
        return "";

    } else if (strCommand == "acknowledge") {
        std::string payloadId = obj["id"].asString();
        bool shouldAccept = obj["shouldAcceptPush"].asBool();

        m_pushNDK->Acknowledge(payloadId, shouldAccept);
        return "";
    }

    return "Unsupported method";
}

bool Push::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void Push::NotifyEvent(const std::string& eventId, const std::string& eventArgs)
{
    std::string eventString = m_id;
    eventString.append(" ");
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(eventArgs);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

