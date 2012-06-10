/*
 * Copyright 2010-2011 Research In Motion Limited.
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
                    
/**
 * @namespace webview
 * @exports _self as webview
 */
webview = 
    {

    /**
     * @param {callback} ready A callback invoked when the webview is created
     */ 
    create: function (ready, configSettings) {
        var controller = window.qnx.webplatform.getController();
        controller.enableWebInspector = configSettings ? (!!configSettings.debugEnabled) : false;
        controller.enableCrossSiteXHR = true;
        controller.visible = true;
        controller.active = false;
        controller.setGeometry(0, 0, screen.width, CHROME_HEIGHT);

        _webviewObj = window.qnx.webplatform.createWebView(function () {
            var requestObj = request.init(_webviewObj);

            _webviewObj.visible = true;
            _webviewObj.active = true;
            _webviewObj.zOrder = 0;
            _webviewObj.enableCrossSiteXHR = true;
            _webviewObj.setGeometry(0, CHROME_HEIGHT, screen.width, screen.height - CHROME_HEIGHT);
            window.qnx.webplatform.getApplication().windowVisible = true;

            _webviewObj.onNetworkResourceRequested = requestObj.networkResourceRequestedHandler;

            if (ready && typeof ready === 'function') {
                ready();
            }
        });
    },

    destroy: function () {
        _webviewObj.destroy();
    },

    /**
     * @param {String} url The fully qualified url to be loaded into the webview
    */ 
    setURL: function (url) {
        _webviewObj.url = url;
    },

    /**
     * @param {String} js The javascript expression to be executed
    */ 
    executeJavascript: function (js) {
        _webviewObj.executeJavaScript(js);
    },
    
    windowGroup: function () {
        return _webviewObj.windowGroup;
    }

};

module.exports = webview;
