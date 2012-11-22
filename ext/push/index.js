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
var _push,
    _methods = ["startService", "createChannel", "destroyChannel", "extractPushPayload", "launchApplicationOnPush", "acknowledge"],
    _event = require("../../lib/event"),
    _exports = {};

module.exports = {
    startService: function (success, fail, args) {
        var pushOptions = { "invokeTargetId" : JSON.parse(decodeURIComponent(args.invokeTargetId)),
                            "appId" : JSON.parse(decodeURIComponent(args.appId)),
                            "ppgUrl" : JSON.parse(decodeURIComponent(args.ppgUrl)) };

        _push.getInstance().startService(pushOptions);
        success();
    },

    createChannel: function (success, fail, args) {
        _push.getInstance().createChannel(args);
        success();
    },

    destroyChannel: function (success, fail, args) {
        _push.getInstance().destroyChannel(args);
        success();
    },

    extractPushPayload: function (success, fail, args) {
        var invokeData = { "data" : JSON.parse(decodeURIComponent(args.data)) };
        success(_push.getInstance().extractPushPayload(invokeData));
    },

    launchApplicationOnPush: function (success, fail, args) {
        _push.getInstance().launchApplicationOnPush(JSON.parse(decodeURIComponent(args.shouldLaunch)));
        success();
    },

    acknowledge: function (success, fail, args) {
        var acknowledgeData = { "id" : JSON.parse(decodeURIComponent(args.id)),
                                "shouldAcceptPush" : JSON.parse(decodeURIComponent(args.shouldAcceptPush)) };

        _push.getInstance().acknowledge(acknowledgeData);
        success();
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.Push = function () {
    var self = this,
        hasInstance = false;

    self.startService = function (args) {
        JNEXT.invoke(self.m_id, "startService " + JSON.stringify(args));
    };

    self.createChannel = function (args) {
        JNEXT.invoke(self.m_id, "createChannel");
    };

    self.destroyChannel = function (args) {
        JNEXT.invoke(self.m_id, "destroyChannel");
    };

    self.extractPushPayload = function (args) {
        var payload = JNEXT.invoke(self.m_id, "extractPushPayload " + JSON.stringify(args));
        return JSON.parse(payload.substring(payload.indexOf("{"), payload.lastIndexOf("}") + 1));
    };

    self.launchApplicationOnPush = function (args) {
        var shouldLaunch = args;

        if (shouldLaunch) {
            JNEXT.invoke(self.m_id, "registerToLaunch");
        } else {
            JNEXT.invoke(self.m_id, "unregisterFromLaunch");
        }
    };

    self.acknowledge = function (args) {
        JNEXT.invoke(self.m_id, "acknowledge " + JSON.stringify(args));
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpushjnext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpushjnext.Push");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventId = arData[0],
            args = arData[1],
            info = {};

        // Trigger the event handler of specific Push events
        if (strEventId === "push.create.callback") {
            _event.trigger("push.create.callback", JSON.parse(args));

        } else if (strEventId === "push.create.simChangeCallback") {
            _event.trigger("push.create.simChangeCallback");

        } else if (strEventId === "push.create.pushTransportReadyCallback") {
            _event.trigger("push.create.pushTransportReadyCallback", JSON.parse(args));
        
        } else if (strEventId === "push.createChannel.callback") {
            info.result = JSON.parse(arData[1]);
            info.token = arData[2];
            _event.trigger("push.createChannel.callback", info);

        } else if (strEventId === "push.destroyChannel.callback") {
            _event.trigger("push.destroyChannel.callback", JSON.parse(args));

        } else if (strEventId === "push.launchApplicationOnPush.callback") {
            _event.trigger("push.launchApplicationOnPush.callback", JSON.parse(args));

        }
    };

    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            hasInstance = true;
            self.init();
        }
        return self;
    };
};

_push = new JNEXT.Push();
