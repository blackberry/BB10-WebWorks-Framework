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

function handleNetworkResourceRequestedResponse(args) {
    qnx.callExtensionMethod("webview.notifyOpen", args.id, args.sid, args.response.code, "OK");
    qnx.callExtensionMethod("webview.notifyHeaderReceived", args.id, args.sid, "Access-Control-Allow-Origin", "*");
    qnx.callExtensionMethod("webview.notifyDataReceived", args.id, args.sid, args.response.responseText, args.response.responseText.length);
    qnx.callExtensionMethod("webview.notifyDone", args.id, args.sid);
}

evt.on("NetworkResourceRequestedResponse", handleNetworkResourceRequestedResponse);

_self = {
    init: function (args) {
        var takeover = false,
            notifyArgs = {};
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
                        setAction: "ACCEPT"
                    }
                });
            },
            deny: function () {
                message.send("NetworkResourceRequestedResponse", {
                    id: args.id,
                    url: args.data.url,
                    response: {
                        setAction: "DENY"
                    }
                });
            },
            substitute: function () {
                takeover = true;
                message.send("NetworkResourceRequestedResponse", {
                    id: args.id,
                    url: args.data.url,
                    response: {
                        setAction: "SUBSTITUTE"
                    }
                });
            },
            respond: function (code, responseText) {
                if (takeover) {
                    // bypass event trigger which has trouble with handling sync messages
                    notifyArgs.id = args.id;
                    notifyArgs.sid = args.data.streamId;
                    notifyArgs.response = {
                        code: code,
                        responseText: responseText
                    };

                    handleNetworkResourceRequestedResponse(notifyArgs);
                } else {
                    exception.raise(exception.types.InvalidState, "Cannot respond until after substitute has been requested");
                }
            }
        };
    }
};

module.exports = _self;
