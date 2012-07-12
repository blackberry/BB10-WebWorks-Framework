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
    invocation,
    config = require(srcPath + './lib/config.js');

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
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.notifyContextMenuCancelled', 2);
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

    it("Cause the Copy function to get called properly", function () {
        contextmenu.responseHandler('Copy');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['Copy']);
    });

    it("Cause the Clear function to get called properly", function () {
        contextmenu.responseHandler('Clear');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['Clear']);
    });

    it("Cause the Paste function to get called properly", function () {
        contextmenu.responseHandler('Paste');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['Paste']);
    });

    it("Cause the Cut function to get called properly", function () {
        contextmenu.responseHandler('Cut');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['Cut']);
    });

    it("Cause the Select function to get called properly", function () {
        contextmenu.responseHandler('Select');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['Select']);
    });

    it("Cause the CopyLink function to get called properly", function () {
        contextmenu.responseHandler('CopyLink');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['CopyLink']);
    });

    it("Cause the CopyImageLink function to get called properly", function () {
        contextmenu.responseHandler('CopyImageLink');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['CopyImageLink']);
    });

    it("Cause the OpenLink function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        contextmenu.setCurrentContext(currentContext);
        contextmenu.openLink();
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.loadURL', ['testUrl']);
    });

    it("Cause the SaveLinkAs function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        contextmenu.setCurrentContext(currentContext);
        contextmenu.saveLink();
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.downloadURL', ['testUrl', '']);
    });


    it("Cause the InspectElement function to get called properly", function () {
        contextmenu.responseHandler('InspectElement');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.handleContextMenuResponse', ['InspectElement']);
    });

    it("has a generateInvocationList function", function () {
        expect(contextmenu.generateInvocationList).toBeDefined();
    });

    it("Cause the generationInvocationList function to get called properly", function () {
        var id = 1,
            invokeFunction = "invocation.queryTargets",
            currentContext = {
                src : 'file://'
            },

            request = {
                action: 'bb.action.SHARE',
                uri : currentContext.src,
                target_type: invocation.TARGET_TYPE_ALL,
                action_type: invocation.ACTION_TYPE_MENU,
                type : 'text/plain'
            };

        contextmenu.setCurrentContext(currentContext);
        contextmenu.generateInvocationList(request, 'No link sharing applications installed');
        expect(mockedController.remoteExec).toHaveBeenCalledWith(id, invokeFunction, jasmine.any(Object), jasmine.any(Function));
    });

    it("has a SaveImage function", function () {
        expect(contextmenu.saveImage).toBeDefined();
    });

    it("Causes the saveImage function to return", function () {
        var currentContext = {};
        contextmenu.setCurrentContext(currentContext);
        contextmenu.saveImage();
        expect(mockedController.remoteExec).not.toHaveBeenCalled();
    });

    it("Cause the SaveImage to not be called, since access_shared is undefined", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc',
            isImage : true
        };

        contextmenu.setCurrentContext(currentContext);
        contextmenu.saveImage();
        expect(mockedController.remoteExec).not.toHaveBeenCalled();
    });

    it("Cause the SaveImage function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc',
            isImage : true
        };

        // Set the access_shared permissions in a mocked way ;) //
        spyOn(config, "permissions").andReturn(['access_shared']);
        config.permissions.indexOf = function () {
                                                    return 1;
                                                };

        contextmenu.setCurrentContext(currentContext);
        contextmenu.saveImage();
        expect(mockedController.remoteExec).toHaveBeenCalledWith(1, 'webview.downloadSharedFile', ['testSrc', 'photos'], jasmine.any(Function));
    });

    it("has a ShareLink function", function () {
        expect(contextmenu.shareLink).toBeDefined();
    });

    it("Cause the ShareLink function to return undefine", function () {
        var currentContext = {};
        contextmenu.setCurrentContext(currentContext);
        contextmenu.shareLink();
        contextmenu.generateInvocationList = jasmine.createSpy();
        expect(contextmenu.generateInvocationList).not.toHaveBeenCalled();
    });

    it("Cause the ShareLink function to get called properly", function () {
        var currentContext = {
            text : true,
            url : 'file://'
        };

        contextmenu.setCurrentContext(currentContext);
        contextmenu.shareLink();
        expect(contextmenu.generateInvocationList).toHaveBeenCalledWith(jasmine.any(Object), 'No link sharing applications installed');
    });

    it("has a generateContextMenuItems function", function () {
        expect(contextmenu.generateContextMenuItems).toBeDefined();
    });

    it("Cause the generateContextMenuItems function to return Clear Field", function () {
        var items = ['ClearField'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Clear Field', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return empty array for SendLink", function () {
        var items = ['SendLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to return empty array for SendImageLink", function () {
        var items = ['SendImageLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to empty array for FullMenu", function () {
        var items = ['FullMenu'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to empty array for Delete", function () {
        var items = ['Delete'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to return Cancel", function () {
        var items = ['Cancel'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Cancel', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Cut", function () {
        var items = ['Cut'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Cut', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Copy", function () {
        var items = ['Copy'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Copy', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Paste", function () {
        var items = ['Paste'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Paste', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Select", function () {
        var items = ['Select'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Select', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to empty array for AddLinkToBookmarks", function () {
        var items = ['AddLinkToBookmarks'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to return Copy Link", function () {
        var items = ['CopyLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Copy Link', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to empty array for OpenLinkInNewTab", function () {
        var items = ['OpenLinkInNewTab'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to return Open Link", function () {
        var items = ['OpenLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Open', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Save Link as", function () {
        var items = ['SaveLinkAs'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Save Link as', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Save Image", function () {
        var items = ['SaveImage'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Save Image', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to return Copy Image Link", function () {
        var items = ['CopyImageLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Copy Image Link', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function to empty array for Search", function () {
        var items = ['Search'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function to return InspectElement", function () {
        var items = ['InspectElement'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Inspect Element', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function return ShareLink menuitem when the protocol is not file or local", function () {
        var items = ['ShareLink'],
            currentContext = {
                url : 'http://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual(
            [{'name': 'Share Link', 'function': jasmine.any(Function), 'imageUrl': jasmine.any(String)}]);
    });

    it("Cause the generateContextMenuItems function not return Share Image menuitem", function () {
        var items = ['ShareImage'],
            currentContext = {
                url : 'file://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function not return ShareLink menuitem when the protocol is file://", function () {
        var items = ['ShareLink'],
            currentContext = {
                url : 'file://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });

    it("Cause the generateContextMenuItems function not return ShareLink menuitem when the protocol is local://", function () {
        var items = ['ShareLink'],
            currentContext = {
                url : 'local://www.rim.com'
            };
        contextmenu.setCurrentContext(currentContext);
        expect(contextmenu.generateContextMenuItems(items)).toEqual([]);
    });
});
