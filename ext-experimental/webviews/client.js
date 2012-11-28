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
 *
 * @author dkerr, jheifetz
 * $Id: client.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
 */

var _ID = require("./manifest.json").namespace;

/**
 * Exports are the publicly accessible functions
 */
module.exports = {

    /**
     * Creates a new webview
     * @param args {Object} The list of params needed to create a webview
     * Ex: {
     *      url: [optional],
     *      x: <left>,
     *      y: <top>,
     *      w: <width>,
     *      h: <height>,
     *      z: <zOrder>
     *  }
     * @returns {Number} The webview ID
     */
    create: function (options) {
        var args = {};

        if (options) {
            args.options = options;
        }

        return window.webworks.execSync(_ID, "create", args);
    },

    /**
     * Destroys a webview
     * @param id {Number} The webview ID
     */
    destroy: function (id) {
        window.webworks.execSync(_ID, "destroy", {id: id});
    }
};
