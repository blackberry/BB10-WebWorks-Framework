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

#include <pthread.h>
#include <string>
#include <vector>

#include "../common/plugin.h"

#ifndef DIALOG_JS_H_
#define DIALOG_JS_H_

class Dialog : public JSExt
{
public:
    explicit Dialog(const std::string& id);
    virtual ~Dialog() {}
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& event);
    void StartThread();
    void StopThread();
private:
    pthread_t m_thread;
    std::string m_message;
    std::vector<std::string> m_buttons;
    std::string m_id;
};

#endif // DIALOG_JS_H_
