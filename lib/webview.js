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
    permissions = require('./permissions'),
    CHROME_HEIGHT = 0,
    OUT_OF_PROCESS = 1,
    LOCAL_URI = "local://",
    FILE_URI = "file://",
    webview,
    _webviewObj;

function enableWhitelisting(id) {
    var accessElements = config.accessList;
    accessElements.forEach(function (element, index, array) {
        var uri = (element.uri === 'WIDGET_LOCAL' ? LOCAL_URI : element.uri),
            parsedUri = utils.parseUri(uri);

        if (utils.isFileURI(parsedUri)) {
            uri = FILE_URI;
        }

        if (element.features && element.features.length) {
            //Allow access from a whitelisted domain to local
            _webviewObj.addOriginAccessWhitelistEntry(LOCAL_URI, uri, true);
            _webviewObj.addOriginAccessWhitelistEntry(uri, LOCAL_URI,  element.allowSubDomain);
            //Allow access from a whitelisted domain to content start page
            _webviewObj.addOriginAccessWhitelistEntry(config.content, uri, true);
            _webviewObj.addOriginAccessWhitelistEntry(uri, config.content,  element.allowSubDomain);
            //Allow access from a whitelisted domain to APIs
            _webviewObj.addOriginAccessWhitelistEntry(uri, utils.getURIPrefix(), true);
        }
    });
    //Always allow file access from local and let the OS deal with permissions
    _webviewObj.addOriginAccessWhitelistEntry(LOCAL_URI, FILE_URI, true);
    _webviewObj.addOriginAccessWhitelistEntry(FILE_URI, LOCAL_URI, true);
    //Always allow the content page to access URIs
    _webviewObj.addOriginAccessWhitelistEntry(config.content, utils.getURIPrefix(), true);
}

