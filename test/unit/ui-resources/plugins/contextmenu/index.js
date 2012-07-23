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
    menuDelete,
    numberOfMenuItems = 5,
    headText,
    subheadText,
    header,
    mockedController,
    mockedApplication,
    elements,
    elementsLength,
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

        elements = {
                length : 5
            };
        elementsLength = 5;

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
            },

            screen : {
                avalHeight : "1280"
            },

            document: GLOBAL.document,

            addEventListener: jasmine.createSpy()
        };
        GLOBAL.document = {
            staticElements: {},

            createTextNode: jasmine.createSpy(),
            createElement: jasmine.createSpy().andReturn({
                appendChild: jasmine.createSpy(),
                setAttribute: jasmine.createSpy(),
                addEventListener: jasmine.createSpy(),
                style: {}
            }),
            body: {
                addEventListener: jasmine.createSpy(),
                removeEventListener: jasmine.createSpy()
            },

            getElementsByClassName: function (id) {
                var returnElements = [],
                    i;
                if (id === "menuItem") {
                    for (i = 0; i < numberOfMenuItems; i++) {
                        returnElements[i] = {
                            ontouchmove : jasmine.any(Function),
                            className : "menuItem",
                            clientHeight : 108
                        };
                    }
                }
                return returnElements;
            },

            getElementById: function (id) {
                var returnElement;

                // Used if we want to use a mock object in our test and want to reference its changes from
                // the context menu later
                if (GLOBAL.document.staticElements[id]) {
                    return GLOBAL.document.staticElements[id];
                }

                if (id === "contextMenu") {
                    menu = {
                        addEventListener: jasmine.createSpy(),
                        removeEventListener: jasmine.createSpy(),
                        showContextmenu: jasmine.createSpy(),
                        appendChild: jasmine.createSpy(),
                        className: undefined,
                        style: {overflowY: '', height: ''}
                    };
                    returnElement = menu;
                } else if (id === 'contextMenuDelete') {
                    menuDelete = {
                        firstChild: jasmine.createSpy(),
                        removeChild: jasmine.createSpy(),
                        style: {}
                    };
                    returnElement = menuDelete;
                } else if (id === "contextMenuHandle") {
                    menuHandle = {
                        addEventListener: jasmine.createSpy(),
                        removeEventListener: jasmine.createSpy(),
                        className: '',
                        style: {},
                        removeChild: jasmine.createSpy()
                    };
                    returnElement = menuHandle;
                } else if (id === "contextMenuHeadText") {
                    headText = { innerText: undefined, style: {} };
                    returnElement = headText;
                } else if (id === "contextMenuSubheadText") {
                    subheadText = { innerText: undefined, style: {}};
                    returnElement = subheadText;
                } else if (id === "contextMenuHeader") {
                    header = { className: undefined };
                    returnElement = header;
                } else if (id === "contextMenuContent") {
                    menuContent = {
                        childNodes: [],
                        appendChild: jasmine.createSpy(),
                        style: {overflowY: '', height: ''},
                        className: '',
                        removeChild: jasmine.createSpy()
                    };
                    returnElement = menuContent;
                } else if (id === "moreHandleIcon") {
                    returnElement = null;
                } else if (id === "contextMenuModal") {
                    returnElement = {
                        style: {}
                    };
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

        // Clear static elements
        GLOBAL.document.staticElements = {};
    });

    it("has an init function", function () {
        expect(contextmenu.init).toBeDefined();
    });

    it("has an init function that sets an event listener", function () {
        contextmenu.init();
        expect(menu.addEventListener).toHaveBeenCalledWith("webkitTransitionEnd", jasmine.any(Function));
    });

    it("has a mouseDownHandler function", function () {
        expect(contextmenu.mouseDownHandler).toBeDefined();
    });

    it("has a mouseDownHandler function that accepts an event", function () {
        var evt = {
            preventDefault : jasmine.createSpy(),
            stopPropagation: jasmine.createSpy()
        };

        contextmenu.mouseDownHandler(evt);
        expect(evt.preventDefault).toHaveBeenCalled();
        expect(evt.stopPropagation).toHaveBeenCalled();
    });

    it("has a showContextMenu function", function () {
        expect(contextmenu.showContextMenu).toBeDefined();
    });

    it("allows showContextMenu to set menuVisible to true", function () {
        var evt = {
            cancelBubble : false,
            preventDefault: jasmine.createSpy(),
            stopPropagation: jasmine.createSpy()
        };
        contextmenu.hideContextMenu();
        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu(evt);
        expect(contextmenu.isMenuVisible()).toEqual(true);
    });

    it("allows showContextMenu to set peeked mode to false when already peeked", function () {
        var evt = {
            preventDefault: jasmine.createSpy(),
            stopPropagation: jasmine.createSpy()
        };
        contextmenu.hideContextMenu();
        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu(evt);
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
        expect(contextmenu.isMenuVisible()).toEqual(false);
        expect(menu.className).toEqual('hideMenu');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.setSensitivity', ['SensitivityTest']);
    });

    it("can set transitionEnd logic when the context menu is hidden", function () {
        spyOn(contextmenu, 'setHeadText');
        spyOn(contextmenu, 'setSubheadText');
        contextmenu.hideContextMenu();
        contextmenu.transitionEnd();
        expect(contextmenu.setHeadText).toHaveBeenCalledWith('');
        expect(contextmenu.setSubheadText).toHaveBeenCalledWith('');
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
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            },
            options = [itemA];
        contextmenu.setMenuOptions(options);
        expect(menuContent.appendChild).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it("can set the classname of contextMenuHandle to showContextMenuHandle when less than 7 menu items", function () {
        numberOfMenuItems = 4;
        contextmenu.peekContextMenu(true);
        expect(menuHandle.className).toEqual('showContextMenuHandle');
    });

    it("can layout the header title correctly when there is no sub header text", function () {
        // Override the getElementById to refer to the same object so we can spy on the context menu's changes
        // to the headers
        document.staticElements.contextMenuHeadText = { innerText: undefined, style: {}};
        document.staticElements.contextMenuSubheadText = { innerText: undefined, style: {}};

        contextmenu.setMenuOptions([
            {
                headText: 'head text'
            }
        ]);
        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu();

        expect(document.staticElements.contextMenuHeadText.style.height).toEqual('105px');
        expect(document.staticElements.contextMenuHeadText.style.lineHeight).toEqual('105px');
    });

    it("can layout the sub header text when there is no header text", function () {
        document.staticElements.contextMenuHeadText = { innerText: undefined, style: {}};
        document.staticElements.contextMenuSubheadText = { innerText: undefined, style: {}};

        contextmenu.setMenuOptions([
            {
                headText: '',
                subheadText: 'sub head text'
            }
        ]);
        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu();

        expect(document.staticElements.contextMenuSubheadText.style.height).toEqual('105px');
        expect(document.staticElements.contextMenuSubheadText.style.lineHeight).toEqual('105px');
    });

    it("can animate the header down when it exists", function () {
        document.staticElements.contextMenuHeader = { className: 'undefined' };
        contextmenu.setMenuOptions([
            {
                headText: 'head text',
                subheadText: 'sub head text'
            }
        ]);

        contextmenu.peekContextMenu(true);
        contextmenu.showContextMenu();

        expect(document.staticElements.contextMenuHeader.className).toEqual('showMenuHeader');
    });

    it("will show the more handle icon when there are > max num of items while in peeked landscape mode", function () {
        var items = [],
            i;

        for (i = 0; i < 4; i += 1) {
            items.push({
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            });
        }

        document.staticElements.contextMenuHandle = {
            addEventListener: jasmine.createSpy(),
            removeEventListener: jasmine.createSpy(),
            className: '',
            style: {},
            removeChild: jasmine.createSpy(),
            appendChild: jasmine.createSpy()
        };

        window.orientation = 90;
        contextmenu.init();
        contextmenu.setMenuOptions(items);
        contextmenu.peekContextMenu(true);

        expect(document.staticElements.contextMenuHandle.appendChild).toHaveBeenCalled();
    });

    it("will not show the more handle icon when there are < max num of items while in peeked landscape mode", function () {
        var items = [],
            i;

        for (i = 0; i < 3; i += 1) {
            items.push({
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            });
        }

        document.staticElements.contextMenuHandle = {
            addEventListener: jasmine.createSpy(),
            removeEventListener: jasmine.createSpy(),
            className: '',
            style: {},
            removeChild: jasmine.createSpy(),
            appendChild: jasmine.createSpy()
        };

        window.orientation = 90;
        contextmenu.init();
        contextmenu.setMenuOptions(items);
        contextmenu.peekContextMenu(true);

        expect(document.staticElements.contextMenuHandle.appendChild).not.toHaveBeenCalled();
    });

    it("will show the more handle icon when there are > max num of items while in peeked portrait mode", function () {
        var items = [],
            i;

        for (i = 0; i < 8; i += 1) {
            items.push({
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            });
        }

        document.staticElements.contextMenuHandle = {
            addEventListener: jasmine.createSpy(),
            removeEventListener: jasmine.createSpy(),
            className: '',
            style: {},
            removeChild: jasmine.createSpy(),
            appendChild: jasmine.createSpy()
        };

        window.orientation = 0;
        contextmenu.init();
        contextmenu.setMenuOptions(items);
        contextmenu.peekContextMenu(true);

        expect(document.staticElements.contextMenuHandle.appendChild).toHaveBeenCalled();
    });

    it("will not show the more handle icon when there are < max num of items while in peeked portrait mode", function () {
        var items = [],
            i;

        for (i = 0; i < 4; i += 1) {
            items.push({
                imageUrl: 'http://image.com/a.png',
                name: 'OptionA'
            });
        }

        document.staticElements.contextMenuHandle = {
            addEventListener: jasmine.createSpy(),
            removeEventListener: jasmine.createSpy(),
            className: '',
            style: {},
            removeChild: jasmine.createSpy(),
            appendChild: jasmine.createSpy()
        };

        window.orientation = 0;
        contextmenu.init();
        contextmenu.setMenuOptions(items);
        contextmenu.peekContextMenu(true);

        expect(document.staticElements.contextMenuHandle.appendChild).not.toHaveBeenCalled();
    });
});
