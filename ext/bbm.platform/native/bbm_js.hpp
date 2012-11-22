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

#ifndef BBM_JS_HPP_
#define BBM_JS_HPP_

#include <pthread.h>
#include <string>
#include <vector>

#include "../common/plugin.h"
#include "bbm_bps.hpp"

class BBM : public JSExt
{
public:
    explicit BBM(const std::string& id);
    virtual ~BBM() {}
    static void* BBMEventThread(void *parent);
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& event);
    void StartEvents();
    void StopEvents();
private:
    std::string m_id;
    pthread_t m_thread;
    webworks::BBMBPS* m_pBBMController;
};

#endif // BBM_JS_HPP_
