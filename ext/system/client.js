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
    ID = require("./manifest.json").namespace;

function getFieldValue(field) {
    var value = null;

    try {
        value = window.webworks.execSync(ID, field, null);
    } catch (e) {
        console.error(e);
    }

    return value;
}

_self.hasPermission = function (module) {
    return window.webworks.execSync(ID, "hasPermission", {"module": module});
};

_self.hasCapability = function (capability) {
    return window.webworks.execSync(ID, "hasCapability", {"capability": capability});
};

window.webworks.defineReadOnlyField(_self, "ALLOW", 0);
window.webworks.defineReadOnlyField(_self, "DENY", 1);
window.webworks.defineReadOnlyField(_self, "hardwareId", getFieldValue("hardwareId"));
window.webworks.defineReadOnlyField(_self, "softwareVersion", getFieldValue("softwareVersion"));
window.webworks.execSync(ID, "registerEvents", null);

module.exports = _self;