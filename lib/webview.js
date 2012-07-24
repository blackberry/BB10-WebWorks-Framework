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

var request = require('./request'),
    CHROME_HEIGHT = 0,
    webview,
    _webviewObj;

webview =
    {


    create: function (ready) {
        _webviewObj = window.qnx.webplatform.createWebView(function () {
            var requestObj = request.init(_webviewObj);

            _webviewObj.visible = true;
            _webviewObj.active = true;
            _webviewObj.zOrder = 0;
            _webviewObj.enableCrossSiteXHR = true;
            _webviewObj.setGeometry(0, CHROME_HEIGHT, screen.width, screen.height - CHROME_HEIGHT);

            window.qnx.webplatform.getApplication().windowVisible = true;

            _webviewObj.enableWebEventRedirect("ContextMenuRequestEvent", 3);
            _webviewObj.enableWebEventRedirect("ContextMenuCancelEvent", 3);
            _webviewObj.enableWebEventRedirect("PropertyCurrentContextEvent", 3);

            _webviewObj.onNetworkResourceRequested = requestObj.networkResourceRequestedHandler;
            _webviewObj.onUnknownProtocol = requestObj.unknownProtocolHandler;

            if (ready && typeof ready === 'function') {
                ready();
            }
        });
    },

    destroy: function () {
        _webviewObj.destroy();
    },

    setURL: function (url) {
        _webviewObj.url = url;
    },

    executeJavascript: function (js) {
        _webviewObj.executeJavaScript(js);
    },

    addEventListener: function (eventName, callback) {
        _webviewObj.addEventListener(eventName, callback);
    },

    removeEventListener: function (eventName, callback) {
        _webviewObj.removeEventListener(eventName, callback);
    },

    windowGroup: function () {
        return _webviewObj.windowGroup;
    },

    setSandbox: function (sandbox) {
        _webviewObj.setFileSystemSandbox = sandbox;
    },

    getSandbox: function () {
        return _webviewObj.setFileSystemSandbox;
    }
};

module.exports = webview;
