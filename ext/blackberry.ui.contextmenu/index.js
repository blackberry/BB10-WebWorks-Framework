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
    _menuItems,
    _currentContext,
    _controller = window.qnx.webplatform.getController(),
    _application = window.qnx.webplatform.getApplication(),
    menuActions;


function enabled(success, fail, args, env) {
    if (args) {
        var enable = JSON.parse(decodeURIComponent(args["enabled"]));
        _webview.setContextMenuEnabled(enable);

        success('return value goes here for success');
    } else {
        fail('ContextMenuEnabled property can only be set with true false.');
    }
}

function setMenuOptions(options) {
    _menuItems = options;
}

function peekContextMenu() {
    //rpc to set head text
    //rpc to set subhead text
    //rpc to set the items
    //rpc to peek menu
}

function isMenuVisible() {
    // rpc to overlay to determine visibility
}

function setCurrentContext(context) {
    _currentContext = context;
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
    };
    _overlayWebView.onContextMenuRequestEvent = function (value) {
        console.log('menu requested');
        var menu = JSON.parse(value),
            menuItems = generateMenuItems(eval(menu.menuItems)),
        args = JSON.stringify({'menuItems': menuItems,
                              '_currentContext': _currentContext});

        _controller.publishRemoteFunction('executeMenuAction', function (args, callback) {
            var action = args[0];
            if (action) {
                console.log("Executing action: " + args[0]);
                //Call the items[action] function //
                menuActions[action]();
            } else {
                console.log("No action item was set");
            }
        });

        // generate menu items
        // set menu items
        console.log(menuItems);
        _overlayWebView.executeJavaScript("window.showMenu(" + args + ")");
        return '{"setPreventDefault":true}';
    };

    qnx.webplatform.getController().publishRemoteFunction('ccm.run', function (args) {
        console.log('got ' + args[0]);
    });
}

function generateInvocationList(request, errorMessage) {
    var args = [request, errorMessage];
    qnx.webplatform.getController().remoteExec(1, "invocation.queryTargets", args, function (results) {
        if (results.length > 0) {
            var list = require('listBuilder');
            list.init();
            list.setHeader(results[0].label);
            list.populateList(results[0].targets, request);
            list.show();
        } else {
            alert(errorMessage);
        }
    });
}

function saveLink() {
    if (!_currentContext || !_currentContext.url) {
        return;
    }
    var title = '';
    _controller.downloadURL([_currentContext.url, title]);
}

function openLink() {
    if (!_currentContext || !_currentContext.url) {
        return;
    }
    //Update the content web view with the new URL
    _controller.loadClientURL([_currentContext.url]);
}

function shareLink() {

    if (!_currentContext || !_currentContext.url) {
        return;
    }

    var request = {
        action: 'bb.action.SHARE',
        type : 'text/plain',
        data : _currentContext.url,
        action_type: _application.invocation.ACTION_TYPE_ALL,
        target_type: _application.invocation.TARGET_TYPE_APPLICATION
    };

    generateInvocationList(request, 'No link sharing applications installed');
}


function saveImage() {

    // Ensure we have a proper context of the image to save
    if (!_currentContext || !_currentContext.isImage || !_currentContext.src) {
        return;
    }

    // Check that the proper access permissions have been enabled
    if (!_config.permissions || _config.permissions.indexOf("access_shared") === -1) {
        alert("Access shared permissions are not enabled");
        return;
    }

    var source     = _currentContext.src,
        target     = "photos";

    function onSaved(target) {

        if (target) {
            var request = {
                action: 'bb.action.VIEW',
                type: _utils.fileNameToImageMIME(target),
                uri : "file:/" + target, //target comes back with double slash, change to triple
                action_type: _application.invocation.ACTION_TYPE_ALL,
                target_type: _application.invocation.TARGET_TYPE_ALL
            };

            generateInvocationList(request, 'No image viewing applications installed');
        }
    }
    // Download the file over an RPC call to the controller, it will call our onSaved method to see if we succeeded
    _controller.downloadSharedFile([source, target], onSaved);
}

function responseHandler(menuAction) {
    if (!menuAction) {
        return;
    }
    _controller.handleContextMenuResponse([menuAction]);
}


menuActions = {

    'SaveLink'       : saveLink,
    'Cancel'         : responseHandler,
    'Cut'            : responseHandler,
    'Copy'           : responseHandler,
    'Paste'          : responseHandler,
    'Select'         : responseHandler,
    'CopyLink'       : responseHandler,
    'OpenLink'       : openLink,
    'SaveLinkAs'     : responseHandler,
    'CopyImageLink'  : responseHandler,
    'SaveImage'      : saveImage,
    'ShareLink'      : shareLink,
    'InspectElement' : responseHandler,
};


contextmenu = {
    init: init,
    setMenuOptions: setMenuOptions,
    peek: peekContextMenu
};

// Listen for the init event
qnx.webplatform.getController().addEventListener('ui.init', function () {
    init();
});

module.exports = contextmenu;
