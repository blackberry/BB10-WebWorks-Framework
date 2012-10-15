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
    clientWebView = require('./clientWebView'),
    overlayWebView = require('./overlayWebView'),
    network = require("../lib/pps/ppsNetwork"),
    config = require("./config");

function showWebInspectorInfo() {
    var port = window.qnx.webplatform.getApplication().webInspectorPort,
        messageObj = {};

    network.getNetworkInfo(function (ipAddresses) {
        messageObj.title = "Web Inspector Enabled";
        if (ipAddresses) {
            messageObj.htmlmessage =  "\n ip4:    " + ipAddresses.ipv4Address + ":" + port + "<br/> ip6:    " + ipAddresses.ipv6Address + ":" + port;
        } else {
            messageObj.message = "";
        }
        messageObj.dialogType = 'JavaScriptAlert';
        overlayWebView.showDialog(messageObj);
    });
}

var _self = {
    start: function (url) {
        var rotationHelper = require('./rotationHelper'),
            callback;

        // Set up the controller WebView
        controllerWebView.init(config);

        rotationHelper.addWebview(controllerWebView);

        clientWebView.create(function () {
            if (config.enableFlash) {
                //Set clientWebView plugin directory [required for flash]
                clientWebView.setExtraPluginDirectory('/usr/lib/browser/plugins');

                //Enable plugins for the clientWebView [required for flash]
                clientWebView.setEnablePlugins(true);
            }

            rotationHelper.addWebview(clientWebView);

            // Workaround for executeJavascript doing nothing for the first time
            clientWebView.executeJavascript("1 + 1");

            url = url || config.content;
            // Start page
            if (url) {
                clientWebView.setURL(url);
            }
        },
        {
            debugEnabled : config.debugEnabled
        });

        //if debugging is enabled, show the IP and port for webinspector
        if (config.debugEnabled) {
            callback = function () {
                showWebInspectorInfo();

                //Remove listener. Alert should only be shown once.
                clientWebView.removeEventListener("DocumentLoadFinished", callback);
            };

            clientWebView.addEventListener("DocumentLoadFinished", callback);
        }

        overlayWebView.create(function () {
            rotationHelper.addWebview(overlayWebView);
            overlayWebView.setURL("local:///ui-resources/ui.html");
            overlayWebView.renderContextMenuFor(clientWebView);
            overlayWebView.handleDialogFor(clientWebView);
            controllerWebView.dispatchEvent('ui.init', null);
        });
    },
    stop: function () {
        clientWebView.destroy();
    }
};

module.exports = _self;
