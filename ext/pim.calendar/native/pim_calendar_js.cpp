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
#include <json/writer.h>
#include <string>
#include "pim_calendar_js.hpp"
#include "pim_calendar_qt.hpp"
#include "timezone_utils.hpp"

PimCalendar::PimCalendar(const std::string& id) : m_id(id)
{
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "PimCalendar";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "PimCalendar") {
        return 0;
    }

    return new PimCalendar(id);
}

std::string PimCalendar::InvokeMethod(const std::string& command)
{
    unsigned int index = command.find_first_of(" ");

    string strCommand;
    string jsonObject;
    Json::Value *obj;

    if (index != std::string::npos) {
        strCommand = command.substr(0, index);
        jsonObject = command.substr(index + 1, command.length());

        // Parse the JSON
        Json::Reader reader;
        obj = new Json::Value;
        bool parse = reader.parse(jsonObject, *obj);

        if (!parse) {
            return "Cannot parse JSON object";
        }
    } else {
        strCommand = command;
        obj = NULL;
    }

    if (strCommand == "find") {
        startThread(FindThread, obj);
    } else if (strCommand == "save") {
        startThread(SaveThread, obj);
    } else if (strCommand == "remove") {
        startThread(RemoveThread, obj);
    } else if (strCommand == "getCalendarFolders") {
        Json::FastWriter writer;
        return writer.write(webworks::PimCalendarQt::GetCalendarFolders());
    } else if (strCommand == "getDefaultCalendarFolder") {
        Json::FastWriter writer;
        return writer.write(webworks::PimCalendarQt::GetDefaultCalendarFolder());
    } else if (strCommand == "getCalendarAccounts") {
        Json::FastWriter writer;
        return writer.write(webworks::PimCalendarQt::GetCalendarAccounts());
    } else if (strCommand == "getDefaultCalendarAccount") {
        Json::FastWriter writer;
        return writer.write(webworks::PimCalendarQt::GetDefaultCalendarAccount());
    } else if (strCommand == "getEvent") {
        Json::FastWriter writer;
        std::string result = writer.write(webworks::PimCalendarQt().GetEvent(*obj));
        delete obj;
        return result;
    }

    return "";
}

bool PimCalendar::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void PimCalendar::NotifyEvent(const std::string& eventId, const std::string& event)
{
    std::string eventString = m_id + " result ";
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

bool PimCalendar::startThread(ThreadFunc threadFunction, Json::Value *jsonObj)
{
    webworks::PimCalendarThreadInfo *thread_info = new webworks::PimCalendarThreadInfo;
    thread_info->parent = this;
    thread_info->jsonObj = jsonObj;
    thread_info->eventId = jsonObj->removeMember("_eventId").asString();

    pthread_attr_t thread_attr;
    pthread_attr_init(&thread_attr);
    pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

    pthread_t thread = 0;
    pthread_create(&thread, &thread_attr, threadFunction, static_cast<void *>(thread_info));
    pthread_attr_destroy(&thread_attr);

    if (!thread) {
        return false;
    }

    return true;
}


// Static functions:

void* PimCalendar::FindThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.Find(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    delete thread_info->jsonObj;
    delete thread_info;
    return NULL;
}

void* PimCalendar::SaveThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.Save(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    delete thread_info->jsonObj;
    delete thread_info;
    return NULL;
}

void* PimCalendar::RemoveThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.DeleteCalendarEvent(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    delete thread_info->jsonObj;
    delete thread_info;
    return NULL;
}

