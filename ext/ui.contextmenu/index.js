/*
 * Copyright 2012 Research In Motion Limited.
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

var LIB_FOLDER = "../../lib/",
    contextmenu,
    _overlayWebView,
    _event = require(LIB_FOLDER + 'event'),
    _utils = require(LIB_FOLDER + 'utils');

function enabled(success, fail, args, env) {
    var _enabled;
    if (typeof args.enabled !== 'undefined') {
        _enabled = JSON.parse(decodeURIComponent(args.enabled));
        if (typeof(_enabled) === 'boolean') {
            _overlayWebView.contextMenu.enabled = _enabled;
        }
        success();
    } else {
        success(_overlayWebView.contextMenu.enabled);
    }
}

function addItem(success, fail, args, env) {
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.action = JSON.parse(decodeURIComponent(args.action));
    args.handler = function (actionId) {
        _event.trigger("contextmenu.executeMenuAction", actionId);
    };
    _overlayWebView.contextMenu.addItem(success, fail, args, env);
}

function removeItem(success, fail, args, env) {
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    _overlayWebView.contextMenu.removeItem(success, fail, args, env);
}

contextmenu = {
    enabled: enabled,
    addItem: addItem,
    removeItem: removeItem
};

qnx.webplatform.getController().addEventListener('ui.init', function () {
    _overlayWebView = require(LIB_FOLDER + 'overlayWebView');
});

module.exports = contextmenu;
