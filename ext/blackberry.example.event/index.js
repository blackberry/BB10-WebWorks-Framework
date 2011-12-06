/*
 * Copyright 2010-2011 Research In Motion Limited.
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
var _callbackIds = [],
    _listening = false,
    _webview = require("../../dependencies/BBX-Emulator/lib/webview");

function _somethingHappened() {
    if (_listening) {
        var eventData = {
            firedAt: new Date().toString(),
            magicNum: Math.floor(Math.random() * 11)
        };

        _callbackIds.forEach(function (cbId) {
            if (cbId >= 0) {
                console.log("Calling callback with id:" + cbId);
                _webview.executeJavascript("webworks.event.trigger(" + cbId + ", '" + JSON.stringify(eventData) + "')");
            }
        });
    }
}

module.exports = {
    startListen: function (success, fail, args) {
        if (args && args.callbackId >= 0) {
            _callbackIds.push(args.callbackId);

            if (!_listening) {
                _listening = true;
                // start listen to event
            }

            success(args.callbackId);
        } else {
            fail("No callback id found in request");
        }
    },

    stopListen: function (success, fail, args) {
        if (args && args.callbackId >= 0) {
            _callbackIds.forEach(function (cbId, index, allIds) {
                if (cbId === args.callbackId) {
                    allIds.splice(index, 1);
                }
            });

            if (_callbackIds.length === 0) {
                _listening = false;
                // stop listen to event
            }

            success(args.callbackId);
        } else {
            fail("No callback id found in request");
        }
    },

    // HACK to test event
    startEvent: function (success, fail, args) {
        var interval = args && args.interval ? args.interval : 10000;
        success(setInterval(_somethingHappened, interval));
    },

    // HACK to test event
    stopEvent: function (success, fail, args) {
        if (args && args.intervalId !== undefined) {
            clearInterval(args.intervalId);
            success(args.intervalId);
        } else {
            fail("No intervalId specified");
        }
    }
};