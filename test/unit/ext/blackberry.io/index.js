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
var _apiDir = __dirname + "./../../../../ext/blackberry.io/",
    _libDir = __dirname + "./../../../../lib/",
    index = require(_apiDir + "/index"),
    utils = require(_libDir + "/utils"),
    mockedWebview = {
        setSandbox: jasmine.createSpy("setSandbox"),
        getSandbox: jasmine.createSpy("getSandbox").andReturn("0")
    },
    mockedApplication = {
        getEnv: jasmine.createSpy("getEnv").andReturn("/home")
    };

describe("blackberry.io index", function () {
    beforeEach(function () {
        GLOBAL.qnx = {
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                }
            }
        };
        GLOBAL.window = {
            qnx: qnx
        };
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("sandbox", function () {
        beforeEach(function () {
            spyOn(utils, "requireWebview").andReturn(mockedWebview);
        });

        it("sandbox called with args will set webview sandbox", function () {
            var success = jasmine.createSpy("success");
            index.sandbox(success, null, {
                "sandbox": encodeURIComponent(JSON.stringify(false))
            }, null);
            expect(mockedWebview.setSandbox).toHaveBeenCalledWith(false);
            expect(success).toHaveBeenCalled();
        });

        it("sandbox called without args will get webview sandbox", function () {
            var success = jasmine.createSpy("success");
            index.sandbox(success, null, null, null);
            expect(mockedWebview.getSandbox).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(false);
        });
    });

    it("home calls getEnv('HOME')", function () {
        var success = jasmine.createSpy();
        index.home(success);
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(success).toHaveBeenCalledWith("/home");
    });

    it("sharedFolder calls getEnv('HOME')", function () {
        var success = jasmine.createSpy();
        index.sharedFolder(success);
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(success).toHaveBeenCalledWith("/home/../shared");
    });

    it("SDCard calls getEnv('HOME')", function () {
        var success = jasmine.createSpy();
        index.SDCard(success);
        expect(mockedApplication.getEnv).toHaveBeenCalledWith("HOME");
        expect(success).toHaveBeenCalledWith("/home/../../../removable/sdcard");
    });
});
