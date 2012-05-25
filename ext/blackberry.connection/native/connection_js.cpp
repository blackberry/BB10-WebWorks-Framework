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

#include <string>
#include "connection_js.hpp"
#include "connection_bps.hpp"

void* ConnectionEventThread(void *args)
{
    Connection *parent = static_cast<Connection *>(args);
    webworks::ConnectionBPS *connection  = new webworks::ConnectionBPS(parent);

    if (connection) {
        // Poll for events in ConnectionBPS. This will run until StopEvents() disables events.
        connection->WaitForEvents();

        delete connection;
    }

    return NULL;
}

Connection::Connection(const std::string& id) : m_id(id)
{
    m_thread = 0;
}

Connection::~Connection()
{
    if (m_thread) {
        StopEvents();
    }
}

char* onGetObjList()
{
    static char name[] = "Connection";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    if (className != "Connection") {
        return NULL;
    }

    return new Connection(id);
}

std::string Connection::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");

    string strCommand = command.substr(0, index);

    if (strCommand == "getType") {
        webworks::ConnectionBPS *connection = new webworks::ConnectionBPS();
        std::stringstream ss;
        ss << connection->GetConnectionType();
        delete connection;
        return ss.str();
    }
    else if (strCommand == "startEvents") {
        StartEvents();
        return "";
    }
    else if (strCommand == "stopEvents") {
        StopEvents();
        return "";
    }

    return NULL;
}

bool Connection::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void Connection::NotifyEvent(const std::string& event)
{
    std::string eventString = m_id + " connectionchange ";
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

void Connection::StartEvents()
{
    if (!m_thread) {
        webworks::ConnectionBPS::EnableEvents();
        pthread_create(&m_thread, NULL, ConnectionEventThread, static_cast<void *>(this));
    }
}

void Connection::StopEvents()
{
    if (m_thread) {
        webworks::ConnectionBPS::DisableEvents();
        pthread_join(m_thread, NULL);
        m_thread = 0;
    }
}
