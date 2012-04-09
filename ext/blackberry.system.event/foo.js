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
    _fooEventStarted = false; // HACK for demo

module.exports = {
    foo: function () {
        if (_registeredEvents["BAR"]) {
            var eventData = {
                magicNum: Math.floor(Math.random() * 5)
            };

            _registeredEvents["BAR"](eventData);
        }
    },

    addEventListener: function (name, trigger) {
        if (!_registeredEvents.hasOwnProperty(name)) {
            _registeredEvents[name] = trigger; // start listening

            // HACK start event for demo
            if (!_fooEventStarted) {
                setInterval(this.foo, 5000);
                _fooEventStarted = true;
            }
        }
    },

    removeEventListener: function (name) {
        if (_registeredEvents.hasOwnProperty(name)) {
            delete _registeredEvents[name]; // stop listening
        }
    }
};