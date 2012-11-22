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
#include <string>
#include "sensors_js.hpp"
#ifndef __X86__
#include "sensors_ndk.hpp"
#endif

Sensors::Sensors(const std::string& id) : m_id(id)
{
#ifndef __X86__
    m_pSensorsController = new webworks::SensorsNDK(this);
#endif
}

Sensors::~Sensors()
{
#ifndef __X86__
    if (m_pSensorsController)
        delete m_pSensorsController;
#endif
}

char* onGetObjList()
{
    static char name[] = "Sensors";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    if (className != "Sensors") {
        return NULL;
    }

    return new Sensors(id);
}

std::string Sensors::InvokeMethod(const std::string& command)
{
#ifndef __X86__
    int index = command.find_first_of(" ");
    std::string strCommand = command.substr(0, index);
    std::string arg = command.substr(index + 1, command.length());

    if (strCommand == "setOptions") {
        Json::Reader reader;
        Json::Value obj;

        bool parse = reader.parse(arg, obj);

        if (!parse)
            return "";

        webworks::SensorConfig sensorConfig;
        sensorConfig.sensor = obj["sensor"].asString();

        if (obj.isMember("delay")) {
            sensorConfig.delay = obj["delay"].asInt();
        } else {
            sensorConfig.delay = SENSOR_CONFIG_UNDEFINED;
        }

        if (obj.isMember("background")) {
            sensorConfig.background = static_cast<bool>(obj["background"].asBool());
        } else {
            sensorConfig.background = SENSOR_CONFIG_UNDEFINED;
        }

        if (obj.isMember("queue")) {
            sensorConfig.queue = obj["queue"].asInt();
        } else {
            sensorConfig.queue = SENSOR_CONFIG_UNDEFINED;
        }

        if (obj.isMember("reducedReporting")) {
            sensorConfig.reducedReporting = obj["reducedReporting"].asBool();
        } else {
            sensorConfig.reducedReporting = SENSOR_CONFIG_UNDEFINED;
        }

        m_pSensorsController->SetSensorOptions(sensorConfig);
        return "";
    } else if (strCommand == "startSensor") {
        m_pSensorsController->StartSensor(arg);
        return "";
    } else if (strCommand == "stopSensor") {
        m_pSensorsController->StopSensor(arg);
        return "";
    } else if (strCommand == "startEvents") {
        m_pSensorsController->StartEvents();
        return "";
    } else if (strCommand == "stopEvents") {
        m_pSensorsController->StopEvents();
        return "";
    }
#endif
#ifndef __X86__
    return NULL;
#else
    return command;
#endif
}

bool Sensors::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void Sensors::NotifyEvent(const std::string& event)
{
    std::string eventString = m_id + " ";
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

