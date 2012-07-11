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
    _overlayWebView = require('../../lib/overlayWebView'),
    _menuItems,
    _headText,
    _subheadText,
    _currentContext;

function init() {
    console.log('running init');
    _overlayWebView.onPropertyCurrentContextEvent = function (value) {
        _currentContext = JSON.parse(value);
    };
    _overlayWebView.onContextMenuRequestEvent = function (value) {
        var menu = JSON.parse(value),
        args = JSON.stringify({'menuItems': menu.menuItems, 
                              'currentContext': _currentContext});
        _overlayWebView.executeJavaScript("window.showMenu(" + args + ")");
        return '{"setPreventDefault":true}';
    };

}

function enabled(success, fail, args, env) {
        if (args) {
            var enabled = JSON.parse(decodeURIComponent(args["enabled"]));
            _webview.setContextMenuEnabled(enabled);

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

function setHeadText(text) {
    _headText = text;
}

function setSubheadText(text) {
    _subheadText = text;
}

function setCurrentContext(context) {
    _currentContext = context;
}

contextmenu = {
    init: init,
    setHeadText: setHeadText,
    setSubheadText: setSubheadText,
    setMenuOptions: setMenuOptions,
    peek: peekContextMenu
};

// Listen for the init event
qnx.webplatform.getController().addEventListener('ui.init', function () {
    init();
});

module.exports = contextmenu;
