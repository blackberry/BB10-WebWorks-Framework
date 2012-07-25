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
    _utils = require("./../../lib/utils"),
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
        }
    };

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    }
};

