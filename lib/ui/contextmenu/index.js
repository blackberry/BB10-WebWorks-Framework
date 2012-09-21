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
    _webview = require('./../../../lib/webview'),
    _overlayWebView = require('./../../../lib/overlayWebView'),
    _utils = require('./../../../lib/utils'),
    _config = require('./../../../lib/config.js'),
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
    if (args && args.enabled) {
        var enable = JSON.parse(decodeURIComponent(args.enabled));
        contextMenuEnabled = enable;
        success();
    } else {
        success(contextMenuEnabled);
    }
}

function setMenuOptions(options) {
    _menuItems = options;
}

function generateMenuItems(menuItems, cb) {

/*
    With having to check for invocation query targets, pushing of the menu items is no longer sync since the
    querying is async. To mitigate this, callbacks are queued and run from start to finish.
 */

    var items = [],
        hasCancel = false,
        jobQueue = [],
        i,
        addItem = function (obj, callback) {
            items.push(obj);
            callback();
        },
        addShareItem = function (callback) {
            var request = {
                action: 'bb.action.SHARE',
                type: 'text/plain',
                target_type_mask: _application.invocation.TARGET_TYPE_MASK_APPLICATION | _application.invocation.TARGET_TYPE_MASK_CARD |
                    _application.invocation.TARGET_TYPE_MASK_SERVICE
            };

            // Depends on how many targets we have when asking the invocation module
            _invocation.queryTargets(request, function (error, results) {
                var targets = results[0].targets;

                if (error || results.length === 0) {
                    // Don't add menu item if we can't share
                    callback();
                    return;
                } else if (targets.length === 1) {
                    items.push({'label': 'Share | ' + targets[0].label, 'actionId': 'ShareLink', 'imageUrl': 'assets/Browser_ShareLink.png'});
                } else {
                    // local and file protocol won't have sharelink menuitem
                    if (!/^local|^file/.test(_currentContext.url)) {
                        items.push({'label': 'Share Link', 'actionId': 'ShareLink', 'imageUrl': 'assets/Browser_ShareLink.png'});
                    }
                }

                _actions.invocationResults = results;
                callback();
            });
        };

    for (i = 0; i < menuItems.length; i++) {
        switch (menuItems[i]) {
        case 'ClearField':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': 'assets/Browser_Cancel_Selection.png'}]
            });
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
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Dismiss Selection', 'actionId': 'Cancel', 'imageUrl': 'assets/Browser_Cancel_Selection.png', 'isDelete': true}]
            });
            hasCancel = true;
            break;
        case 'Cut':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Cut', 'actionId': 'Cut', 'imageUrl': 'assets/Browser_Cut.png'}]
            });
            break;
        case 'Copy':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Copy', 'actionId': 'Copy', 'imageUrl': 'assets/Browser_Copy.png'}]
            });
            break;
        case 'Paste':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Paste', 'actionId': 'Paste', 'imageUrl': 'assets/crosscutmenu_paste.png'}]
            });
            break;
        case 'Select':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Select', 'actionId': 'Select', 'imageUrl': 'assets/crosscutmenu_paste.png'}]
            });
            break;
        case 'AddLinkToBookmarks':
            break;
        case 'CopyLink':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': 'assets/Browser_CopyLink.png'}]
            });
            break;
        case 'OpenLinkInNewTab':
            break;
        case 'OpenLink':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Open', 'actionId': 'OpenLink', 'imageUrl': 'assets/Browser_OpenLink.png'}]
            });        
            break;
        case 'SaveLinkAs':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Save Link as', 'actionId': 'SaveLinkAs', 'imageUrl': 'assets/Browser_SaveLink.png'}]
            }); 
            break;
        case 'SaveImage':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Save Image', 'actionId': 'SaveImage', 'imageUrl': 'assets/Browser_SaveImage.png'}]
            }); 
            break;
        case 'CopyImageLink':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': 'assets/Browser_CopyImageLink.png'}]
            }); 
            break;
        case 'ViewImage':
            break;
        case 'Search':
            break;
        case 'ShareLink':
            jobQueue.push({
                func: addShareItem,
                args: []
            }); 
            break;        
        case 'ShareImage':
            break;
        case 'InspectElement':
            jobQueue.push({
                func: addItem,
                args: [{'label': 'Inspect Element', 'actionId': 'InspectElement', 'imageUrl': 'assets/generic_81_81_placeholder.png'}]
            }); 
            break;
        }
    }

    if (!hasCancel) {
        jobQueue.push({
            func: addItem,
            args: [{'label': 'Cancel', 'actionId': 'Cancel', 'imageUrl': 'assets/Browser_Cancel_Selection.png', 'isDelete': true}]
        }); 
    }

    if (_currentContext && _currentContext.url && _currentContext.text) {
        jobQueue.push({
            func: addItem,
            args: [{'headText': _currentContext.text, 'subheadText': _currentContext.url}]
        }); 
    }

    // Execute pushing of items as a series since theres an async task in there
    _utils.series(jobQueue, {
        func: cb,
        args: [items]
    });
}

function safeEval(jsonString) {
    return JSON.parse('{"obj":' + jsonString + '}').obj;
}

function addItem(success, fail, args, env) {
    var contexts = JSON.parse(decodeURIComponent(args.contexts)),
        action = JSON.parse(decodeURIComponent(args.action)),
        contextKey,
        context;

    // Check actionId is valid or if item already has been added
    if (!action.actionId || action.actionId === '') {
        return fail('Cannot add item.  actionId is not valid');
    } else if (!_actions.addCustomItem(action.actionId)) {
        return fail('Cannot add item.  A menu item with the actionId "' + action.actionId + '" already exists.');
    }

    for (contextKey in contexts) {
        if (contexts.hasOwnProperty(contextKey)) {
            context = contexts[contextKey];
            if (!_customContextItems[context]) {
                _customContextItems[context] = {};
            }
            _customContextItems[context][action.actionId] = action;
        }
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
    var contexts = JSON.parse(decodeURIComponent(args.contexts)),
        actionId = safeEval(decodeURIComponent(args.actionId)),
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
    var customContextItems = _customContextItems[context],
        lastItem = items.slice(-1)[0],
        lastItemIsDelete = lastItem && lastItem.isDelete,
        actionId;

    if (lastItemIsDelete) {
        lastItem = items.pop();
    }

    if (customContextItems) {
        for (actionId in customContextItems) {
            if (customContextItems.hasOwnProperty(actionId)) {
                items.push(customContextItems[actionId]);
            }
        }
    }

    if (lastItemIsDelete) {
        items.push(lastItem);
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
    _overlayWebView.onContextMenuCancelEvent = function (value) {
        if (contextMenuEnabled) {
            _overlayWebView.executeJavascript("require('contextmenu').hideContextMenu()");
        }
    };
    _overlayWebView.onContextMenuRequestEvent = function (value) {
        var menu = JSON.parse(value),
                    args;

        // Always clear out previous invocation targets before re-generating menu items
        _actions.invocationResults = [];

        generateMenuItems(menu.menuItems, function (items) {
            if (contextMenuEnabled) {
                addCustomItems(items, _currentContext);
                args = JSON.stringify({'menuItems': items, '_currentContext': _currentContext});
                _overlayWebView.executeJavascript("window.showMenu(" + args + ")");
            }
        });
       
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
