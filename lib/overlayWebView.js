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
    clientWebView,
    _clientWebViewObj;

clientWebView =
    {

    create: function (ready, configSettings) {

        _clientWebViewObj = window.qnx.webplatform.createUIWebView(function () {

            _clientWebViewObj.visible = true;
            _clientWebViewObj.active = true;
            _clientWebViewObj.zOrder = 1;
            _clientWebViewObj.enableCrossSiteXHR = true;
            _clientWebViewObj.setGeometry(0, 0, screen.width, screen.height);
            _clientWebViewObj.addEventListener("DocumentLoadFinished", function () {
                _clientWebViewObj.default.setDefaultFont();
                _clientWebViewObj.visible = true;
            });

            _clientWebViewObj.allowRpc = true;
            _clientWebViewObj.backgroundColor = 0x00FFFFFF;
            _clientWebViewObj.sensitivity = "SensitivityTest";
            _clientWebViewObj.devicePixelRatio = 1;
            _clientWebViewObj.allowQnxObject = true;

            if (ready && typeof ready === 'function') {
                ready();
            }
        });
    },

    destroy: function () {
        _clientWebViewObj.destroy();
    },

    setURL: function (url) {
        _clientWebViewObj.url = url;
    },

    setGeometry: function (x, y, width, height) {
        _clientWebViewObj.setGeometry(x, y, width, height);
    },

    setSensitivity : function (sensitivity) {
        _clientWebViewObj.sensitivity = sensitivity;
    },

    setApplicationOrientation: function (angle) {
        _clientWebViewObj.setApplicationOrientation(angle);
    },

    notifyApplicationOrientationDone: function () {
        _clientWebViewObj.notifyApplicationOrientationDone();
    },

    executeJavascript: function (js) {
        _clientWebViewObj.executeJavaScript(js);
    },

    windowGroup: function () {
        return _clientWebViewObj.windowGroup;
    },

    notifyContextMenuCancelled: function () {
        _clientWebViewObj.notifyContextMenuCancelled();
    },

    renderContextMenuFor: function (targetWebView) {
        return _clientWebViewObj.contextMenu.subscribeTo(targetWebView);
    },

    handleDialogFor: function (targetWebView) {
        return _clientWebViewObj.dialog.subscribeTo(targetWebView);
    },

    showDialog: function (description, callback) {
        return _clientWebViewObj.dialog.show(description, callback);
    }
};

clientWebView.__defineGetter__('id', function () {
    if (_clientWebViewObj) {
        return _clientWebViewObj.id;
    }
});

clientWebView.__defineGetter__('contextMenu', function () {
    if (_clientWebViewObj) {
        return _clientWebViewObj.contextMenu;
    }
});

module.exports = clientWebView;
