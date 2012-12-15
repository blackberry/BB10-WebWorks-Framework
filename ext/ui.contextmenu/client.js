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
var contextmenu = {},
    _ID = "blackberry.ui.contextmenu",
    _storedCallbacks = {},
    _listeningForCallbacks = false;

function defineReadOnlyContext(field) {
    Object.defineProperty(contextmenu, "CONTEXT_" + field, {"value": field, "writable": false});
}

function defineReadOnlyActions(name, value) {
    Object.defineProperty(contextmenu, "ACTION_" + name, {"value": value, "writable": false});
}

function listen() {
    window.blackberry.event.addEventListener('contextmenu.executeMenuAction', function (actionId, elementId) {
        if (typeof _storedCallbacks[actionId] === 'function') {
            _storedCallbacks[actionId](elementId);
        }
    });
}

// Define the enabled property that an API developer can access
// to enable/disable the context menu UI
Object.defineProperty(contextmenu, "enabled", {
    get : function () {
        var enabled;
        try {
            enabled = window.webworks.execSync(_ID, "enabled");
        } catch (error) {
            console.log(error);
        }
        return enabled;
    },
    set: function (value) {
        try {
            window.webworks.execSync(_ID, "enabled", {"enabled": value});
        } catch (error) {
            console.error(error);
        }
    }
});

contextmenu.clearOverride = function (actionId) {

    if (typeof actionId === 'undefined') {
        return 'Clearing override on a menu item requires an actionId';
    }

    if (_storedCallbacks[actionId]) {
        delete _storedCallbacks[actionId];
    }

    window.webworks.execSync(_ID, 'clearOverride', { actionId: actionId});
};

contextmenu.overrideItem = function (action, callback) {

    if (typeof action.actionId === 'undefined') {
        return 'Overriding a menu item requires an actionId';
    }

    _storedCallbacks[action.actionId] = callback;
    if (!_listeningForCallbacks) {
        _listeningForCallbacks = true;
        listen();
    }
    window.webworks.execSync(_ID, 'overrideItem', {action: action});
};


contextmenu.addItem = function (contexts, action, callback) {

    if (typeof contexts === 'undefined') {
        return 'Adding a custom menu item requires a context';
    }

    if (typeof action.actionId === 'undefined') {
        return 'Adding a custom menu item requires an actionId';
    }

    _storedCallbacks[action.actionId] = callback;
    if (!_listeningForCallbacks) {
        _listeningForCallbacks = true;
        listen();
    }
    window.webworks.execAsync(_ID, 'addItem', {contexts: contexts, action: action});
};

contextmenu.removeItem = function (contexts, actionId) {

    if (typeof contexts === 'undefined') {
        return 'Removing a custom menu item requires a context';
    }

    if (typeof actionId === 'undefined') {
        return 'Removing a custom menu item requires an actionId';
    }

    window.webworks.execAsync(_ID, 'removeItem', {contexts: contexts, actionId: actionId});
    delete _storedCallbacks[actionId];
};

contextmenu.defineCustomContext = function (customContext, options) {
    window.webworks.execAsync(_ID, 'defineCustomContext', {context: customContext, options: options});
};

defineReadOnlyContext("ALL");
defineReadOnlyContext("LINK");
defineReadOnlyContext("IMAGE_LINK");
defineReadOnlyContext("IMAGE");
defineReadOnlyContext("INPUT");
defineReadOnlyContext("TEXT");

defineReadOnlyActions("CLEAR_FIELD", "ClearField");
defineReadOnlyActions("CANCEL", "Cancel");
defineReadOnlyActions("CUT", "Cut");
defineReadOnlyActions("COPY", "Copy");
defineReadOnlyActions("PASTE", "Paste");
defineReadOnlyActions("SELECT", "Select");
defineReadOnlyActions("COPY_LINK", "CopyLink");
defineReadOnlyActions("SAVE_LINK_AS", "SaveLinkAs");
defineReadOnlyActions("SAVE_IMAGE", "SaveImage");
defineReadOnlyActions("COPY_IMAGE_LINK", "CopyImageLink");
defineReadOnlyActions("VIEW_IMAGE", "ViewImage");
defineReadOnlyActions("INSPECT_ELEMENT", "InspectElement");

module.exports = contextmenu;
