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

function handleTouchEnd(actionId, menuItem) {
    if (menuItem) {
        menuItem.className = 'menuItem peekItem';
    }
    window.qnx.webplatform.getController().remoteExec(1, 'executeMenuAction', [actionId]);
}

function handleTouchStart(menuItem) {
    if (!menuItem || !menuPeeked) {
        return;
    }
    menuItem.className = 'menuItem showItem';
}

contextmenu = {
    init: init,
    setMenuOptions: function (options) {
        var menu = document.getElementById("contextMenuContent"),
            i,
            header,
            menuItem,
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
            menuImage = document.createElement('img');
            menuImage.src = options[i].imageUrl ? options[i].imageUrl : 'assets/generic_81_81_placeholder.png';
            menuItem.appendChild(menuImage);
            menuItem.appendChild(document.createTextNode(options[i].label));
            menuItem.setAttribute("class", "menuItem");
            menuItem.ontouchstart = handleTouchStart.bind(this, menuItem);
            menuItem.ontouchend = handleTouchEnd.bind(this, options[i].actionId, menuItem);
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

    setCurrentContext: function (context) {
        currentContext = context;
    }
};

module.exports = contextmenu;
