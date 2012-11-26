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
    config = require("./config");

function showWebInspectorInfo() {
    var port = window.qnx.webplatform.getApplication().webInspectorPort,
        messageObj = {};

    qnx.webplatform.device.getNetworkInterfaces(function (networkInfo) {
        var connectedInterface;

        utils.forEach(networkInfo, function (info) {
            if (info && !connectedInterface) {
                connectedInterface = info;
            }
        }, this);

        messageObj.title = "Web Inspector Enabled";
        if (connectedInterface) {
            messageObj.htmlmessage =  "\n ip4:    " + connectedInterface.ipv4Address + ":" + port + "<br/> ip6:    " + connectedInterface.ipv6Address + ":" + port;
        } else {
            messageObj.message = "";
        }
        messageObj.dialogType = 'JavaScriptAlert';
        overlayWebView.showDialog(messageObj);
    });
}

var _self = {
    start: function (url) {
        var callback,
            showUrlCallback;

        // Set up the controller WebView
        controllerWebView.init(config);

        webview.create(function () {
            if (config.enableFlash) {
                //Set webview plugin directory [required for flash]
                webview.setExtraPluginDirectory('/usr/lib/browser/plugins');

                //Enable plugins for the webview [required for flash]
                webview.setEnablePlugins(true);
            }

            // Workaround for executeJavascript doing nothing for the first time
            webview.executeJavascript("1 + 1");

            url = url || config.content;

            showUrlCallback = function () {
                overlayWebView.removeEventListener("DocumentLoadFinished", showUrlCallback);
                showUrlCallback = null;

                // Start page
                if (url) {
                    webview.setURL(url);
                }
            };

            overlayWebView.create(function () {
                overlayWebView.addEventListener("DocumentLoadFinished", showUrlCallback);

                overlayWebView.setURL("local:///chrome/ui.html");
                overlayWebView.renderContextMenuFor(webview);
                overlayWebView.handleDialogFor(webview);
                controllerWebView.dispatchEvent('ui.init', null);
                webview.setUIWebViewObj(overlayWebView.getWebViewObj());
                if (config.enableChildWebView) {
                    overlayWebView.bindAppWebViewToChildWebViewControls(webview);
                }
                else {
                    webview.onChildWindowOpen = function (data) {
                        var parsedData = JSON.parse(data),
                            request = {
                                uri: parsedData.url,
                                target: "sys.browser"
                            };
                        window.qnx.webplatform.getApplication().invocation.invoke(request);
                    };
                }
                if (config.enableFormControl) {
                    overlayWebView.getWebViewObj().formcontrol.subscribeTo(webview);
                }
            });
        },
        {
            debugEnabled : config.debugEnabled
        });

        //if debugging is enabled, show the IP and port for webinspector
        if (config.debugEnabled) {
            callback = function () {
                showWebInspectorInfo();

                //Remove listener. Alert should only be shown once.
                webview.removeEventListener("DocumentLoadFinished", callback);
            };

            webview.addEventListener("DocumentLoadFinished", callback);
        }
    },
    stop: function () {
        webview.destroy();
    }
};

module.exports = _self;
