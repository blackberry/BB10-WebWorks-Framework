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

var utils = require('./utils'),
    controllerWebView = require('./controllerWebView'),
    webview = require('./webview'),
    overlayWebView = require('./overlayWebView'),
    network = require("../lib/pps/ppsNetwork"),
    config = require("./config"),
    onSwipeDown = null,
    onPause = null,
    onResume = null;

function registerApplicationEvents() {
    if (window.chrome && window.chrome.internal) {
        chrome.internal.application = {};
        chrome.internal.application.onWindowState = function (state) {};
        chrome.internal.application.onSwipeDown = function () {
            if (onSwipeDown) {
                onSwipeDown();
            }            
        };
        chrome.internal.application.onWindowActive = function () {
            if (onResume) {
                onResume();
            }            
        };
        chrome.internal.application.onWindowInactive = function () {
            if (onPause) {
                onPause();
            }            
        };
    }
}

function showWebInspectorInfo() {
    var port = window.qnx.webplatform.getApplication().webInspectorPort,
        msg = "Web inspector enabled";

    network.getNetworkInfo(function (ipAddresses) {
        if (ipAddresses) {
            msg += "\nip4:    " + ipAddresses.ipv4Address + ":" + port;
            msg += "\nip6:    " + ipAddresses.ipv6Address + ":" + port;
        }

        //Show webinspector information to user
        //NOTE: webview.executeJavascript() wasn't displaying the alert
        //so i am doing a straight alert(msg)
        alert(msg);
    });
}

var _self = {
    start: function (url) {
        // Set up the controller WebView
        controllerWebView.init(config);
        
        webview.create(function () {
            // Workaround for executeJavascript doing nothing for the first time
            webview.executeJavascript("1 + 1");

            url = url || config.content;
            // Start page
            if (url) {
                webview.setURL(url);
            }

            // Define application events callbacks which get invoked by native code
            registerApplicationEvents();
        },
        {
            debugEnabled : config.debugEnabled
        });

        //if debugging is enabled, show the IP and port for webinspector
        if (config.debugEnabled) {
            webview.addEventListener("DocumentLoadFinished", function () {
                showWebInspectorInfo();
            });
        }

        overlayWebView.create(function () {
            overlayWebView.setURL("local:///ui-resources/ui.html");
        });
    },
    stop: function () {
        webview.destroy();
    },
    setOnSwipeDown: function (handler) {
        onSwipeDown = handler;
    },
    setOnPause: function (handler) {
        onPause = handler;
    },
    setOnResume: function (handler) {
        onResume = handler;
    }
};

module.exports = _self;
