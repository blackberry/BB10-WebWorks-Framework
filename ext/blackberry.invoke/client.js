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
    _ID = "blackberry.invoke",
    _eventId = "blackberry.invoke.invokeEventId";

_self.invoke = function (request, onSuccess, onError) {
    var data,
        callback;

    if (!request) {
        if (onError && typeof onError === "function") {
            onError("invalid invocation request");
            return;
        }
    } else {
        if (request["data"]) {
            data = request["data"];

            try {
                // calling window.btoa on a string that contains unicode character will cause error
                // it is the caller's responsibility to convert the string prior to calling invoke
                request["data"] = window.btoa(data);
            } catch (e) {
                if (onError && typeof onError === "function") {
                    onError(e);
                    return;
                }
            }
        }
    }

    callback = function (error) {
        if (error) {
            if (onError && typeof onError === "function") {
                onError(error);
            }
        } else {
            if (onSuccess && typeof onSuccess === "function") {
                onSuccess();
            }
        }
    };

    if (!window.webworks.event.isOn(_eventId)) {
        window.webworks.event.once(_ID, _eventId, callback);
    }

    return window.webworks.execAsync(_ID, "invoke", {request: request});
};

window.webworks.defineReadOnlyField(_self, "ACTION_OPEN", "bb.action.OPEN");
window.webworks.defineReadOnlyField(_self, "ACTION_VIEW", "bb.action.VIEW");
window.webworks.defineReadOnlyField(_self, "ACTION_SHARE", "bb.aciton.SHARE");

module.exports = _self;

