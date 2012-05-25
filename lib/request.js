/*
 *  Copyright 2012 Research In Motion Limited.
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
var Whitelist = require('./policy/whitelist').Whitelist,
    ACCEPT_RESPONSE = {setAction: "ACCEPT"},
    DENY_RESPONSE = {setAction: "DENY"},
    SUBSTITUTE_RESPONSE = {setAction: "SUBSTITUTE"},
    _webview;

function _formMessage(url, origin, sid, body) {
    var tokens = url.split("blackberry/")[1].split("/");

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : tokens[3] && tokens[3].indexOf("?") >= 0 ? tokens[3].split("?")[0] : tokens[3],
                args : tokens[3] && tokens[3].indexOf("?") >= 0 ? tokens[3].split("?")[1] : null
            },
            body : body,
            origin : origin
        },
        response : {
            send : function (code, data) {
                var responseText;
                if (typeof(data) === 'string') {
                    responseText = data;
                } else {
                    responseText =  JSON.stringify(data);
                }

                _webview.notifyOpen(sid, code, "OK");
                _webview.notifyHeaderReceived(sid, "Access-Control-Allow-Origin", "*");
                _webview.notifyDataReceived(sid, responseText, responseText.length);
                _webview.notifyDone(sid);
            }
        }
    };
}

function networkResourceRequestedHandler(value) {
    var obj = JSON.parse(value),
        response,
        url = obj.url,
        whitelist = new Whitelist(),
        server,
        message,
        sid = obj.streamId,
        origin = _webview.originalLocation;

    //If the URL starts with localhost:8472/blackberry/ then its a request from an API
    //In this case we will hijack and give our own response
    //Otherwise follow whitelisting rules
    if (url.match("^http://localhost:8472/blackberry/")) {
        server = require("./server");
        message = _formMessage(url, origin, sid);
        response = SUBSTITUTE_RESPONSE;
        server.handle(message.request, message.response);
    } else {
        if (whitelist.isAccessAllowed(url)) {
            response = ACCEPT_RESPONSE;
        } else {
            response = DENY_RESPONSE;
            _webview.executeJavaScript("alert('Access to \"" + url + "\" not allowed')");
        }
    }
    return JSON.stringify(response);
}

module.exports = {
    //Uses the webplatform webview object for several functions
    init: function (webview) {
        _webview = webview;
        return {
            networkResourceRequestedHandler: networkResourceRequestedHandler
        };
    }
};
