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

describe("ui-resources/contextmenu", function () {

    var srcPath = '../../../../../',
    contextmenu = require(srcPath + 'ui-resources/plugins/contextmenu/index'),
    menu,
    menuHandle,
    menuContent,
    headText,
    subheadText,
    header,
    mockedController,
    mockedApplication,
    invocation;

    beforeEach(function () {
        invocation = {
                TARGET_TYPE_ALL : '',
                ACTION_TYPE_MENU : ''
            };
        mockedController = {
            remoteExec: jasmine.createSpy()
        };
        mockedApplication = {
            invocation : {
                TARGET_TYPE_ALL : '',
                ACTION_TYPE_MENU : ''
            }
        };

        GLOBAL.alert = jasmine.createSpy();
        GLOBAL.window = {
            qnx : {
                webplatform : {
                    getController : function () {
                        return mockedController;
                    },
                    getApplication : function () {
                        return mockedApplication;
                    }
                }
            }
        };
        GLOBAL.document = {
            createTextNode: jasmine.createSpy(),
            createElement: jasmine.createSpy().andReturn({
                appendChild: jasmine.createSpy(),
                setAttribute: jasmine.createSpy(),
                addEventListener: jasmine.createSpy()
            }),
            getElementById: function (id) {
                var returnElement;
                if (id === "contextMenu") {
                    menu = {
                        addEventListener: jasmine.createSpy(),
                        removeEventListener: jasmine.createSpy(),
                        showContextmenu: jasmine.createSpy(),
                        appendChild: jasmine.createSpy(),
                        className: undefined
                    };
                    returnElement = menu;
                } else if (id === "contextMenuHandle") {
                    menuHandle = {
                        addEventListener: jasmine.createSpy(),
                        removeEventListener: jasmine.createSpy()
                    };
                    returnElement = menuHandle;
                } else if (id === "contextMenuHeadText") {
                    headText = { innerText: undefined };
                    returnElement = headText;
                } else if (id === "contextMenuSubheadText") {
                    subheadText = { innerText: undefined };
                    returnElement = subheadText;
                } else if (id === "contextMenuHeader") {
                    header = { className: undefined };
                    returnElement = header;
                } else if (id === "contextMenuContent") {
                    menuContent = {
                        childNodes: [],
                        appendChild: jasmine.createSpy()
                    };
                    returnElement = menuContent;
                }
                return returnElement;
            }
        };
        GLOBAL.qnx = {
            callExtensionMethod: jasmine.createSpy("bond"),
            webplatform : {
                getController : function () {
                    return mockedController;
                }
            }
        };
    });

    afterEach(function () {
        contextmenu.hideContextMenu();
    });

    it("has an init function", function () {
        expect(contextmenu.init).toBeDefined();
    });

    it("has an init function that sets an event listener", function () {
        contextmenu.init();
        expect(menu.addEventListener).toHaveBeenCalledWith("webkitTransitionEnd", jasmine.any(Function));
    });

    it("has a handleMouseDown function", function () {
        expect(contextmenu.handleMouseDown).toBeDefined();
    });

    it("has a handleMouseDown function that accepts an event", function () {
        var spyFunction = jasmine.createSpy(),
            evt = { preventDefault : spyFunction };
        contextmenu.handleMouseDown(evt);
        expect(evt.preventDefault).toHaveBeenCalled();
    });

    it("has a showContextMenu function", function () {
        expect(contextmenu.showContextMenu).toBeDefined();
    });

    it("allows showContextMenu to set menuVisible to true", function () {
        var evt = {
            cancelBubble : false
        };
        contextmenu.showContextMenu(evt);
        expect(contextmenu.isMenuVisible()).toEqual(true);
    });

    it("allows showContextMenu to set peeked mode to false when already peeked", function () {
        var evt = {
            cancelBubble : false
        };
        contextmenu.hideContextMenu();
        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu(evt);
        expect(evt.cancelBubble).toEqual(true);
        expect(contextmenu.isMenuVisible()).toEqual(true);
    });


    it("can set the header text of the context menu", function () {
        var text = "So Awesome Header";
        contextmenu.setHeadText(text);
        expect(headText.innerText).toEqual(text);
    });

    it("can set the subheader text of the context menu", function () {
        var text = "So Awesome Subheader";
        contextmenu.setSubheadText(text);
        expect(subheadText.innerText).toEqual(text);
    });

    it("can hide the context menu", function () {
        contextmenu.showContextMenu();
        contextmenu.hideContextMenu();
        expect(menu.removeEventListener).toHaveBeenCalledWith('touchend', contextmenu.hideContextMenu, false);
        expect(menuHandle.removeEventListener).toHaveBeenCalledWith('touchend', contextmenu.showContextMenu, false);
        expect(contextmenu.isMenuVisible()).toEqual(false);
        expect(menu.className).toEqual('hideMenu');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.setSensitivity', ['SensitivityTest']);
    });

    it("can set transitionEnd logic when the context menu is hidden", function () {
        spyOn(contextmenu, 'setHeadText');
        spyOn(contextmenu, 'setSubheadText');
        contextmenu.transitionEnd();
        expect(header.className).toEqual('');
        expect(contextmenu.setHeadText).toHaveBeenCalledWith('');
        expect(contextmenu.setSubheadText).toHaveBeenCalledWith('');
    });

    it("can set transitionEnd logic when the context menu is peeked", function () {
        contextmenu.peekContextMenu(true);
        contextmenu.transitionEnd();
        expect(menu.addEventListener).toHaveBeenCalledWith('touchend', contextmenu.hideContextMenu, false);
        expect(menuHandle.addEventListener).toHaveBeenCalledWith('touchend', contextmenu.showContextMenu, false);
    });

    it("can peek the context menu", function () {
        contextmenu.peekContextMenu(true);
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.setSensitivity', ['SensitivityNoFocus']);
        expect(menuHandle.className).toEqual('showContextMenuHandle');
        expect(contextmenu.isMenuVisible()).toEqual(true);
        expect(menu.className).toEqual('peekContextMenu');
    });

    it("can set the context menu items", function () {
        var itemA = {
                function: jasmine.createSpy(),
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            },
            options = [itemA];
        contextmenu.setMenuOptions(options);
        expect(menuContent.appendChild).toHaveBeenCalledWith(jasmine.any(Object));
    });

});
