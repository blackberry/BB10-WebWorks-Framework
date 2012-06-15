/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var _ID = "blackberry.invoke",
    _extDir = __dirname + "./../../../../ext",
    _libDir = __dirname + "./../../../../lib",
    _apiDir = _extDir + "/" + _ID,
    utils,
    client,
    mockedWebworks = {
        execAsync: function () {},
        execSync: jasmine.createSpy(),
        defineReadOnlyField: jasmine.createSpy()
    },
    constants = {
        "APP_CAMERA": 4,
        "APP_MAPS": 5,
        "APP_BROWSER": 11,
        "APP_MUSIC": 13,
        "APP_PHOTOS": 14,
        "APP_VIDEOS": 15,
        "APP_APPWORLD": 16
    },
    defineROFieldArgs = [];

describe("blackberry.invoke client", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;

        utils = require(_libDir + "/utils");
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        utils = null;
        client = null;
    });

    describe("appType", function () {
        it("should return constant for appropriate appType", function () {
            Object.getOwnPropertyNames(constants).forEach(function (c) {
                defineROFieldArgs.push([client, c, constants[c]]);
            });

            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_CAMERA")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_MAPS")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_BROWSER")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_MUSIC")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_PHOTOS")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_VIDEOS")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("APP_APPWORLD")]);
        });
    });

    describe("Browser Invoke", function () {
        it("should call execAsync when invoke called", function () {
            var url = "http://www.google.com",
                result;

            spyOn(mockedWebworks, "execAsync").andReturn(0);

            result = client.invoke(client.APP_BROWSER, new client.BrowserArguments(url));
            
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invoke", { 'appType' : client.APP_BROWSER, args : { 'url' : url } });
        });
    });

    describe("BrowserArguments", function () {
        var url = "http://www.google.com", 
            browserArguments;

        it("should create a new BrowserArguments Object with url", function () {
            browserArguments = new client.BrowserArguments(url);

            expect(browserArguments.url).toEqual(url);
        });
    });

    describe("registering for events", function () {
        it("should register for events by calling registerEvents method", function () {
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "registerEvents", null);
        });
    });
});