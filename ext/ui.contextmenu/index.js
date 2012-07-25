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

var contextmenu,
    _webview = require('./../../lib/webview'),
    _overlayWebView = require('./../../lib/overlayWebView'),
    _utils = require('./../../lib/utils'),
    _config = require('./../../lib/config.js'),
    _actions = require('./actions'),
    _menuItems,
    _currentContext,
    _invocation = window.qnx.webplatform.getApplication().invocation,
    _controller = window.qnx.webplatform.getController(),
    _application = window.qnx.webplatform.getApplication(),
    menuActions,
    contextMenuEnabled = true;

function enabled(success, fail, args, env) {
    if (args) {
        var enable = JSON.parse(decodeURIComponent(args["enabled"]));
        contextMenuEnabled = enable;
        success('ContextMenuEnabled has been set to ' + contextMenuEnabled);
    } else {
        fail('ContextMenuEnabled property can only be set with true or false.');
    }
}

function setMenuOptions(options) {
    _menuItems = options;
}

function generateMenuItems(menuItems) {
    var items = [],
    i;

    for (i = 0; i < menuItems.length; i++) {
        switch (menuItems[i]) {
        case 'ClearField':
            items.push({'name': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
            break;
        case 'SendLink':
            break;
        case 'SendImageLink':
            break;
        case 'FullMenu':
            break;
        case 'Delete':
            break;
        case 'Cancel':
            items.push({'name': 'Cancel', 'actionId': 'Cancel', 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
            break;
        case 'Cut':
            items.push({'name': 'Cut', 'actionId': 'Cut', 'imageUrl': 'assets/Browser_Cut.png'});
            break;
        case 'Copy':
            items.push({'name': 'Copy', 'actionId': 'Copy', 'imageUrl': 'assets/Browser_Copy.png'});
            break;
        case 'Paste':
            items.push({'name': 'Paste', 'actionId': 'Paste', 'imageUrl': 'assets/crosscutmenu_paste.png'});
            break;
        case 'Select':
            items.push({'name': 'Select', 'actionId': 'Select', 'imageUrl': 'assets/crosscutmenu_paste.png'});
            break;
        case 'AddLinkToBookmarks':
            break;
        case 'CopyLink':
            items.push({'name': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': 'assets/Browser_CopyLink.png'});
            break;
        case 'OpenLinkInNewTab':
            break;
        case 'OpenLink':
            items.push({'name': 'Open', 'actionId': 'OpenLink', 'imageUrl': 'assets/Browser_OpenLink.png'});
            break;
        case 'SaveLinkAs':
            items.push({'name': 'Save Link as', 'actionId': 'SaveLinkAs', 'imageUrl': 'assets/Browser_SaveLink.png'});
            break;
        case 'SaveImage':
            items.push({'name': 'Save Image', 'actionId': 'SaveImage', 'imageUrl': 'assets/Browser_SaveImage.png'});
            break;
        case 'CopyImageLink':
            items.push({'name': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': 'assets/Browser_CopyImageLink.png'});
            break;
        case 'ViewImage':
            break;
        case 'Search':
            break;
        case 'ShareLink':
            // local and file protocol won't have sharelink menuitem
            if (!/^local|^file/.test(_currentContext.url)) {
                items.push({'name': 'Share Link', 'actionId': 'ShareLink', 'imageUrl': 'assets/Browser_ShareLink.png'});
            }
            break;
        case 'ShareImage':
            break;
        case 'InspectElement':
            items.push({'name': 'Inspect Element', 'actionId': 'InspectElement', 'imageUrl': 'assets/generic_81_81_placeholder.png'});
            break;
        }
    }

    if (_currentContext && _currentContext.url && _currentContext.text) {
        items.push({'headText': _currentContext.text, 'subheadText': _currentContext.url});
    }

    return items;
}

function init() {

    _overlayWebView.onPropertyCurrentContextEvent = function (value) {
        _currentContext = JSON.parse(value);
        _actions.setCurrentContext(_currentContext);
    };
    _overlayWebView.onContextMenuRequestEvent = function (value) {
        var menu = JSON.parse(value),
            menuItems = generateMenuItems(menu.menuItems),
        args = JSON.stringify({'menuItems': menuItems,
                              '_currentContext': _currentContext});
        _controller.publishRemoteFunction('executeMenuAction', function (args, callback) {
            var action = args[0];
            if (action) {
                console.log("Executing action: " + args[0]);
                //Call the items[action] function //
                _actions[action](action);
            } else {
                console.log("No action item was set");
            }
        });

        if (contextMenuEnabled) {
            _overlayWebView.executeJavascript("window.showMenu(" + args + ")");
        } else {
            console.log("Context Menu is disabled");
        }
        return '{"setPreventDefault":true}';
    };

    _controller.publishRemoteFunction('executeMenuAction', function (args, callback) {
        var action = args[0];
        if (action) {
            console.log("Executing action: " + args[0]);
            //Call the items[action] function //
            _actions[action](action);
        } else {
            console.log("No action item was set");
        }
    });


}

contextmenu = {
    init: init,
    setMenuOptions: setMenuOptions,
    enabled : enabled
};

// Listen for the init event
qnx.webplatform.getController().addEventListener('ui.init', function () {
    init();
});

module.exports = contextmenu;
