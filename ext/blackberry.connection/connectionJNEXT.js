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

var connection,
    triggerCallback = null;

function getConnectionTypeString(type) {
    switch (type) {
    case 0:
        return "unknown";
    case 1:
        return "ethernet";
    case 2:
        return "wifi";
    case 3:
        return "bluetooth_dun";
    case 4:
        return "usb";
    case 5:
        return "vpn";
    case 6:
        return "rim-bb";
    case 7:
        return "4g"; // always return 4g for cellular
    case 8:
        return "none";
    }

    return type;
}

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin for blackberry.connection
///////////////////////////////////////////////////////////////////

JNEXT.Connection = function () {
    var self = this;

    self.getType = function () {
        var val = JNEXT.invoke(self.m_id, "getType");
        return getConnectionTypeString(JSON.parse(val));
    };

    self.startEvents = function (trigger) {
        triggerCallback = trigger;
        JNEXT.invoke(self.m_id, "startEvents");
    };

    self.stopEvents = function () {
        JNEXT.invoke(self.m_id, "stopEvents");
        triggerCallback = null;
    };

    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            info = {};
        
        if (strEventDesc === "connectionchange") {
            info.oldType = getConnectionTypeString(JSON.parse(arData[1]));
            info.newType = getConnectionTypeString(JSON.parse(arData[2]));

            if (triggerCallback) {
                triggerCallback(info);
            }
        }
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("netstatus")) {
            return false;
        }

        self.m_id = JNEXT.createObject("netstatus.Connection");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.m_id = "";

    self.init();
};

connection = new JNEXT.Connection();

module.exports = {
    connection: connection
};
