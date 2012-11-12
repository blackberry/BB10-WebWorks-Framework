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

#ifndef SENSORS_NDK_HPP_
#define SENSORS_NDK_HPP_

#include <json/value.h>
#include <pthread.h>
#include <sensor/libsensor.h>
#include <map>
#include <string>
#include <utility>

class Sensors;

namespace webworks {

struct SensorConfig {
    std::string sensor;
    int delay;
    char background;
    char batching;
    char queue;
    char reducedReporting;
};

typedef std::map<std::string, std::pair<int, SensorConfig> > SensorTypeMap;
typedef std::map<int, sensor_t*> ActiveSensorMap;

class SensorsNDK {
public:
    explicit SensorsNDK(Sensors *parent = NULL);
    ~SensorsNDK();
    void StartEvents();
    void StopEvents();
    void SetSensorOptions(const SensorConfig& config);
    void StartSensor(const std::string& sensor);
    void StopSensor(const std::string& sensor);
    static void* SensorThread(void *args);
private:
    Sensors *m_pParent;
    SensorTypeMap _sensorTypeMap;
    static ActiveSensorMap *m_pActiveSensors;
    static pthread_t m_thread;
    struct sigevent m_sigEvent;
    static int m_sensorChannel;
    static int m_coid;
    static bool m_sensorsEnabled;
    static pthread_mutex_t m_lock;
    static void stopActiveSensor(sensor_type_e sensorType);
    void createSensorMap();
};

} // namespace webworks

#endif /* SENSORS_NDK_HPP_ */
