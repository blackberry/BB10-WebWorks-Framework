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

#ifndef SENSORS_JS_HPP_
#define SENSORS_JS_HPP_

#define SENSOR_CONFIG_UNDEFINED -1

#include <plugin.h>
#include <sstream>
#include <string>
#include "sensors_ndk.hpp"

class Sensors : public JSExt
{
public:
    explicit Sensors(const std::string& id);
    virtual ~Sensors();
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& event);
private:
    std::string m_id;
    webworks::SensorsNDK *m_pSensorsController;
};

#endif /* SENSORS_JS_HPP_ */
