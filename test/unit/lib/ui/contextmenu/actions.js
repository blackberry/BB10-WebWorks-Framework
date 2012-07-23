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
var _apiDir = __dirname + "./../../../../../ext/ui.contextmenu",
    _libDir = __dirname + "./../../../../../lib/",
    libEvent = require(_libDir + 'event'),
    config = require(_libDir + './config.js'),
    webview = require(_libDir + 'webview'),
    invocation,
    actions,
    success,
    dialog,
    mockedWebWorks = {
        execAsync: jasmine.createSpy(),
        event: { once : jasmine.createSpy(),
                 isOn : jasmine.createSpy() }
    },
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
        GLOBAL.window.webworks = mockedWebWorks;
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
        actions = require(_libDir + '/ui/contextmenu/actions');
        dialog = require(_libDir + './ui/dialog/index');
        invocation = window.qnx.webplatform.getApplication().invocation;
        actions.clearCustomHandlers();
        spyOn(webview, "handleContextMenuResponse");
    });


    it("Cause the Copy function to get called properly", function () {
        actions.handlers.Copy('Copy');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('Copy');
    });

    it("Cause the ClearField function to get called properly", function () {
        actions.handlers.ClearField('ClearField');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('ClearField');
    });

    it("Cause the Paste function to get called properly", function () {
        actions.handlers.Paste('Paste');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('Paste');
    });

    it("Cause the Cut function to get called properly", function () {
        actions.handlers.Cut('Cut');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('Cut');
    });

    it("Cause the Select function to get called properly", function () {
        actions.handlers.Select('Select');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('Select');
    });

    it("Cause the CopyLink function to get called properly", function () {
        actions.handlers.CopyLink('CopyLink');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('CopyLink');
    });

    it("Cause the CopyImageLink function to get called properly", function () {
        actions.handlers.CopyImageLink('CopyImageLink');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('CopyImageLink');
    });

    it("Cause the OpenLink function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        spyOn(webview, "setURL");
        actions.setCurrentContext(currentContext);
        actions.handlers.OpenLink('OpenLink');
        expect(webview.setURL).toHaveBeenCalledWith('testUrl');
    });

    it("Cause the SaveLinkAs function to get called properly", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc'
        };
        spyOn(webview, "downloadURL");
        actions.setCurrentContext(currentContext);
        actions.handlers.SaveLinkAs('SaveLink');
        expect(webview.downloadURL).toHaveBeenCalledWith('testUrl');
    });


    it("Cause the InspectElement function to get called properly", function () {
        actions.handlers.InspectElement('InspectElement');
        expect(webview.handleContextMenuResponse).toHaveBeenCalledWith('InspectElement');
    });


    it("has a SaveImage function", function () {
        expect(actions.handlers.SaveImage).toBeDefined();
    });

    it("Causes the saveImage function to return", function () {
        var currentContext = {};
        actions.setCurrentContext(currentContext);
        actions.handlers.SaveImage('SaveImage');
        expect(webview.handleContextMenuResponse).not.toHaveBeenCalled();
    });

    it("Cause the SaveImage to not be called, since access_shared is undefined", function () {
        var currentContext = {
            url : 'testUrl',
            src : 'testSrc',
            isImage : true
        };

        spyOn(dialog, 'show');
        actions.setCurrentContext(currentContext);
        actions.handlers.SaveImage('SaveImage');
        expect(webview.handleContextMenuResponse).not.toHaveBeenCalled();
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

