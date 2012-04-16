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

var evt = require('./webkitEvent'),
    message = require('./message'),
    request = require('./request'),
    onRequest,
    chromeId = 1,
    chromeHeight = 0,
    windowGroup = -1,
    id = -1,
    _self;

evt.on("NetworkResourceRequested", function (args) {
    var req = request.init(args);
    if (onRequest) {
        onRequest(req);
    } else {
        req.allow();
    }
});

/**
 * @namespace webview
 * @exports _self as webview
 */
_self = 
    {

    /**
     * @param {callback} ready A callback invoked when the webview is created
     */ 
    create: function (ready, configSettings) {
        message.init();
        qnx.callExtensionMethod("webview.setEnableWebInspector", chromeId, (configSettings ? (!!configSettings.debugEnabled) : false));
        qnx.callExtensionMethod("webview.setEnableCrossSiteXHR", chromeId, "true");
        qnx.callExtensionMethod("webview.setVisible", chromeId, "true");
        qnx.callExtensionMethod("webview.setActive", chromeId, "false");
        qnx.callExtensionMethod("webview.setGeometry", chromeId, 0, 0, screen.width, chromeHeight);

        windowGroup = qnx.callExtensionMethod("webview.applicationWindowGroup", chromeId);

        id = parseInt(qnx.callExtensionMethod("webview.create", windowGroup, "InProcess"), 10);
        
        // register ready callback
        message.onReady(ready);
    },

    destroy: function () {
        qnx.callExtensionMethod("webview.destroy", id);
    },

    /**
     * @param {String} url The fully qualified url to be loaded into the webview
     */ 
    setURL: function (url) {
        qnx.callExtensionMethod("webview.loadURL", id, url);
    },

    /**
     * @event
     * @param {callback} callback The method to be invoked when a resource is requested
     */ 
    onRequest: function (callback) {
        if (typeof callback === "function" || callback === null) {
            onRequest = callback;
        }
    },

    /**
     * @param {String} js The javascript expression to be executed
     */ 
    executeJavascript: function (js) {
        qnx.callExtensionMethod("webview.executeJavaScript", id, js, false);
    }
};

module.exports = _self;
