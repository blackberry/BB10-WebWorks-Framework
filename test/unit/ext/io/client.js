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
var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/io",
    _ID = require(_apiDir + "/manifest").namespace,
    client = require(_apiDir + "/client"),
    sandbox,
    mockedWebworks = {
        execSync: jasmine.createSpy("execSync").andCallFake(function (service, action, args) {
            if (action === "home") {
                return "/home";
            } else if (action === "sharedFolder") {
                return "/shared";
            } else if (action === "SDCard") {
                return "/sdcard";
            } else if (action === "sandbox") {
                if (args) {
                    sandbox = args.sandbox;
                } else {
                    return false;
                }
            }
        })
    };

beforeEach(function () {
    GLOBAL.window = {
        webworks: mockedWebworks
    };
});

afterEach(function () {
    delete GLOBAL.window;
});

describe("io client", function () {
    it("sandbox getter calls execSync", function () {
        expect(client.sandbox).toEqual(false);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "sandbox");
    });

    it("sandbox setter calls execSync", function () {
        client.sandbox = false;
        expect(sandbox).toBeFalsy();
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "sandbox", {"sandbox": false});
    });

    it("home calls execSync", function () {
        expect(client.home).toEqual("/home");
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "home");
    });

    it("sharedFolder calls execSync", function () {
        expect(client.sharedFolder).toEqual("/shared");
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "sharedFolder");
    });

    it("SDCard calls execSync", function () {
        expect(client.SDCard).toEqual("/sdcard");
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "SDCard");
    });
});
