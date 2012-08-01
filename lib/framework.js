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
    config = require("./config");

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
        },
        {
            debugEnabled : config.debugEnabled
        });

        //if debugging is enabled, show the IP and port for webinspector
        if (config.debugEnabled) {
            var callback = function () {
                showWebInspectorInfo();

                //Remove listener. Alert should only be shown once.
                webview.removeEventListener("DocumentLoadFinished", callback);
            };

            webview.addEventListener("DocumentLoadFinished", callback);
        }

        overlayWebView.create(function () {
            overlayWebView.setURL("local:///ui-resources/ui.html");
            controllerWebView.dispatchEvent('ui.init', null);
        });
    },
    stop: function () {
        webview.destroy();
    }
};

module.exports = _self;
