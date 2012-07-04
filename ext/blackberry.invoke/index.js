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
var _expectedParams = [
        "target",
        "action",
        "uri",
        "type",
        "data"
    ],
    _event = require("./../../lib/event");

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

};

