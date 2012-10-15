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
    utils = require('./utils'),
    config = require('./config'),
    CHROME_HEIGHT = 0,
    OUT_OF_PROCESS = 1,
    clientWebView,
    _clientWebViewObj;

function enableWhitelisting(id) {
    var accessElements = config.accessList;
    accessElements.forEach(function (element, index, array) {
        var uri = (element.uri === 'WIDGET_LOCAL' ? 'local://' : element.uri);
        qnx.callExtensionMethod('clientWebView.addOriginAccessWhitelistEntry', id, 'local://', uri, element.allowSubDomain);
        if (element.features && element.features.length) {
            qnx.callExtensionMethod('clientWebView.addOriginAccessWhitelistEntry', id, 'local://', utils.getURIPrefix(), true);
            qnx.callExtensionMethod('clientWebView.addOriginAccessWhitelistEntry', id, uri, utils.getURIPrefix(), true);
        }
    });
    //Always allow file access from local and let the OS deal with permissions
    qnx.callExtensionMethod('clientWebView.addOriginAccessWhitelistEntry', id, "local://", "file://", true);
}

clientWebView =
    {
    create: function (ready) {
        _clientWebViewObj = window.qnx.webplatform.createWebView({processType: OUT_OF_PROCESS, defaultHandlers: ['onChooseFile']}, function () {
            var requestObj = request.init(_clientWebViewObj);

            _clientWebViewObj.visible = true;
            _clientWebViewObj.active = true;
            _clientWebViewObj.zOrder = 0;
            enableWhitelisting(_clientWebViewObj.id);
            _clientWebViewObj.setGeometry(0, CHROME_HEIGHT, screen.width, screen.height - CHROME_HEIGHT);

            if (config.backgroundColor) {
                _clientWebViewObj.backgroundColor = config.backgroundColor;
            }
            _clientWebViewObj.autoDeferNetworkingAndJavaScript = config.autoDeferNetworkingAndJavaScript;

            /* Catch and trigger our custom HTML dialog */
            _clientWebViewObj.enableDialogRequestedEvents = true;

            _clientWebViewObj.addEventListener("DocumentLoadFinished", function () {
                window.qnx.webplatform.getApplication().windowVisible = true;
            });

            _clientWebViewObj.onNetworkResourceRequested = requestObj.networkResourceRequestedHandler;
            _clientWebViewObj.onUnknownProtocol = requestObj.unknownProtocolHandler;

            if (ready && typeof ready === 'function') {
                ready();
            }

            // After 12 second, hide the splash screen and show application window even "DocumentLoadFinished" event is not fired
            setTimeout(function () {
                window.qnx.webplatform.getApplication().windowVisible = true;
            }, 12000);
        });
    },

    destroy: function () {
        _clientWebViewObj.destroy();
    },

    setURL: function (url) {
        _clientWebViewObj.url = url;
    },

    executeJavascript: function (js) {
        _clientWebViewObj.executeJavaScript(js);
    },

    addEventListener: function (eventName, callback) {
        _clientWebViewObj.addEventListener(eventName, callback);
    },

    removeEventListener: function (eventName, callback) {
        _clientWebViewObj.removeEventListener(eventName, callback);
    },

    windowGroup: function () {
        return _clientWebViewObj.windowGroup;
    },

    setGeometry: function (x, y, width, height) {
        _clientWebViewObj.setGeometry(x, y, width, height);
    },

    setApplicationOrientation: function (angle) {
        _clientWebViewObj.setApplicationOrientation(angle);
    },

    setExtraPluginDirectory: function (directory) {
        _clientWebViewObj.setExtraPluginDirectory(directory);
    },

    setEnablePlugins: function (enablePlugins) {
        _clientWebViewObj.pluginsEnabled = enablePlugins;
    },

    getEnablePlugins: function () {
        return _clientWebViewObj.pluginsEnabled;
    },

    notifyApplicationOrientationDone: function () {
        _clientWebViewObj.notifyApplicationOrientationDone();
    },

    setSandbox: function (sandbox) {
        _clientWebViewObj.setFileSystemSandbox = sandbox;
    },

    getSandbox: function () {
        return _clientWebViewObj.setFileSystemSandbox;
    },

    downloadURL: function (url) {
        _clientWebViewObj.downloadURL(url);
    },

    handleContextMenuResponse: function (action) {
        _clientWebViewObj.handleContextMenuResponse(action);
    },

    allowGeolocation : function (url) {
        _clientWebViewObj.allowGeolocation(url);
    },

    disallowGeolocation : function (url) {
        _clientWebViewObj.disallowGeolocation(url);

    },

    addKnownSSLCertificate: function (url, certificateInfo) {
        _clientWebViewObj.addKnownSSLCertificate(url, certificateInfo);
    },

    continueSSLHandshaking: function (streamId, SSLAction) {
        _clientWebViewObj.continueSSLHandshaking(streamId, SSLAction);
    }

};

clientWebView.__defineGetter__('id', function () {
    if (_clientWebViewObj) {
        return _clientWebViewObj.id;
    }
});

clientWebView.__defineSetter__('onDialogRequested', function (input) {
    _clientWebViewObj.onDialogRequested = input;
});

clientWebView.__defineSetter__('onSSLHandshakingFailed', function (input) {
    _clientWebViewObj.onSSLHandshakingFailed = input;
});

clientWebView.__defineSetter__('onPropertyCurrentContextEvent', function (input) {
    _clientWebViewObj.onPropertyCurrentContextEvent = input;
});

clientWebView.__defineSetter__('onContextMenuRequestEvent', function (input) {
    _clientWebViewObj.onContextMenuRequestEvent = input;
});

module.exports = clientWebView;
