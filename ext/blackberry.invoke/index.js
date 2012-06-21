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
var _event = require("../../lib/event"),
    _expectedParams = [
        "target",
        "action",
        "uri",
        "type",
        "data"
    ],
    _event = require("./../../lib/event"),
    _eventExt = require("./../blackberry.event/index"),
    _actionMap = {
        invoked: {
            context: require("./invocationEvents"),
            event: "invoked",
            trigger: function () {
                var onInvokedInfo = JSON.parse(window.qnx.webplatform.getApplication().invocation.getRequest());
                _event.trigger("invoked", onInvokedInfo);
            }
        }
    };

module.exports = {
    invoke: function (success, fail, args) {
        // if request contains invalid args, the invocation framework will provide error in callback
        // no validation done here
        var argReq = JSON.parse(decodeURIComponent(args["request"])),
            request = {},
            callback;

        callback = function (error) {
            _event.trigger("blackberry.invoke.invokeEventId", error);
        };

        _expectedParams.forEach(function (key) {
            var val = argReq[key];

            if (val) {
                request[key] = val;
            }
        });

        window.qnx.webplatform.getApplication().invocation.invoke(request, callback);
        success();
    },

    registerEvents: function (success, fail, args, env) {
        try {
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

};
