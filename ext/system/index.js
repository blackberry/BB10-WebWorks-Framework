/*
 * Copyright 2011-2012 Research In Motion Limited.
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
var Whitelist = require("../../lib/policy/whitelist").Whitelist,
    _whitelist = new Whitelist(),
    _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    _ppsUtils = require("../../lib/pps/ppsUtils"),
    _ppsEvents = require("../../lib/pps/ppsEvents"),
    // This object is used by action map and contains links between pps object fields monitored for change in that object helper methods
    // to analyze if the value is the one callback should be invoked and fields name and value format as would appear on return.
    // Set disableOnChange to true if not interested on change for a particular field but still interested to return its value.  
    _eventsMap = {
        batterycritical: {
            eventName: "batterycritical",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    fieldValue: null,
                    reset: function () {
                        this.setFieldValue(null);
                    },
                    setFieldValue: function (value) {
                        this.fieldValue = value ? this.formatValue(value) : value;
                    },
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    },
                    skipTrigger: function (value) {
                        var threshold = 4,
                            formattedValue = this.formatValue(value),
                            result = (formattedValue > threshold) || (this.fieldValue && this.fieldValue <= threshold);

                        this.fieldValue = formattedValue;

                        return result;
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                disableOnChange: true,
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        },
        batterylow: {
            eventName: "batterylow",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    fieldValue: null,
                    reset: function () {
                        this.setFieldValue(null);
                    },
                    setFieldValue: function (value) {
                        this.fieldValue = value ? this.formatValue(value) : value;
                    },
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    },
                    skipTrigger: function (value) {
                        var threshold = 14,
                            formattedValue = this.formatValue(value),
                            result = (formattedValue > threshold) || (this.fieldValue && this.fieldValue <= threshold);

                        this.fieldValue = value;

                        return result;
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                disableOnChange: true,
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        },
        batterystatus: {
            eventName: "batterystatus",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        },
        languagechanged: {
            eventName: "languagechanged",
            eventDetailsArr: [{
                path: "/pps/services/confstr/_CS_LOCALE?wait,delta",
                fieldNameArr: [{
                    eventName: "_CS_LOCALE",
                    paramName: "language",
                    formatValue: function (str) {
                        return str;
                    }
                }]
            }],
            mode: 0
        },
        regionchanged: {
            eventName: "regionchanged",
            eventDetailsArr: [{
                path: "/pps/services/locale/settings?wait,delta",
                fieldNameArr: [{
                    eventName: "region",
                    paramName: "region",
                    formatValue: function (str) {
                        return str;
                    }
                }]
            }],
            mode: 0
        }
    },
    _actionMap = {
        batterycritical: {
            context: _ppsEvents,
            event: _eventsMap.batterycritical,
            trigger: function (args) {
                _event.trigger("batterycritical", args);
            }
        },
        batterylow: {
            context: _ppsEvents,
            event: _eventsMap.batterylow,
            trigger: function (args) {
                _event.trigger("batterylow", args);
            }
        },
        batterystatus: {
            context: _ppsEvents,
            event: _eventsMap.batterystatus,
            trigger: function (args) {
                _event.trigger("batterystatus", args);
            }
        },
        languagechanged: {
            context: _ppsEvents,
            event: _eventsMap.languagechanged,
            trigger: function (args) {
                _event.trigger("languagechanged", args.language);
            }
        },
        regionchanged: {
            context: _ppsEvents,
            event: _eventsMap.regionchanged,
            trigger: function (args) {
                _event.trigger("regionchanged", args.region);
            }
        }
    },
    _deviceprops;

/*
 * Read the PPS object once and cache it for future calls
 */
function readDeviceProperties() {
    var PPSUtils = _ppsUtils.createObject();

    PPSUtils.init();

    if (PPSUtils.open("/pps/services/deviceproperties", "0")) {
        _deviceprops = PPSUtils.read();
    }

    PPSUtils.close();
}

function getDeviceProperty(prop, success, fail) {
    if (!_deviceprops) {
        readDeviceProperties();
    }

    if (_deviceprops) {
        success(_deviceprops[prop]);
    } else {
        fail(-1, "Cannot open PPS object");
    }
}

// Get device language object from /pps/services/confstr/_CS_LOCALE
function readDeviceLanguage(success, fail) {
    var PPSUtils = _ppsUtils.createObject(),
        language = "";

    PPSUtils.init();

    if (PPSUtils.open("/pps/services/confstr/_CS_LOCALE", "0")) {
        language = PPSUtils.read()._CS_LOCALE;
    }

    PPSUtils.close();

    if (language !== "") {
        success(language);
    } else {
        fail(-1, "Cannot read the device language");
    }
}

// Get device region setting from /pps/services/locale/settings object
function readDeviceRegion(success, fail) {
    var PPSUtils = _ppsUtils.createObject(),
        region = "";

    PPSUtils.init();

    if (PPSUtils.open("/pps/services/locale/settings", "0")) {
        region = PPSUtils.read().region;
    }

    PPSUtils.close();

    if (region !== "") {
        success(region);
    } else {
        fail(-1, "Cannot read the device region setting");
    }
}

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

    hasPermission: function (success, fail, args, env) {
        // TODO string argument surrounded by %22
        // preserve dot for feature id
        var module = args.module.replace(/[^a-zA-Z.]+/g, ""),
            allowed = _whitelist.isFeatureAllowed(env.request.origin, module);

        // ALLOW - 0, DENY - 1
        success(allowed ? 0 : 1);
    },

    hasCapability: function (success, fail, args, env) {
        var SUPPORTED_CAPABILITIES = [
                "input.touch",
                "location.gps",
                "media.audio.capture",
                "media.video.capture",
                "media.recording",
                "network.bluetooth",
                "network.wlan"
            ],
            // TODO string argument surrounded by %22
            // preserve dot for capabiliity
            capability = args.capability.replace(/[^a-zA-Z.]+/g, "");

        success(SUPPORTED_CAPABILITIES.indexOf(capability) >= 0);
    },

    hardwareId: function (success, fail, args, env) {
        getDeviceProperty("hardwareid", success, fail);
    },

    softwareVersion: function (success, fail, args, env) {
        getDeviceProperty("scmbundle", success, fail);
    },

    language: function (success, fail, args, env) {
        readDeviceLanguage(success, fail);
    },

    region: function (success, fail, args, env) {
        readDeviceRegion(success, fail);
    }
};
