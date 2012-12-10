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
var _self = {},
    _ID = require("./manifest.json").namespace,
    sensorArray = null;

Object.defineProperty(_self, "supportedSensors", {
    get: function () {
        if (sensorArray === null) {
            sensorArray = window.webworks.execSync(_ID, "supportedSensors");
        }
        return sensorArray;
    }
});

_self.setOptions = function (sensor, options) {
    var args = { "options" : options };
    args.options.sensor = sensor;
    return window.webworks.execSync(_ID, "setOptions", args);
};

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;
