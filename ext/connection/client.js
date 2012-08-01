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
    UNKNOWN = "unknown";

Object.defineProperty(_self, "type", {
    get: function () {
        var type;

        try {
            type = window.webworks.execSync(_ID, "type");
        } catch (e) {
            type = UNKNOWN;
            console.error(e);
        }

        return type;
    }
});

/*
 * Define constants for type constants
 */
window.webworks.defineReadOnlyField(_self, "UNKNOWN", UNKNOWN);
window.webworks.defineReadOnlyField(_self, "ETHERNET", "ethernet");
window.webworks.defineReadOnlyField(_self, "WIFI", "wifi");
window.webworks.defineReadOnlyField(_self, "BLUETOOTH_DUN", "bluetooth_dun");
window.webworks.defineReadOnlyField(_self, "USB", "usb");
window.webworks.defineReadOnlyField(_self, "VPN", "vpn");
window.webworks.defineReadOnlyField(_self, "BB", "rim-bb");
window.webworks.defineReadOnlyField(_self, "CELL_4G", "4g");
window.webworks.defineReadOnlyField(_self, "NONE", "none");
window.webworks.defineReadOnlyField(_self, "CELL_2G", "2g");
window.webworks.defineReadOnlyField(_self, "CELL_3G", "3g");

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;
