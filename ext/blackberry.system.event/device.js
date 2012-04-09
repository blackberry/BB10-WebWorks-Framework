/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var _registeredEvents = {},
    _batteryEventStarted = false; // HACK for demo

module.exports = {
    // Gets executed when battery level changed, native code needs to call this
    batteryLevelChanged: function () {
        if (_registeredEvents["QNX_BATTERY_CHANGED_STUFF"]) {

            // Need some way to get event data
            var eventData = {
                firedAt: new Date().toString(),
                magicNum: Math.floor(Math.random() * 11)
            };

            _registeredEvents["QNX_BATTERY_CHANGED_STUFF"](eventData);
        }
    },

    addEventListener: function (name, trigger) {
        if (!_registeredEvents.hasOwnProperty(name)) {
            _registeredEvents[name] = trigger; // start listening

            // HACK start event for demo
            if (!_batteryEventStarted) {
                setInterval(this.batteryLevelChanged, 10000);
                _batteryEventStarted = true;
            }
        }
    },

    removeEventListener: function (name, trigger) {
        if (_registeredEvents.hasOwnProperty(name)) {
            delete _registeredEvents[name]; // stop listening
        }
    }
};