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

#include "dialog_js.hpp"
#include "dialog_bps.hpp"
#include <bps/bps.h>
#include <pthread.h>
#include <json/reader.h>
#include <sstream>
#include <string>

webworks::DialogConfig *dialogConfig;

void* DialogThread(void *parent)
{
    webworks::DialogBPS *dialog = new webworks::DialogBPS();
    // Parent object is casted so we can use it
    Dialog *pParent = static_cast<Dialog *>(parent);

    // Call show method in dialog
    int result = dialog->Show(dialogConfig);

    if (result != -1) {
        // Convert int to string
        std::stringstream ss;
        ss << result;
        std::string button = ss.str();
        // Call notify event on parent object pointer
        pParent->NotifyEvent(button);
    }

    if (dialogConfig) {
        delete dialogConfig;
        dialogConfig = 0;
    }

    if (dialog) {
        delete dialog;
    }

    pParent->StopThread();
    return NULL;
}

Dialog::Dialog(const std::string& id) : m_id(id)
{
    m_thread = 0;
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "Dialog";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "Dialog") {
        return 0;
    }

    return new Dialog(id);
}

std::string Dialog::InvokeMethod(const std::string& command)
{
    int index = command.find_first_of(" ");

    string strCommand = command.substr(0, index);
    string jsonObject = command.substr(index + 1, command.length());

    if (strCommand == "show") {
        // parse the JSON
        Json::Reader reader;
        Json::Value obj;
        bool parse = reader.parse(jsonObject, obj);

        if (!parse) {
            fprintf(stderr, "%s", "error parsing\n");
            return "Cannot parse JSON object";
        }

        // Check to see if we are currently displaying a dialog
        if (!m_thread) {
            // Fill dialog config struct with information from JSON object
            dialogConfig = new webworks::DialogConfig;
            dialogConfig->title = obj["title"].asString();
            dialogConfig->message = obj["message"].asString();
            dialogConfig->size = obj["size"].asString();
            dialogConfig->position = obj["position"].asString();
            dialogConfig->windowGroup = obj["windowGroup"].asString();
            dialogConfig->global = obj["global"].asBool();
            const Json::Value buttonsArray = obj["buttons"];

            for (int i = 0; i < buttonsArray.size(); ++i) {
                dialogConfig->buttons.push_back(buttonsArray[i].asString());
            }

            StartThread();
        }
    }

    return "";
}

bool Dialog::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void Dialog::NotifyEvent(const std::string& event)
{
    std::string eventString = m_id + " result ";
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

void Dialog::StartThread()
{
    if (!m_thread) {
        pthread_attr_t thread_attr;
        pthread_attr_init(&thread_attr);
        pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

        pthread_create(&m_thread, &thread_attr, DialogThread, static_cast<void *>(this));
        pthread_attr_destroy(&thread_attr);
    }
}

void Dialog::StopThread()
{
    m_thread = 0;
}

