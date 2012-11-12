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

#ifndef __X86__
#define SENSOR_MSG_PULSE 64
#define SENSOR_BASE_PULSE 128

#include <json/writer.h>
#include <sensor/libsensor.h>
#include <sys/netmgr.h>
#include <sys/neutrino.h>
#include <errno.h>
#include <stdio.h>
#include <algorithm>
#include <string>

#include "sensors_ndk.hpp"
#include "sensors_js.hpp"

#define MUTEX_LOCK() pthread_mutex_trylock(&m_lock)
#define MUTEX_UNLOCK() pthread_mutex_unlock(&m_lock)

namespace webworks {

int SensorsNDK::m_sensorChannel;
int SensorsNDK::m_coid;
bool SensorsNDK::m_sensorsEnabled;
ActiveSensorMap *SensorsNDK::m_pActiveSensors;
pthread_t SensorsNDK:: m_thread = 0;
pthread_mutex_t SensorsNDK::m_lock = PTHREAD_MUTEX_INITIALIZER;

SensorsNDK::SensorsNDK(Sensors *parent) : m_pParent(parent)
{
    m_pActiveSensors = new ActiveSensorMap();
    createSensorMap();
}

SensorsNDK::~SensorsNDK()
{
    StopEvents();
    if (m_pActiveSensors) {
        delete m_pActiveSensors;
    }

    pthread_mutex_destroy(&m_lock);
}

void SensorsNDK::StartEvents()
{
    if (!m_thread) {
        int error = pthread_create(&m_thread, NULL, SensorThread, static_cast<void *>(m_pParent));

        if (error) {
            m_thread = 0;
        } else {
            MUTEX_LOCK();
        }
    }
}

void SensorsNDK::StopEvents()
{
    MsgSendPulse(m_coid, SIGEV_PULSE_PRIO_INHERIT, SENSOR_MSG_PULSE, 0);
    if (m_thread) {
        pthread_join(m_thread, NULL);
        m_thread = 0;
        m_sensorsEnabled = false;
    }
}

void SensorsNDK::SetSensorOptions(const SensorConfig& config)
{
    MUTEX_LOCK();
    const SensorTypeMap::iterator findSensor = _sensorTypeMap.find(config.sensor);
    if (findSensor != _sensorTypeMap.end()) {
        findSensor->second.second = config;
    }
    MUTEX_UNLOCK();
}

void SensorsNDK::StartSensor(const std::string& sensorString)
{
    if (!m_sensorsEnabled) {
        StartEvents();
    }

    MUTEX_LOCK();
    const SensorTypeMap::iterator findSensor = _sensorTypeMap.find(sensorString);
    if (findSensor != _sensorTypeMap.end()) {
        sensor_type_e sensorType = static_cast<sensor_type_e>(findSensor->second.first);

        const ActiveSensorMap::iterator findActiveSensor = m_pActiveSensors->find(sensorType);
        if (findActiveSensor == m_pActiveSensors->end()) {
            sensor_t *sensor = NULL;
            SensorConfig *config = &findSensor->second.second;
            sensor = sensor_new(sensorType);
            SIGEV_PULSE_INIT(&m_sigEvent, m_coid, SIGEV_PULSE_PRIO_INHERIT, SENSOR_BASE_PULSE + sensorType, sensor);
            sensor_event_notify(sensor, &m_sigEvent);

            if (config->delay != SENSOR_CONFIG_UNDEFINED) {
                sensor_set_delay(sensor, config->delay);
            }

            if (config->queue != SENSOR_CONFIG_UNDEFINED) {
                sensor_set_queue(sensor, config->queue);
            }

            if (config->batching != SENSOR_CONFIG_UNDEFINED) {
                sensor_set_batching(sensor, config->batching);
            }

            if (config->background != SENSOR_CONFIG_UNDEFINED) {
                sensor_set_background(sensor, config->background);
            }

            if (config->reducedReporting != SENSOR_CONFIG_UNDEFINED) {
                sensor_set_reduced_reporting(sensor, config->reducedReporting);
            }

            m_pActiveSensors->insert(std::make_pair(sensorType, sensor));
        }
    }
    MUTEX_UNLOCK();
}

void SensorsNDK::StopSensor(const std::string& sensor)
{
    MUTEX_LOCK();
    if (m_sensorsEnabled) {
        const SensorTypeMap::iterator findSensor = _sensorTypeMap.find(sensor);
        if (findSensor != _sensorTypeMap.end()) {
            stopActiveSensor(static_cast<sensor_type_e>(findSensor->second.first));
        }
    }
    MUTEX_UNLOCK();
}

void *SensorsNDK::SensorThread(void *args)
{
    Sensors *parent = reinterpret_cast<Sensors *>(args);
    struct _pulse pulse;

    // create channel for events
    m_sensorChannel = ChannelCreate(0);
    m_coid = ConnectAttach(ND_LOCAL_NODE, 0, m_sensorChannel, _NTO_SIDE_CHANNEL, 0);

    m_sensorsEnabled = true;

    for (;;) {
        MUTEX_UNLOCK();
        if (EOK == MsgReceivePulse(m_sensorChannel, &pulse, sizeof(pulse), NULL)) {
        MUTEX_LOCK();
            if (pulse.code == SENSOR_MSG_PULSE) {
                ActiveSensorMap::iterator it;
                for (it = m_pActiveSensors->begin(); it != m_pActiveSensors->end(); ++it) {
                    stopActiveSensor(static_cast<sensor_type_e>((*it).first));
                }
                break;
            }
            Json::FastWriter writer;
            Json::Value root;

            sensor_event_t event;
            sensor_t *sensor = static_cast<sensor_t *>(pulse.value.sival_ptr);
            sensor_get_event(sensor, &event);

            std::string accuracy;
            std::string sensorEvent;

            switch (event.accuracy)
            {
                case SENSOR_ACCURACY_UNRELIABLE:
                    accuracy = "unreliable";
                    break;
                case SENSOR_ACCURACY_LOW:
                    accuracy = "low";
                    break;
                case SENSOR_ACCURACY_MEDIUM:
                    accuracy = "medium";
                    break;
                case SENSOR_ACCURACY_HIGH:
                    accuracy = "high";
                    break;
            }

            // additional sensor information
            root["accuracy"] = accuracy;
            root["timestamp"] = event.timestamp;

            sensor_info_t sensorInfo;
            sensor_get_info(sensor, &sensorInfo);

            // useful sensor information
            root["min"] = sensorInfo.range_min;
            root["max"] = sensorInfo.range_max;

            switch (event.type)
            {
                case SENSOR_TYPE_ACCELEROMETER:
                    sensorEvent = "deviceaccelerometer";
                    root["x"] = event.motion.dsp.x;
                    root["y"] = event.motion.dsp.y;
                    root["z"] = event.motion.dsp.z;
                    break;
                case SENSOR_TYPE_MAGNETOMETER:
                    sensorEvent = "devicemagnetometer";
                    root["x"] = event.motion.dsp.x;
                    root["y"] = event.motion.dsp.y;
                    root["z"] = event.motion.dsp.z;
                    break;
                case SENSOR_TYPE_GYROSCOPE:
                    sensorEvent = "devicegyroscope";
                    root["x"] = event.motion.dsp.x;
                    root["y"] = event.motion.dsp.y;
                    root["z"] = event.motion.dsp.z;
                    root["temperature"] = event.motion.gyro.temperature;
                    break;
                case SENSOR_TYPE_COMPASS:
                    sensorEvent = "devicecompass";
                    root["value"] = event.compass_s.azimuth;
                    root["isFaceDown"] = event.compass_s.is_face_down;
                    break;
                case SENSOR_TYPE_PROXIMITY:
                    sensorEvent = "deviceproximity";
                    root["value"] = event.proximity_s.distance;
                    root["normalized"] = event.proximity_s.normalized;
                    break;
                case SENSOR_TYPE_LIGHT:
                    sensorEvent = "devicelight";
                    root["value"] = event.light_s.illuminance;
                    break;
                case SENSOR_TYPE_GRAVITY:
                    sensorEvent = "devicegravity";
                    root["x"] = event.motion.dsp.x;
                    root["y"] = event.motion.dsp.y;
                    root["z"] = event.motion.dsp.z;
                    break;
                case SENSOR_TYPE_LINEAR_ACCEL:
                    sensorEvent = "devicelinearacceleration";
                    root["x"] = event.motion.dsp.x;
                    root["y"] = event.motion.dsp.y;
                    root["z"] = event.motion.dsp.z;
                    break;
                case SENSOR_TYPE_ROTATION_MATRIX:
                    sensorEvent = "devicerotationmatrix";
                    for (unsigned int i = 0; i < 9; i++) {
                        root["matrix"].append(event.rotation_matrix[i]);
                    }
                    break;
                case SENSOR_TYPE_ORIENTATION:
                    sensorEvent = "deviceorientation";
                    root["screen"] = event.orientation.screen;
                    root["face"] = event.orientation.face;
                    break;
                case SENSOR_TYPE_AZIMUTH_PITCH_ROLL:
                    sensorEvent = "deviceazimuthpitchroll";
                    root["azimuth"] = event.apr.azimuth;
                    root["pitch"] = event.apr.pitch;
                    root["roll"] = event.apr.roll;
                    break;
                case SENSOR_TYPE_HOLSTER:
                    sensorEvent = "deviceholster";
                    root["value"] = event.holster_s.holstered;
                    break;
                case SENSOR_TYPE_ROTATION_VECTOR:
                case SENSOR_TYPE_FACE_DETECT:
                case SENSOR_TYPE_ALTIMETER:
                case SENSOR_TYPE_TEMPERATURE:
                case SENSOR_TYPE_PRESSURE:
                    // not supported
                    break;
            }

            sensor_event_notify_rearm(sensor);
            parent->NotifyEvent(sensorEvent + " " +  writer.write(root));
        }
    }

    //clean up channels
    ConnectDetach(m_coid);
    ChannelDestroy(m_sensorChannel);
    return NULL;
}


void SensorsNDK::stopActiveSensor(sensor_type_e sensorType)
{
    const ActiveSensorMap::iterator findActiveSensor = m_pActiveSensors->find(sensorType);
    if (findActiveSensor != m_pActiveSensors->end()) {
        sensor_t *sensor = (*m_pActiveSensors)[sensorType];
        sensor_delete(&sensor);
        m_pActiveSensors->erase(findActiveSensor);
    }
}

void SensorsNDK::createSensorMap()
{
    SensorConfig config;
    _sensorTypeMap["deviceaccelerometer"] = std::make_pair(SENSOR_TYPE_ACCELEROMETER, config);
    _sensorTypeMap["devicemagnetometer"] = std::make_pair(SENSOR_TYPE_MAGNETOMETER, config);
    _sensorTypeMap["devicegyroscope"] = std::make_pair(SENSOR_TYPE_GYROSCOPE, config);
    _sensorTypeMap["devicecompass"] = std::make_pair(SENSOR_TYPE_COMPASS, config);
    _sensorTypeMap["deviceproximity"] = std::make_pair(SENSOR_TYPE_PROXIMITY, config);
    _sensorTypeMap["devicelight"] = std::make_pair(SENSOR_TYPE_LIGHT, config);
    _sensorTypeMap["devicegravity"] = std::make_pair(SENSOR_TYPE_GRAVITY, config);
    _sensorTypeMap["devicelinearacceleration"] = std::make_pair(SENSOR_TYPE_LINEAR_ACCEL, config);
    _sensorTypeMap["devicerotationmatrix"] = std::make_pair(SENSOR_TYPE_ROTATION_MATRIX, config);
    _sensorTypeMap["deviceorientation"] = std::make_pair(SENSOR_TYPE_ORIENTATION, config);
    _sensorTypeMap["deviceazimuthpitchroll"] = std::make_pair(SENSOR_TYPE_AZIMUTH_PITCH_ROLL, config);
    _sensorTypeMap["deviceholster"] = std::make_pair(SENSOR_TYPE_HOLSTER, config);
}
}
#endif
