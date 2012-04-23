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

var utils = require('./utils'),
    webview = utils.requireWebview(),
    config = require("./config"),
    Whitelist = require('./policy/whitelist').Whitelist,
    onPause = null,
    onResume = null;

function _make(request) {
    var tokens = request.url.split("blackberry/")[1].split("/");

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : tokens[3] && tokens[3].indexOf("?") >= 0 ? tokens[3].split("?")[0] : tokens[3],
                args : tokens[3] && tokens[3].indexOf("?") >= 0 ? tokens[3].split("?")[1] : null
            },
            body : request.body,
            origin : request.origin
        },
        response : {
            send : function (code, data) {
                if (typeof(data) === 'string') {
                    request.respond(code, data);
                } else {
                    request.respond(code, JSON.stringify(data));
                }
            }
        }
    };
}

function _onRequest(request) {
    var url = request.url,
        whitelist = new Whitelist(),
        server,
        m;

    if (url.match("^http://localhost:8472/blackberry/")) {
        server = require("./server");
        m = _make(request);

        request.substitute();
        server.handle(m.request, m.response);
    } else {
        if (whitelist.isAccessAllowed(url)) {
            request.allow();
        } else {
            request.deny();
        }
    }
}

function registerNavigatorEvents() {
    if (window.chrome && window.chrome.internal) {
        chrome.internal.navigator = {};
        chrome.internal.navigator.onWindowState = function (state) {};
        chrome.internal.navigator.onWindowActive = function () {
            if (onResume) {
                onResume();
            }            
        };
        chrome.internal.navigator.onWindowInactive = function () {
            if (onPause) {
                onPause();
            }            
        };
    }
}

var _self = {
    start: function (url) {
        webview.create(function () {
            webview.onRequest(function (request) {
                _onRequest(request);
            });

            url = url || config.content;
            // Start page
            if (url) {
                webview.setURL(url);
            }

            // Define navigator events callbacks which get invoked by native code
            registerNavigatorEvents();

            // Workaround for executeJavascript doing nothing for the first time
            webview.executeJavascript("1 + 1");            
        },
        {
            debugEnabled : config.debugEnabled
        }
        );
    },
    stop: function () {
        webview.destroy();
    },
    setOnPause: function (handler) {
        onPause = handler;
    },
    setOnResume: function (handler) {
        onResume = handler;
    }
};

module.exports = _self;
