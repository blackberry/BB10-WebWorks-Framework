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
    _applicationEvents = require("../../lib/events/applicationEvents"),
    _deviceEvents = require("../../lib/events/deviceEvents"),

    _actionMap = {
        batterystatus: {
            context: _deviceEvents,
            event: "battery.statusChange",
            trigger: function (data) {
                _event.trigger("batterystatus", data);
            }
        },
        batterylow: {
            context: _deviceEvents,
            event: "battery.chargeLow",
            trigger: function (data) {
                _event.trigger("batterylow", data);
            }
        },
        batterycritical: {
            context: _deviceEvents,
            event: "battery.chargeCritical",
            trigger: function (data) {
                _event.trigger("batterycritical", data);
            }
        },
        languagechanged: {
            context: _applicationEvents,
            event: "systemLanguageChange",
            trigger: function (language) {
                _event.trigger("languagechanged", language);
            }
        },
        regionchanged: {
            context: _applicationEvents,
            event: "systemRegionChange",
            trigger: function (region) {
                _event.trigger("regionchanged", region);
            }
        },
        fontchanged: {
            context: _applicationEvents,
            event: "fontchanged",
            trigger: function (fontFamily, fontSize) {
                _event.trigger("fontchanged", {'fontFamily': fontFamily, 'fontSize': fontSize});
            }
        }
    },
    ERROR_ID = -1;

module.exports = {
    registerEvents: function (success, fail) {
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

    hasCapability: function (success, fail, args) {
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

    getFontInfo: function (success, fail) {
        var fontFamily,
            fontSize;

        try {
            fontFamily = window.qnx.webplatform.getApplication().getSystemFontFamily();
            fontSize = window.qnx.webplatform.getApplication().getSystemFontSize();

            success({'fontFamily': fontFamily, 'fontSize': fontSize});
        } catch (e) {
            fail(ERROR_ID, e);
        }
    },

    getDeviceProperties: function (success, fail) {
        try {
            var returnObj = {
                "hardwareId" : window.qnx.webplatform.device.hardwareId,
                "softwareVersion" : window.qnx.webplatform.device.scmBundle,
                "name" : window.qnx.webplatform.device.deviceName
            };
            success(returnObj);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    region: function (success, fail) {
        var region;

        try {
            region = window.qnx.webplatform.getApplication().systemRegion;
            success(region);
        } catch (e) {
            fail(ERROR_ID, e.message);
        }
    },

    getCurrentTimezone: function (success, fail) {
        try {
            success(window.qnx.webplatform.device.timezone);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    },

    getTimezones: function (success, fail) {
        try {
            window.qnx.webplatform.device.getTimezones(success);
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    }
};
