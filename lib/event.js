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

var util = require("./utils"),
    _webview = util.requireWebview();

module.exports = {
    trigger: function (name) {
        //Change arguments into a real array instead of a fake one
        var args = Array.prototype.slice.call(arguments);
        //Send all the arguments as JSON
        _webview.executeJavascript("webworks.event.trigger('" + name + "', '" + JSON.stringify(args.slice(1)) + "')");
    },

    add: function (action) {
        if (action) {
            action.context.addEventListener(action.event, action.trigger || this.trigger);
        } else {
            throw "Action is null or undefined";
        }
    },

    remove: function (action) {
        if (action) {
            action.context.removeEventListener(action.event, action.trigger || this.trigger);
        } else {
            throw "Action is null or undefined";
        }

    }
};