webview =
    {
    create: function (ready) {
        //@if qnxcar
        _webviewObj = window.qnx.webplatform.createWebView({}, function () {
        //@else
        _webviewObj = window.qnx.webplatform.createWebView({processId: OUT_OF_PROCESS, defaultSendEventHandlers: ['onChooseFile', 'onOpenWindow'], defaultWebEventHandlers: ['InvokeRequestEvent']}, function () {
        //@endif
            var requestObj = request.init(_webviewObj);

            _webviewObj.visible = true;
            _webviewObj.active = true;
            _webviewObj.zOrder = 0;
            enableWhitelisting(_webviewObj.id);
            _webviewObj.setGeometry(0, CHROME_HEIGHT, screen.width, screen.height - CHROME_HEIGHT);

            if (typeof config.backgroundColor !== 'undefined') {
                _webviewObj.backgroundColor = config.backgroundColor;
            }

            if (typeof config.customHeaders !== 'undefined') {
                _webviewObj.extraHttpHeaders = config.customHeaders;
            }

            _webviewObj.autoDeferNetworkingAndJavaScript = config.autoDeferNetworkingAndJavaScript;

            /* Catch and trigger our custom HTML dialog */
            _webviewObj.allowWebEvent("DialogRequested");

            // Enable the permissions checking for this webview, traps any native permission events
            // coming from native
            permissions.init(webview);
            _webviewObj.onGeolocationPermissionRequest = permissions.onGeolocationPermissionRequest;

            _webviewObj.addEventListener("DocumentLoadFinished", function () {
                window.qnx.webplatform.getApplication().windowVisible = true;
            });

            _webviewObj.onNetworkResourceRequested = requestObj.networkResourceRequestedHandler;

            if (ready && typeof ready === 'function') {
                ready();
            }

            window.qnx.webplatform.getController().dispatchEvent("webview.initialized", [_webviewObj]);

            // If content is not loaded, too bad open the visibility up.
            setTimeout(function () {
                window.qnx.webplatform.getApplication().windowVisible = true;
            }, 2500);
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

    getGeometry: function () {
        return this.geometry;
    },

    setGeometry: function (x, y, width, height) {
        this.geometry = {x: x, y: y, w: width, h: height};
        _webviewObj.setGeometry(x, y, width, height);
    },

    setApplicationOrientation: function (angle) {
        _webviewObj.setApplicationOrientation(angle);
    },

    setExtraPluginDirectory: function (directory) {
        _webviewObj.setExtraPluginDirectory(directory);
    },

    setEnablePlugins: function (enablePlugins) {
        _webviewObj.pluginsEnabled = enablePlugins;
    },

    getEnablePlugins: function () {
        return _webviewObj.pluginsEnabled;
    },

    notifyApplicationOrientationDone: function () {
        _webviewObj.notifyApplicationOrientationDone();
    },

    setSandbox: function (sandbox) {
        _webviewObj.setFileSystemSandbox = sandbox;
    },

    getSandbox: function () {
        return _webviewObj.setFileSystemSandbox;
    },

    downloadURL: function (url) {
        _webviewObj.downloadURL(url);
    },

    handleContextMenuResponse: function (action) {
        _webviewObj.handleContextMenuResponse(action);
    },

    allowGeolocation : function (url) {
        _webviewObj.allowGeolocation(url);
    },

    disallowGeolocation : function (url) {
        _webviewObj.disallowGeolocation(url);

    },

    addKnownSSLCertificate: function (url, certificateInfo) {
        _webviewObj.addKnownSSLCertificate(url, certificateInfo);
    },

    continueSSLHandshaking: function (streamId, SSLAction) {
        _webviewObj.continueSSLHandshaking(streamId, SSLAction);
    },

    getSensitivity: function () {
        return _webviewObj.getSensitivity();
    },

    setSensitivity: function (sensitivity) {
        return _webviewObj.setSensitivity(sensitivity);
    },

    getBackgroundColor: function () {
        return _webviewObj.getBackgroundColor();
    },

    setBackgroundColor: function (backgroundColor) {
        return _webviewObj.setBackgroundColor(backgroundColor);
    },

    getWebViewObj: function (webview) {
        return _webviewObj;
    },

    setUIWebViewObj: function (webviewObj) {
        _webviewObj.uiWebView = webviewObj;
    },

    allowUserMedia: function (evtId, cameraName) {
        _webviewObj.allowUserMedia(evtId, cameraName);
    },

    disallowUserMedia: function (evtId) {
        _webviewObj.disallowUserMedia(evtId);
    }
};

webview.__defineGetter__('id', function () {
    if (_webviewObj) {
        return _webviewObj.id;
    }
});

webview.__defineGetter__('processId', function () {
    return _webviewObj.processId;
});

webview.__defineSetter__('onOpenWindow', function (input) {
    _webviewObj.onOpenWindow = input;
});

webview.__defineSetter__('onCloseWindow', function (input) {
    _webviewObj.onCloseWindow = input;
});

webview.__defineSetter__('onDestroyWindow', function (input) {
    _webviewObj.onDestroyWindow = input;
});

webview.__defineSetter__('onDialogRequested', function (input) {
    _webviewObj.onDialogRequested = input;
});

webview.__defineSetter__('onSSLHandshakingFailed', function (input) {
    _webviewObj.onSSLHandshakingFailed = input;
});

webview.__defineSetter__('onPropertyCurrentContextEvent', function (input) {
    _webviewObj.onPropertyCurrentContextEvent = input;
});

webview.__defineSetter__('onContextMenuRequestEvent', function (input) {
    _webviewObj.onContextMenuRequestEvent = input;
});

webview.__defineSetter__('onContextMenuCancelEvent', function (input) {
    _webviewObj.onContextMenuCancelEvent = input;
});

webview.__defineSetter__('onUserMediaRequest', function (input) {
    _webviewObj.onUserMediaRequest = input;
});

webview.__defineSetter__('onChildWindowOpen', function (input) {
    _webviewObj.onChildWindowOpen = input;
});

module.exports = webview;
