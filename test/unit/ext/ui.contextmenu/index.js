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
    index,
    success,
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
            ACTION_TYPE_MENU : ''
        }
    },
    mockedWebPlatform = {
        getController : function () {
            return mockedController;
        },
        getApplication : function () {
            return mockedApplication;
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
                }
            }
        };

        index = require(_apiDir + "/index");
        success = jasmine.createSpy("success");
    });


    it("enabled is called with false on the webview.setContextMenuEnabled method", function () {
        index.enabled(success, null, {
            "enabled": encodeURIComponent(JSON.stringify(false))
        }, null);

        expect(success).toHaveBeenCalledWith('ContextMenuEnabled has been set to ' + false);
    });

    it("enabled is called with true on the webview.setContextMenuEnabled", function () {
        index.enabled(success, null, {
            "enabled": encodeURIComponent(JSON.stringify(true))
        }, null);

        expect(success).toHaveBeenCalledWith('ContextMenuEnabled has been set to ' + true);
    });




});

