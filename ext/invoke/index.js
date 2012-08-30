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
    _actionMap = {
        onChildCardStartPeek: {
            context: require("./invocationEvents"),
            event: "onChildCardStartPeek",
            trigger: function (peekType) {
                _event.trigger("onChildCardStartPeek", peekType);
            }
        },
        onChildCardEndPeek: {
            context: require("./invocationEvents"),
            event: "onChildCardEndPeek",
            trigger: function () {
                _event.trigger("onChildCardEndPeek");
            }
        },
        onChildCardClosed: {
            context: require("./invocationEvents"),
            event: "onChildCardClosed",
            trigger: function (info) {
                _event.trigger("onChildCardClosed", info);
            }
        }
    };

module.exports = {
    invoke: function (success, fail, args) {
        // if request contains invalid args, the invocation framework will provide error in callback
        // no validation done here
        var argReq = JSON.parse(decodeURIComponent(args["request"])),
            expectedParams = [
                "target",
                "action",
                "uri",
                "type",
                "data"
            ],
            request = {},
            callback;

        callback = function (error) {
            _event.trigger("invoke.invokeEventId", error);
        };

        expectedParams.forEach(function (key) {
            var val = argReq[key];

            if (val) {
                request[key] = val;
            }
        });

        window.qnx.webplatform.getApplication().invocation.invoke(request, callback);
        success();
    },

    query: function (success, fail, args) {
        var argReq = JSON.parse(decodeURIComponent(args["request"])),
            expectedParams = [
                "action",
                "uri",
                "type",
                "action_type",
                "receiver_capabilities",
                "perimeter",
                "brokering_mod"
            ],
            expectedTypes = ["APPLICATION", "VIEWER", "CARD"],
            request = {},
            callback = function (error, response) {
                _event.trigger("invoke.queryEventId", {"error": error, "response": response});
            };

        expectedParams.forEach(function (key) {
            var val = argReq[key];

            if (val) {
                request[key] = val;
            }
        });

        // Validate target_type property in request if it exists
        if (Array.isArray(argReq["target_type"])) {

            request["target_type"] = argReq["target_type"].reduce(function (prev, current) {
                var containsType = function (type) {
                        return current === type;
                    };

                if (prev !== "ALL" && typeof current === "string" &&
                        !prev.some(containsType) && expectedTypes.some(containsType)) {

                    prev.push(current);
                }

                return prev;
            }, []);

            switch (request["target_type"].length)
            {
            case expectedTypes.length:
                request["target_type"] = "ALL";
                break;
            case 1:
                request["target_type"] = request["target_type"].pop();
                break;
            case 0:
                delete request["target_type"];
            }
        }

        window.qnx.webplatform.getApplication().invocation.queryTargets(request, callback);
        success();
    },

    closeChildCard: function (success, fail) {
        try {
            window.qnx.webplatform.getApplication().invocation.closeChildCard();
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    registerEvents: function (success, fail, args, env) {
        try {
            var utils = require("./../../lib/utils"),
                eventExt = utils.loadExtensionModule("event", "index");

            eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    }

};

