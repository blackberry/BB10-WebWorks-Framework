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
    _customContextItems = {},
    _menuActions,
    contextMenuEnabled = true,
    CONTEXT_ALL = 'ALL',
    CONTEXT_LINK = 'LINK',
    CONTEXT_IMAGE_LINK = 'IMAGE_LINK',
    CONTEXT_IMAGE = 'IMAGE',
    CONTEXT_TEXT = 'TEXT',
    CONTEXT_INPUT = 'INPUT';

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
            items.push({'label': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
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
            items.push({'label': 'Cancel', 'actionId': 'Cancel', 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
            break;
        case 'Cut':
            items.push({'label': 'Cut', 'actionId': 'Cut', 'imageUrl': 'assets/Browser_Cut.png'});
            break;
        case 'Copy':
            items.push({'label': 'Copy', 'actionId': 'Copy', 'imageUrl': 'assets/Browser_Copy.png'});
            break;
        case 'Paste':
            items.push({'label': 'Paste', 'actionId': 'Paste', 'imageUrl': 'assets/crosscutmenu_paste.png'});
            break;
        case 'Select':
            items.push({'label': 'Select', 'actionId': 'Select', 'imageUrl': 'assets/crosscutmenu_paste.png'});
            break;
        case 'AddLinkToBookmarks':
            break;
        case 'CopyLink':
            items.push({'label': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': 'assets/Browser_CopyLink.png'});
            break;
        case 'OpenLinkInNewTab':
            break;
        case 'OpenLink':
            items.push({'label': 'Open', 'actionId': 'OpenLink', 'imageUrl': 'assets/Browser_OpenLink.png'});
            break;
        case 'SaveLinkAs':
            items.push({'label': 'Save Link as', 'actionId': 'SaveLinkAs', 'imageUrl': 'assets/Browser_SaveLink.png'});
            break;
        case 'SaveImage':
            items.push({'label': 'Save Image', 'actionId': 'SaveImage', 'imageUrl': 'assets/Browser_SaveImage.png'});
            break;
        case 'CopyImageLink':
            items.push({'label': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': 'assets/Browser_CopyImageLink.png'});
            break;
        case 'ViewImage':
            break;
        case 'Search':
            break;
        case 'ShareLink':
            // local and file protocol won't have sharelink menuitem
            if (!/^local|^file/.test(_currentContext.url)) {
                items.push({'label': 'Share Link', 'actionId': 'ShareLink', 'imageUrl': 'assets/Browser_ShareLink.png'});
            }
            break;
        case 'ShareImage':
            break;
        case 'InspectElement':
            items.push({'label': 'Inspect Element', 'actionId': 'InspectElement', 'imageUrl': 'assets/generic_81_81_placeholder.png'});
            break;
        }
    }

    if (_currentContext && _currentContext.url && _currentContext.text) {
        items.push({'headText': _currentContext.text, 'subheadText': _currentContext.url});
    }

    return items;
}

function safeEval(jsonString) {
    return JSON.parse('{"obj":' + jsonString + '}').obj;
}

function addItem(success, fail, args, env) {
    var contexts = JSON.parse(decodeURIComponent(args["contexts"])),
        action = JSON.parse(decodeURIComponent(args["action"])),
        context;
    
    // Check actionId is valid or if item already has been added
    if (!action.actionId || action.actionId === '') {
        return fail('Cannot add item.  actionId is not valid');
    } else if (!_actions.addCustomItem(action.actionId)) {
        return fail('Cannot add item.  A menu item with the actionId "' + action.actionId + '" already exists.');
    }

    for (context in contexts) {
        if (!_customContextItems[contexts[context]]) {
            _customContextItems[contexts[context]] = {};
        }
        _customContextItems[contexts[context]][action.actionId] = action; 
    }
   
    success();
}

function removeItemFromAllContexts(actionId) {
    var everyContext = [CONTEXT_ALL,
                        CONTEXT_LINK, 
                        CONTEXT_IMAGE_LINK,
                        CONTEXT_IMAGE,
                        CONTEXT_INPUT,
                        CONTEXT_TEXT],
        context;

    for (context in everyContext) {
        if (_customContextItems[everyContext[context]]) { 
            delete _customContextItems[everyContext[context]][actionId];
        } 
    }
}

function removeItem(success, fail, args, env) {
    var contexts = JSON.parse(decodeURIComponent(args["contexts"])),
        actionId = safeEval(decodeURIComponent(args["actionId"])),
        context;

    for (context in contexts) {
        if (contexts[context] === CONTEXT_ALL) {
            removeItemFromAllContexts(actionId);
        } else {
            if (_customContextItems[contexts[context]]) {
                delete _customContextItems[contexts[context]][actionId]; 
            }
        }
    }
    _actions.removeCustomItem(actionId);
    success();
}

function addCustomItemsForContext(items, context) {
    var customItem; 
       
    if (_customContextItems[context]) {
        for (customItem in _customContextItems[context]) {
            items.push(_customContextItems[context][customItem]); 
        }
    }
}

function addCustomItems(menuItems, currentContext) {
      
    var context;

    // Add ALL
    addCustomItemsForContext(menuItems, CONTEXT_ALL);
   
    // Determine context
    if (currentContext.url && !currentContext.isImage) {
        context = CONTEXT_LINK;
    }
    else if (currentContext.url && currentContext.isImage) {
        context = CONTEXT_IMAGE_LINK;
    }
    else if (currentContext.isImage) {
        context = CONTEXT_IMAGE;
    }
    else if (currentContext.isInput) {
        context = CONTEXT_INPUT;
    }
    else if (currentContext.text) {
        context = CONTEXT_TEXT;
    }
    
    addCustomItemsForContext(menuItems, context);
}

function restoreDefaultMenu() {
    _customContextItems = {};
    _actions.clearCustomHandlers();
}

function init() {

    _overlayWebView.onPropertyCurrentContextEvent = function (value) {
        _currentContext = JSON.parse(value);
        _actions.setCurrentContext(_currentContext);
    };
    _overlayWebView.onContextMenuRequestEvent = function (value) {
        var menu = JSON.parse(value),
            menuItems = generateMenuItems(menu.menuItems),
            args; 
            
        if (contextMenuEnabled) {
            addCustomItems(menuItems, _currentContext);
            args = JSON.stringify({'menuItems': menuItems, '_currentContext': _currentContext});
            _overlayWebView.executeJavascript("window.showMenu(" + args + ")");
        }
        return '{"setPreventDefault":true}';
    };
    _controller.publishRemoteFunction('executeMenuAction', function (args, callback) {
        var actionId = args[0];
        if (actionId) {
            _actions.runHandler(actionId);
        }
    });
    _webview.addEventListener('DocumentLoaded', function () {
        restoreDefaultMenu();
    });
}

contextmenu = {
    enabled : enabled,
    addItem: addItem,
    removeItem: removeItem
};

// Listen for the init event
qnx.webplatform.getController().addEventListener('ui.init', function () {
    init();
});

module.exports = contextmenu;
