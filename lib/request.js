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
    message = require('./message'),
    exception = require('./exception'),
    _self;

evt.on("NetworkResourceRequestedResponse", function (args) {
    qnx.callExtensionMethod("webview.notifyOpen", args.id, args.sid, args.response.code, "OK");
    qnx.callExtensionMethod("webview.notifyHeaderReceived", args.id, args.sid, "Access-Control-Allow-Origin", "*");
    qnx.callExtensionMethod("webview.notifyDataReceived", args.id, args.sid, args.response.responseText, args.response.responseText.length);
    qnx.callExtensionMethod("webview.notifyDone", args.id, args.sid);
});

_self = {
    init: function (args) {
        var takeover = false;
        return {
            url: args.data.url,
            //TODO: this origin won't work for iframes
            origin: qnx.callExtensionMethod("webview.originalLocation", args.id),
            //TODO: body
            //body: args.body,
            allow: function () {
                message.send("NetworkResourceRequestedResponse", {
                    id: args.id,
                    url: args.data.url,
                    response: {
                        setAction: 0
                    }
                });
            },
            deny: function () {
                message.send("NetworkResourceRequestedResponse", {
                    id: args.id,
                    url: args.data.url,
                    response: {
                        setAction: 1
                    }
                });
            },
            substitute: function () {
                takeover = true;
                message.send("NetworkResourceRequestedResponse", {
                    id: args.id,
                    url: args.data.url,
                    response: {
                        setAction: 2
                    }
                });
            },
            respond: function (code, responseText) {
                if (takeover) {
                    message.send("NetworkResourceRequestedResponse", {
                        id: args.id,
                        sid: args.data.streamId,
                        url: args.data.url,
                        response: {
                            code: code,
                            responseText: responseText
                        }
                    }, true);
                }
                else {
                    exception.raise(exception.types.InvalidState, "Cannot respond until after substitute has been requested");
                }
            }
        };
    }
};

module.exports = _self;
