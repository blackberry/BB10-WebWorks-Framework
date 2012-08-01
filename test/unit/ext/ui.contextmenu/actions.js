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
var _apiDir = __dirname + "./../../../../ext/ui.contextmenu",
    _libDir = __dirname + "./../../../../lib/",
    libEvent = require(_libDir + 'event'),
    config = require(_libDir + './config.js'),
    webview = require(_libDir + 'webview'),
    invocation,
    actions,
    success,
    mockedController = {
        remoteExec: jasmine.createSpy(),
        addEventListener : jasmine.createSpy()
    },
    mockedApplication = {
        invocation : {
            TARGET_TYPE_ALL : '',
            ACTION_TYPE_MENU : '',
            queryTargets : jasmine.createSpy()
        },
        getEnv : jasmine.createSpy()
    },
    mockedWebPlatform = {
        getController : function () {
            return mockedController;
        },
        getApplication : function () {
            return mockedApplication;
        }
    };

describe("blackberry.ui.actions.handlers index", function () {
    beforeEach(function () {
        GLOBAL.window.qnx.webplatform = mockedWebPlatform;
        GLOBAL.qnx = {
            callExtensionMethod: jasmine.createSpy("bond"),
            webplatform : {
                getController : function () {
                    return mockedController;
                },
                getApplication : function () {
                    return mockedApplication;
                }
            }
        };
        GLOBAL.alert = jasmine.createSpy();
        GLOBAL.XMLHttpRequest = function () {
            return {
                open            : jasmine.createSpy(),
                responseType    : jasmine.createSpy(),
                onload          : jasmine.createSpy(),
                send            : jasmine.createSpy()
            };
        };
        GLOBAL.downloadSharedFile = jasmine.createSpy();
        actions = require(_apiDir + '/actions');
        invocation = window.qnx.webplatform.getApplication().invocation;
        actions.clearCustomHandlers();
    });


    it("Cause the Copy function to get called properly", function () {
        actions.handlers.Copy('Copy');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'Copy');
    });

    it("Cause the ClearField function to get called properly", function () {
        actions.handlers.ClearField('ClearField');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'ClearField');
    });

    it("Cause the Paste function to get called properly", function () {
        actions.handlers.Paste('Paste');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'Paste');
    });

    it("Cause the Cut function to get called properly", function () {
        actions.handlers.Cut('Cut');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'Cut');
    });

    it("Cause the Select function to get called properly", function () {
        actions.handlers.Select('Select');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'Select');
    });

    it("Cause the CopyLink function to get called properly", function () {
        actions.handlers.CopyLink('CopyLink');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'CopyLink');
    });

    it("Cause the CopyImageLink function to get called properly", function () {
        actions.handlers.CopyImageLink('CopyImageLink');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'CopyImageLink');
    });

    it("Cause the OpenLink function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        actions.setCurrentContext(currentContext);
        actions.handlers.OpenLink('OpenLink');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.loadURL', 2, 'testUrl');
    });

    it("Cause the SaveLinkAs function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        actions.setCurrentContext(currentContext);
        actions.handlers.SaveLinkAs('SaveLink');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.downloadURL', 2, 'testUrl');
    });


    it("Cause the InspectElement function to get called properly", function () {
        actions.handlers.InspectElement('InspectElement');
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.handleContextMenuResponse', 2, 'InspectElement');
    });


    it("has a SaveImage function", function () {
        expect(actions.handlers.SaveImage).toBeDefined();
    });

    it("Causes the saveImage function to return", function () {
        var currentContext = {};
        actions.setCurrentContext(currentContext);
        actions.handlers.SaveImage('SaveImage');
        expect(qnx.callExtensionMethod).not.toHaveBeenCalled();
    });

    it("Cause the SaveImage to not be called, since access_shared is undefined", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc',
            isImage : true
        };

        actions.setCurrentContext(currentContext);
        actions.handlers.SaveImage('SaveImage');
        expect(qnx.callExtensionMethod).not.toHaveBeenCalled();
    });

    it("has a ShareLink function", function () {
        expect(actions.handlers.ShareLink).toBeDefined();
    });
    
    it("can add and execute custom menu items", function () {
        var actionId = 'awesomeCity';
        spyOn(libEvent, 'trigger');
        expect(actions.addCustomItem(actionId)).toEqual(true);
        actions.runHandler(actionId);
        expect(libEvent.trigger).toHaveBeenCalledWith('contextmenu.executeMenuAction', actionId);
    });
    
    it("cannot add duplicate custom menu items", function () {
        var actionId = 'awesomeCity';
        expect(actions.addCustomItem(actionId)).toEqual(true);
        expect(actions.addCustomItem(actionId)).toEqual(false);
    });
    
    it("can remove a custom menu item", function () {
        var actionId = 'awesomeCity';
        spyOn(libEvent, 'trigger');
        expect(actions.addCustomItem(actionId)).toEqual(true);
        actions.removeCustomItem(actionId);
        actions.runHandler(actionId);
        expect(libEvent.trigger).not.toHaveBeenCalled();
    });

});

