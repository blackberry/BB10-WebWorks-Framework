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

    create: function (ready, configSettings) {

        _webviewObj = window.qnx.webplatform.createWebView(function () {

            _webviewObj.visible = true;
            _webviewObj.active = true;
            _webviewObj.zOrder = 1;
            _webviewObj.enableCrossSiteXHR = true;
            _webviewObj.setGeometry(0, 0, screen.width, screen.height);
            window.qnx.webplatform.getApplication().windowVisible = true;
            var currentContext;

            _webviewObj.onContextMenuRequestEvent = function (value) {
                var menu = JSON.parse(value),
                    args = JSON.stringify({'menuItems': menu.menuItems, 'currentContext': currentContext});
                _webviewObj.executeJavaScript("window.showMenu(" + args + ")");
                return '{"setPreventDefault":true}';
            };

            _webviewObj.onPropertyCurrentContextEvent = function (value) {
                currentContext = JSON.parse(value);
            };

            _webviewObj.enableWebEventRedirect("JavaScriptCallback", 1);
            _webviewObj.backgroundColor = "0x00FFFFFF";
            _webviewObj.sensitivity = "SensitivityTest";

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

    windowGroup: function () {
        return _webviewObj.windowGroup;
    }

};

module.exports = webview;
