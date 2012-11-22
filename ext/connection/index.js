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

var _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    connectionChangeOldType,
    _actionMap;

function mapConnectionType(type, technology) {
    switch (type) {
    case 'wired':
        return 'ethernet';
    case 'wifi':
        return 'wifi';
    case 'bluetooth_dun':
        return 'bluetooth_dun';
    case 'usb':
        return 'usb';
    case 'vpn':
        return 'vpn';
    case 'bb':
        return 'rim-bb';
    case 'unknown':
        return 'unknown';
    case 'none':
        return 'none';
    case 'cellular':
        switch (technology) {
        case 'edge':
            return '2g';
        case 'evdo':
            return '3g';
        case 'umts':
            return '3g';
        case 'lte':
            return '4g';
        }
    }
    return '';
}

function currentConnectionType() {
    var connInfo = qnx.webplatform.device.activeConnection;
    if (connInfo === null) {
        connInfo = {
            type: 'none'
        };
    }
    return mapConnectionType(connInfo.type, connInfo.technology);
}

_actionMap = {
    connectionchange: {
        context: require("../../lib/events/deviceEvents"),
        event: "connectionChange",
        trigger: function (args) {
            var currentType = currentConnectionType();
            if (currentType ===  connectionChangeOldType) {
                return;
            }
            args.oldType = connectionChangeOldType;
            args.newType = connectionChangeOldType = currentType;
            _event.trigger("connectionchange", args);
        }
    }
};

module.exports = {
    registerEvents: function (success, fail, args, env) {
        connectionChangeOldType = currentConnectionType();
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    type: function (success, fail, args) {
        try {
            success(currentConnectionType());
        } catch (e) {
            fail(-1, e);
        }
    }
};
