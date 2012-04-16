/*
 *  Copyright 2011 Research In Motion Limited.
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
var evt = require('./webkitEvent'),
    responses,
    chromeHeight = 0,
    ready,
    _self;

chrome = {};
chrome.internal = {};
chrome.internal.webEvent = function (id, eventId, value) {
    if (eventId === "NetworkResourceRequested") {
        var obj = JSON.parse(value),
            data = {
                event: eventId,
                payload: {
                    id: id,
                    data: obj
                }
            },
            response = _self.receive(JSON.stringify(data));

        if (response.event.indexOf(eventId) === 0) {
            return JSON.stringify(response.payload.response);
        }
    } else if (eventId === "Created") {
        qnx.callExtensionMethod("webview.setVisible", id, true);
        qnx.callExtensionMethod("webview.setActive", id, true);
        qnx.callExtensionMethod("webview.setZOrder", id, 0);
        qnx.callExtensionMethod("webview.setEnableNetworkResourceRequestedEvents", id, true);
        qnx.callExtensionMethod("webview.setEnableCrossSiteXHR", id, true);
        qnx.callExtensionMethod("webview.setGeometry", id, 0, chromeHeight, screen.width, screen.height - chromeHeight);
        qnx.callExtensionMethod("applicationWindow.setVisible", "true");

        if (ready && typeof ready === 'function') {
            ready();
        }
    }
};
_self = {
    init: function (socket) {
        responses = [];
    },

    send: function (eventId, payload, now) {
        now = now || false;

        if (responses && eventId && payload) {
            if (now) {
                evt.trigger(eventId, [payload]);
            }
            else {
                var response = {
                    event: eventId,
                    payload: payload
                };
                responses.push(response);
            }
        }
    },

    receive: function (data) {
        try {
            var obj = JSON.parse(data);
            if (obj.event && obj.payload) {
                evt.trigger(obj.event, [obj.payload], true);
                if (responses.length > 0) {
                    return responses.shift();
                }
            }
            else {
                console.log("JSON incomplete");
            }
        }
        catch (e) {
            console.log("Could not parse JSON");
        }
    },
    
    onReady: function (handler) {
        ready = handler;
    }
};

module.exports = _self;
