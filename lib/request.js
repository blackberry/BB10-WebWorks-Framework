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
    URI_PREFIX = "http://localhost:8472/",
    _webview,
    utils = require('./utils');

function _formMessage(url, origin, sid, body) {
    var tokens = url.split(URI_PREFIX)[1].split("/"),
        //Handle the case where the method is multi-level
        finalToken = (tokens[3] && tokens.length > 4) ? tokens.slice(3).join('/') : tokens[3];

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[0] : finalToken,
                args : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[1] : null
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
        body = obj.body,
        whitelist = new Whitelist(),
        server,
        message,
        sid = obj.streamId,
        origin = _webview.originalLocation;

    //If the URL starts with the prefix then its a request from an API
    //In this case we will hijack and give our own response
    //Otherwise follow whitelisting rules
    if (url.match("^" + URI_PREFIX)) {
        server = require("./server");
        message = _formMessage(url, origin, sid, body);
        response = SUBSTITUTE_RESPONSE;
        server.handle(message.request, message.response);
    } else {
        if (whitelist.isAccessAllowed(url)) {
            response = ACCEPT_RESPONSE;
        } else {
            response = DENY_RESPONSE;
            url = utils.parseUri(url);
            _webview.executeJavaScript("alert('Access to \"" + url.source + "\" not allowed')");
        }
    }
    return JSON.stringify(response);
}

function unknownProtocolHandler(value) {
    var obj = JSON.parse(value),
        returnValue = { setPreventDefault : true },
        request = {
            action: 'bb.action.OPEN',
            uri: obj.url
        };
    window.qnx.webplatform.getApplication().invocation.invoke(request, function (error) {
        if (error) {
            console.log("error:" + error);
        } else {
            console.log("Success");
        }
    });
    return JSON.stringify(returnValue);
}

module.exports = {
    //Uses the webplatform webview object for several functions
    init: function (webview) {
        _webview = webview;
        return {
            networkResourceRequestedHandler: networkResourceRequestedHandler,
            unknownProtocolHandler: unknownProtocolHandler
        };
    }
};
