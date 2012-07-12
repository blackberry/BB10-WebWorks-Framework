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

var contextmenu,
    menuVisible,
    menuPeeked,
    currentContext,
    config,
    utils,
    includePath;


function requireLocal(id) {
    return require(!!require.resolve ? "../../" + id.replace(/\/chrome/, "") : id);
}

function init() {
    var menu = document.getElementById('contextMenu');
    menu.addEventListener('webkitTransitionEnd', contextmenu.transitionEnd.bind(contextmenu));
    config = requireLocal("../chrome/lib/config.js");
    utils = requireLocal("../chrome/lib/utils");
}

contextmenu = {
    init: init,
    setMenuOptions: function (options) {
        var menu = document.getElementById("contextMenuContent"),
            i,
            header,
            menuItem,
            callback,
            menuImage;

        while (menu.childNodes.length >= 1) {
            menu.removeChild(menu.firstChild);
        }
        contextmenu.setHeadText('');
        contextmenu.setSubheadText('');

        for (i = 0; i < options.length; i++) {
            if (options[i].headText || options[i].subheadText) {
                header = document.getElementById('contextMenuHeader');
                header.className = 'contextMenuHeader';
                if (options[i].headText) {
                    contextmenu.setHeadText(options[i].headText);
                }
                if (options[i].subheadText) {
                    contextmenu.setSubheadText(options[i].subheadText);
                }
                continue;
            }
            menuItem = document.createElement('div');
            callback = options[i].function;
            menuImage = document.createElement('img');
            menuImage.src = options[i].imageUrl ? options[i].imageUrl : 'assets/generic_81_81_placeholder.png';
            menuItem.appendChild(menuImage);
            menuItem.appendChild(document.createTextNode(options[i].name));
            menuItem.setAttribute("class", "menuItem");
            menuItem.ontouchend = callback.bind(this, menuItem);
            menuItem.addEventListener('mousedown', contextmenu.handleMouseDown, false);
            menu.appendChild(menuItem);
        }
    },

    handleMouseDown: function (evt) {
        evt.preventDefault();
    },

    setHeadText: function (text) {
        var headText = document.getElementById('contextMenuHeadText');
        headText.innerText = text;
    },

    setSubheadText: function (text) {
        var subheadText = document.getElementById('contextMenuSubheadText');
        subheadText.innerText = text;
    },

    showContextMenu: function (evt) {
        if (menuVisible) {
            return;
        }
        var menu = document.getElementById('contextMenu');
        menu.className = 'showMenu';
        menuVisible = true;
        if (menuPeeked) {
            evt.cancelBubble = true;
            menuPeeked = false;
        }
    },

    isMenuVisible: function () {
        return menuVisible || menuPeeked;
    },

    hideContextMenu: function () {
        if (!menuVisible && !menuPeeked) {
            return;
        }
        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle');
        menu.removeEventListener('touchend', contextmenu.hideContextMenu, false);
        handle.removeEventListener('touchend', contextmenu.showContextMenu, false);
        menuVisible = false;
        menuPeeked = false;
        menu.className = 'hideMenu';
        qnx.callExtensionMethod("webview.notifyContextMenuCancelled", 2);

        // Reset sensitivity
        window.qnx.webplatform.getController().remoteExec(1, 'webview.setSensitivity', ['SensitivityTest']);
    },

    peekContextMenu: function (show, zIndex) {
        if (menuVisible || menuPeeked) {
            return;
        }
        window.qnx.webplatform.getController().remoteExec(1, 'webview.setSensitivity', ['SensitivityNoFocus']);
        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle');
        handle.className = 'showContextMenuHandle';
        menuVisible = false;
        menuPeeked = true;
        menu.className = 'peekContextMenu';
    },

    transitionEnd: function () {
        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle'),
            header;
        if (menuVisible) {
            menu.addEventListener('touchend', contextmenu.hideContextMenu, false);
            handle.removeEventListener('touchend', contextmenu.showContextMenu, false);
        } else if (menuPeeked) {
            handle.addEventListener('touchend', contextmenu.showContextMenu, false);
            menu.addEventListener('touchend', contextmenu.hideContextMenu, false);
        } else {
            header = document.getElementById('contextMenuHeader');
            header.className = '';
            contextmenu.setHeadText('');
            contextmenu.setSubheadText('');
        }
    },

    saveLink: function () {
        if (!currentContext || !currentContext.url) {
            return;
        }
        var title = '';
        window.qnx.webplatform.getController().remoteExec(1, 'webview.downloadURL', [currentContext.url, title]);
    },

    openLink: function () {
        if (!currentContext || !currentContext.url) {
            return;
        }
        //Update the content web view with the new URL
        window.qnx.webplatform.getController().remoteExec(1, 'webview.loadURL', [currentContext.url]);
    },

    saveImage: function () {

        // Ensure we have a proper context of the image to save
        if (!currentContext || !currentContext.isImage || !currentContext.src) {
            return;
        }

        // Check that the proper access permissions have been enabled
        if (!config.permissions || config.permissions.indexOf("access_shared") === -1) {
            alert("Access shared permissions are not enabled");
            return;
        }

        var source     = currentContext.src,
            target     = "photos";

        function onSaved(target) {

            if (target) {
                var request = {
                    action: 'bb.action.VIEW',
                    type: utils.fileNameToImageMIME(target),
                    uri : "file:/" + target, //target comes back with double slash, change to triple
                    action_type: window.qnx.webplatform.getApplication().invocation.ACTION_TYPE_ALL,
                    target_type: window.qnx.webplatform.getApplication().invocation.TARGET_TYPE_ALL
                };

                contextmenu.generateInvocationList(request, 'No image viewing applications installed');
            }
        }
        // Download the file over an RPC call to the controller, it will call our onSaved method to see if we succeeded
        window.qnx.webplatform.getController().remoteExec(1, 'webview.downloadSharedFile', [source, target], onSaved);
    },

    responseHandler: function (menuAction) {
        if (!menuAction) {
            return;
        }
        window.qnx.webplatform.getController().remoteExec(1, 'webview.handleContextMenuResponse', [menuAction]);
    },

    generateContextMenuItems: function (value) {
        var items = [],
            i;

        for (i = 0; i < value.length; i++) {
            switch (value[i]) {
            case 'ClearField':
                items.push({'name': 'Clear Field', 'function': contextmenu.responseHandler.bind(this, 'ClearField'), 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
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
                items.push({'name': 'Cancel', 'function': contextmenu.responseHandler.bind(this, 'Cancel'), 'imageUrl': 'assets/Browser_Cancel_Selection.png'});
                break;
            case 'Cut':
                items.push({'name': 'Cut', 'function': contextmenu.responseHandler.bind(this, 'Cut'), 'imageUrl': 'assets/Browser_Cut.png'});
                break;
            case 'Copy':
                items.push({'name': 'Copy', 'function': contextmenu.responseHandler.bind(this, 'Copy'), 'imageUrl': 'assets/Browser_Copy.png'});
                break;
            case 'Paste':
                items.push({'name': 'Paste', 'function': contextmenu.responseHandler.bind(this, 'Paste'), 'imageUrl': 'assets/crosscutmenu_paste.png'});
                break;
            case 'Select':
                items.push({'name': 'Select', 'function': contextmenu.responseHandler.bind(this, 'Select'), 'imageUrl': 'assets/crosscutmenu_paste.png'});
                break;
            case 'AddLinkToBookmarks':
                break;
            case 'CopyLink':
                items.push({'name': 'Copy Link', 'function': contextmenu.responseHandler.bind(this, 'CopyLink'), 'imageUrl': 'assets/Browser_CopyLink.png'});
                break;
            case 'OpenLinkInNewTab':
                break;
            case 'OpenLink':
                items.push({'name': 'Open', 'function': contextmenu.openLink, 'imageUrl': 'assets/Browser_OpenLink.png'});
                break;
            case 'SaveLinkAs':
                items.push({'name': 'Save Link as', 'function': contextmenu.saveLink, 'imageUrl': 'assets/Browser_SaveLink.png'});
                break;
            case 'SaveImage':
                items.push({'name': 'Save Image', 'function': contextmenu.saveImage, 'imageUrl': 'assets/Browser_SaveImage.png'});
                break;
            case 'CopyImageLink':
                items.push({'name': 'Copy Image Link', 'function': contextmenu.responseHandler.bind(this, 'CopyImageLink'), 'imageUrl': 'assets/Browser_CopyImageLink.png'});
                break;
            case 'ViewImage':
                break;
            case 'Search':
                break;
            case 'ShareLink':
                // local and file protocol won't have sharelink menuitem
                if (!/^local|^file/.test(currentContext.url)) {
                    items.push({'name': 'Share Link', 'function': contextmenu.shareLink, 'imageUrl': 'assets/Browser_ShareLink.png'});
                }
                break;
            case 'ShareImage':
                break;
            case 'InspectElement':
                items.push({'name': 'Inspect Element', 'function': contextmenu.responseHandler.bind(this, 'InspectElement'), 'imageUrl': 'assets/generic_81_81_placeholder.png'});
                break;
            }
        }

        if (currentContext && currentContext.url && currentContext.text) {
            items.push({'headText': currentContext.text, 'subheadText': currentContext.url});
        }

        return items;
    },

    setCurrentContext: function (context) {
        currentContext = context;
    },

    generateInvocationList : function (request, errorMessage) {

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
    },

    shareLink : function () {

        if (!currentContext || !currentContext.url) {
            return;
        }

        var request = {
            action: 'bb.action.SHARE',
            type : 'text/plain',
            data : currentContext.url,
            action_type: window.qnx.webplatform.getApplication().invocation.ACTION_TYPE_ALL,
            target_type: window.qnx.webplatform.getApplication().invocation.TARGET_TYPE_APPLICATION
        };

        contextmenu.generateInvocationList(request, 'No link sharing applications installed');
    }

};

module.exports = contextmenu;
