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

var sensors = require("./sensorsJNEXT").sensors,
    _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    _sensorEvents = require("./sensorsEvents"),
    _actionMap = {
        deviceaccelerometer: {
            context: _sensorEvents,
            event: "deviceaccelerometer",
            trigger: function (obj) {
                _event.trigger("deviceaccelerometer", obj);
            }
        },
        devicemagnetometer: {
            context: _sensorEvents,
            event: "devicemagnetometer",
            trigger: function (obj) {
                _event.trigger("devicemagnetometer", obj);
            }
        },
        devicegyroscope: {
            context: _sensorEvents,
            event: "devicegyroscope",
            trigger: function (obj) {
                _event.trigger("devicegyroscope", obj);
            }
        },
        devicecompass: {
            context: _sensorEvents,
            event: "devicecompass",
            trigger: function (obj) {
                _event.trigger("devicecompass", obj);
            }
        },                        
        deviceproximity: {
            context: _sensorEvents,
            event: "deviceproximity",
            trigger: function (obj) {
                _event.trigger("deviceproximity", obj);
            }
        },
        devicelight: {
            context: _sensorEvents,
            event: "devicelight",
            trigger: function (obj) {
                _event.trigger("devicelight", obj);
            }
        },
        devicegravity: {
            context: _sensorEvents,
            event: "devicegravity",
            trigger: function (obj) {
                _event.trigger("devicegravity", obj);
            }
        },
        devicelinearacceleration: {
            context: _sensorEvents,
            event: "devicelinearacceleration",
            trigger: function (obj) {
                _event.trigger("devicelinearacceleration", obj);
            }
        },
        devicerotationmatrix: {
            context: _sensorEvents,
            event: "devicerotationmatrix",
            trigger: function (obj) {
                _event.trigger("devicerotationmatrix", obj);
            }
        },
        deviceorientation: {
            context: _sensorEvents,
            event: "deviceorientation",
            trigger: function (obj) {
                _event.trigger("deviceorientation", obj);
            }
        },        
        deviceazimuthpitchroll: {
            context: _sensorEvents,
            event: "deviceazimuthpitchroll",
            trigger: function (obj) {
                _event.trigger("deviceazimuthpitchroll", obj);
            }
        },
        deviceholster: {
            context: _sensorEvents,
            event: "deviceholster",
            trigger: function (obj) {
                _event.trigger("deviceholster", obj);
            }
        }
    };

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    setOptions: function (success, fail, args) {
        if (args.options) {
            args.options = JSON.parse(decodeURIComponent(args.options));

            if (args.options.sensor === "") {
                fail(-1, "Must specify a sensor");
            }
            success(sensors.getInstance().setOptions(args.options));
        } else {
            fail(-1, "Need to specify arguments");
        }
    }
};
