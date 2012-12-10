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
    _ID = require("./manifest.json").namespace,
    _invokeEventId = "invoke.invokeEventId",
    _queryEventId = "invoke.queryEventId",
    _invokeInterrupter,
    _invokeHandler;

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

    if (!window.webworks.event.isOn(_invokeEventId)) {
        window.webworks.event.once(_ID, _invokeEventId, callback);
    }

    return window.webworks.execAsync(_ID, "invoke", {request: request});
};

_self.query = function (request, onSuccess, onError) {
    var queryCallback = function (args) {
            if (onError && typeof onError === 'function' &&
                    args && args.error && typeof args.error === "string" &&
                    args.error.length !== 0) {
                onError(args.error);
            } else if (onSuccess && typeof onSuccess === "function" &&
                    args && args.response && args.response !== null) {
                onSuccess(args.response);
            }
        };

    if (!window.webworks.event.isOn(_queryEventId)) {
        window.webworks.event.once(_ID, _queryEventId, queryCallback);
    }

    window.webworks.execAsync(_ID, "query", {request: request});
};

_self.closeChildCard = function () {
    window.webworks.execSync(_ID, "closeChildCard");
};

Object.defineProperty(_self, "interrupter", {
    get : function () {
        return _invokeHandler;
    },

    set: function (handler) {
        var returnRequest;
        try {
            // Clear the current one no matter what
            if (window.webworks.event.isOn('invocation.interrupted')) {
                window.webworks.event.remove('blackberry.event', 'invocation.interrupted', _invokeInterrupter);
            }
            // Check if we are nulling, or undefining the handler, take off the interruption
            _invokeHandler = handler;

            if (!handler) {
                window.webworks.execAsync(_ID, "clearInterrupter");
            } else {
                _invokeInterrupter = function (request) {
                    returnRequest = handler(request);
                    window.webworks.execAsync(_ID, "returnInterruption", {request : returnRequest});
                };

                window.webworks.event.add('blackberry.event', 'invocation.interrupted', _invokeInterrupter);
                window.webworks.execAsync(_ID, "registerInterrupter");
            }
        } catch (error) {
            console.error(error);
        }
    }

});

window.webworks.execSync(_ID, "registerEvents", null);

window.webworks.defineReadOnlyField(_self, "FILE_TRANSFER_PRESERVE", 'PRESERVE');
window.webworks.defineReadOnlyField(_self, "FILE_TRANSFER_COPY_RO", 'COPY_RO');
window.webworks.defineReadOnlyField(_self, "FILE_TRANSFER_COPY_RW", 'COPY_RW');
window.webworks.defineReadOnlyField(_self, "FILE_TRANSFER_LINK", 'LINK');

module.exports = _self;
