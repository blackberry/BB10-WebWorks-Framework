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
var _event = require("./../../lib/event"),
    _actionMap = {
        invoked: {
            context: require("./invocationEvents"),
            event: "invoked",
            trigger: function (request) {
                var onInvokedInfo = JSON.parse(request);

                // Workaround for double invoke bug
                if (onInvokedInfo.uri !== "invoke://localhost") {
                    _event.trigger("invoked", onInvokedInfo);
                }
            }
        },
        onCardResize: {
            context: require("./invocationEvents"),
            event: "onCardResize",
            trigger: function (info) {
                _event.trigger("onCardResize", info);
            }
        },
        onCardClosed: {
            context: require("./invocationEvents"),
            event: "onCardClosed",
            trigger: function (info) {
                _event.trigger("onCardClosed", info);
            }
        }
    };

module.exports = {
    cardResizeDone: function (success, fail, args) {
        try {
            window.qnx.webplatform.getApplication().invocation.cardResized();
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    cardStartPeek: function (success, fail, args) {
        var cardPeek;

        try {
            cardPeek = decodeURIComponent(args["peekType"]);
            window.qnx.webplatform.getApplication().invocation.cardPeek(cardPeek);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    cardRequestClosure: function (success, fail, args) {
        var request;

        try {
            request = JSON.parse(decodeURIComponent(args["request"]));
            window.qnx.webplatform.getApplication().invocation.sendCardDone(request);
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

