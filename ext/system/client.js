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

var _self = {},
    ID = require("./manifest.json").namespace,
    deviceProperties;

function getFieldValue(field) {
    var value = null;

    try {
        value = window.webworks.execSync(ID, field, null);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function getDeviceProperty(field) {
    var value;

    if (!deviceProperties) {
        deviceProperties = getFieldValue("getDeviceProperties");
    }

    value = deviceProperties ? deviceProperties[field] : null;

    return value;
}

function defineGetter(field, getterArg) {
    var getter = getterArg || function () {
        return getFieldValue(field);
    };
    Object.defineProperty(_self, field, {
        get: getter
    });
}

_self.hasPermission = function (module) {
    return window.webworks.execSync(ID, "hasPermission", {"module": module});
};

_self.hasCapability = function (capability) {
    return window.webworks.execSync(ID, "hasCapability", {"capability": capability});
};

_self.getFontInfo = function () {
    return window.webworks.execSync(ID, "getFontInfo");
};

_self.getCurrentTimezone = function () {
    return window.webworks.execSync(ID, "getCurrentTimezone");
};

_self.getTimezones = function () {
    return window.webworks.execSync(ID, "getTimezones");
};

defineGetter("region");
defineGetter("language", function () {
    return navigator.language;
});

window.webworks.defineReadOnlyField(_self, "ALLOW", 0);
window.webworks.defineReadOnlyField(_self, "DENY", 1);
window.webworks.defineReadOnlyField(_self, "hardwareId", getDeviceProperty("hardwareId"));
window.webworks.defineReadOnlyField(_self, "softwareVersion", getDeviceProperty("softwareVersion"));
window.webworks.defineReadOnlyField(_self, "name", getDeviceProperty("name"));

window.webworks.execSync(ID, "registerEvents", null);

module.exports = _self;
