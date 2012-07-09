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
var _apiDir = __dirname + "./../../../../ext/ui.contextmenu/",
    _libDir = __dirname + "./../../../../lib/",
    webview = require(_libDir + 'webview'),
    overlayWebView = require(_libDir + 'overlayWebView'),
    controller = require(_libDir + 'controllerWebView'),
    contextmenu,
    success,
    mockedWebWorks = {
        execAsync: jasmine.createSpy(),
        event: { once : jasmine.createSpy(),
                 isOn : jasmine.createSpy() }
    },
    mockedController = {
        remoteExec: jasmine.createSpy(),
        addEventListener : jasmine.createSpy().andCallFake(function (eventId, callback) {
            callback();
        }),
        publishRemoteFunction: jasmine.createSpy()
    },
    mockedApplication = {
        invocation : {
            TARGET_TYPE_ALL : '',
            ACTION_TYPE_MENU : ''
        }
    },
    mockedWebPlatform = {
        getController : function () {
            return mockedController;
        },
        getApplication : function () {
            return mockedApplication;
        },
        createWebView: function () {
            return {};
        }
    };

describe("blackberry.ui.contextmenu index", function () {
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
                },
                createWebView: function () {
                    return {};
                }
            }
        };
        overlayWebView.create();
        spyOn(webview, 'addEventListener').andCallFake(function (eventId, callback) {
            callback();
        });
        contextmenu = require(_apiDir + "/index");
        success = jasmine.createSpy("success");
    });

    it("adds a DocumentLoaded listener to the client webview", function () {
        expect(webview.addEventListener).toHaveBeenCalledWith('DocumentLoaded', jasmine.any(Function));
    });

    it("enabled is called with false on the webview.setContextMenuEnabled method", function () {
        contextmenu.enabled(success, null, {
            "enabled": encodeURIComponent(JSON.stringify(false))
        }, null);

        expect(success).toHaveBeenCalledWith('ContextMenuEnabled has been set to ' + false);
    });

    it("enabled is called with true on the webview.setContextMenuEnabled", function () {
        contextmenu.enabled(success, null, {
            "enabled": encodeURIComponent(JSON.stringify(true))
        }, null);

        expect(success).toHaveBeenCalledWith('ContextMenuEnabled has been set to ' + true);
    });

    it("can add a custom menu item", function () {
        contextmenu.addItem(success, null, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({actionId: 'explosion'}))
        }, null);

        expect(success).toHaveBeenCalled();
    });
    
    it("cannot add custom items without an actionId", function () {
        var fail = jasmine.createSpy();
        contextmenu.addItem(null, fail, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({}))
        }, null);

        expect(fail).toHaveBeenCalled();
    });
    
    it("cannot add custom items with actionId as an empty string", function () {
        var fail = jasmine.createSpy();
        contextmenu.addItem(null, fail, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({actionId: ''}))
        }, null);

        expect(fail).toHaveBeenCalled();
    });
    
    it("cannot add multiple custom menu items with the same actionId", function () {
        var fail = jasmine.createSpy();
        contextmenu.addItem(success, null, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({actionId: 'Copy'}))
        }, null);

        contextmenu.addItem(success, fail, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({actionId: 'Copy'}))
        }, null);

        expect(fail).toHaveBeenCalled();
    });

    it("can remove a custom menu item", function () {
        var dummy = jasmine.createSpy();
        contextmenu.addItem(dummy, dummy, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "action": encodeURIComponent(JSON.stringify({actionId: 'explosion'}))
        }, null);
        contextmenu.removeItem(success, null, {
            "contexts": encodeURIComponent(JSON.stringify(['ALL'])),
            "actionId": encodeURIComponent(JSON.stringify('explosion'))
        }, null);

        expect(success).toHaveBeenCalled();
    });

});

