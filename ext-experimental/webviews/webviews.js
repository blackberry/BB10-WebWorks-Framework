/**
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
 *
 * @author dkerr, jheifetz
 * $Id: webviews.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var networkResourceRequested = require('../../lib/webkitHandlers/networkResourceRequested'),
    webkitOriginAccess = require("../../lib/policy/webkitOriginAccess"),
    _readyTrigger,
    _destroyedTrigger,
    _webviews = {};

function screenWindowHandle(id) {
    return qnx.callExtensionMethod("webview.jsScreenWindowHandle", id);
}

module.exports = {

    /*
     * Creates the webview through the webplatform.js module provided in the webworks framework
     * @param args {Object} Webview parameters
     * Ex: {
     *      url: [optional],
     *      x: <left>,
     *      y: <top>,
     *      w: <width>,
     *      h: <height>,
     *      z: <zOrder>
     *  }
     * @returns id {Number} The webviews ID
     */
    create: function (args) {
        var webviewObj = window.qnx.webplatform.createWebView(function () {
            var requestObj =  networkResourceRequested.createHandler(webviewObj);

            webviewObj.visible = true;
            webviewObj.active = true;
            webviewObj.zOrder = args.z;
            webviewObj.setGeometry(args.x, args.y, args.w, args.h);
            webviewObj.webviewHandle = screenWindowHandle(webviewObj.id);
            webviewObj.autoDeferNetworkingAndJavaScript = false;
            webviewObj.executeJavaScript("1 + 1");

            webviewObj.addEventListener("Destroyed", function () {
                webviewObj.delete(function () {
                    if (_destroyedTrigger && typeof _destroyedTrigger === 'function') {
                        _destroyedTrigger({id: webviewObj.id});
                    }
                    delete _webviews[webviewObj.id];
                });
            });

            webviewObj.onNetworkResourceRequested = requestObj.networkResourceRequestedHandler;
            webkitOriginAccess.addWebView(webviewObj);

            if (args.url) {
                webviewObj.url = args.url;
            }

            // dispatch the webviewready event
            if (_readyTrigger && typeof _readyTrigger === 'function') {
                _readyTrigger({id: webviewObj.id, webviewHandle: webviewObj.webviewHandle});
            }
        });

        webviewObj.params = args;
        _webviews[webviewObj.id] = webviewObj;

        return webviewObj.id;
    },

    /**
     * Destroys the webview
     * @param id {Number} The webview ID
     */
    destroy: function (id) {
        _webviews[id].destroy();
        return true;
    },

    /**
     * Sets the trigger function to call when a volume event is fired
     * @param trigger {Function} The trigger function to call when the event is fired
     */
    setReadyTrigger: function (trigger) {
        _readyTrigger = trigger;
    },

    /**
     * Sets the trigger function to call when a volume event is fired
     * @param trigger {Function} The trigger function to call when the event is fired
     */
    setDestroyedTrigger: function (trigger) {
        _destroyedTrigger = trigger;
    },

    /**
     * Gets the webview object
     * @param id {Number} The webview ID
     * @returns webview {Object} The webview object
     */
    getWebview: function (id) {
        return _webviews[id];
    }

};
