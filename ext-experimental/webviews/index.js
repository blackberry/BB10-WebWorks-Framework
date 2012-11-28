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
 * $Id: index.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var _event = require("../../lib/event"),
	_utils = require("./../../lib/utils"),
    _webviews = require("./webviews"),
    _webview = require("../../lib/webview"),
    _actionMap = {
        /**
         * @event
         * Triggered when the webview is created and ready
         */
        webviewready: {
            context: require("./context"),
            event: "webviewready",
            trigger: function (args) {
                _event.trigger("webviewready", args);
            }
        },
        webviewdestroyed: {
            context: require("./context"),
            event: "webviewdestroyed",
            trigger: function (args) {
                _event.trigger("webviewdestroyed", args);
            }
        }
    };

(function init() {
    var eventExt = _utils.loadExtensionModule("event", "index");
    eventExt.registerEvents(_actionMap);
}());

/**
 * Exports are the publicly accessible functions
 */
module.exports = {

    /**
     * Creates a webview
     * @param success {Function} Function to call if the operation is a success
     * @param fail {Function} Function to call if the operation fails
     * @param args {Object} The arguments supplied. Available arguments for this call are:
     * Ex: {
     *      url: [optional],
     *      x: <left>,
     *      y: <top>,
     *      w: <width>,
     *      h: <height>,
     *      z: <zOrder>
     *  }
     * @param env {Object} Environment variables
     * @returns id {Object} The id of the webview created.
     */
    create: function (success, fail, args) {
        var localArgs = (args && args.options) ? JSON.parse(decodeURIComponent(args.options)) : {},
            id = _webviews.create(localArgs);

        success(id);
    },

    /**
     * Destroys a webview
     * @param success {Function} Function to call if the operation is a success
     * @param fail {Function} Function to call if the operation fails
     * @param args {Object} The arguments supplied. Available arguments for this call are: N/A
     * @param env {Object} Environment variables
     */
    destroy: function (success, fail, args) {
        try {
            var id = JSON.parse(decodeURIComponent(args.id));
            success(_webviews.destroy(id));
        } catch (e) {
            fail(-1, e);
        }
    }
};
