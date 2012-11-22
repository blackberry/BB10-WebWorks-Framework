/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var extDir = __dirname + "./../../../../ext",
    apiDir = extDir + "/system",
    ID = require(apiDir + "/manifest").namespace,
    sysClient = null,
    mockedWebworks = {
        exec : function () {},
        execSync: function () {},
        defineReadOnlyField: jasmine.createSpy()
    };

describe("system client", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        sysClient = require(apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    it("hasPermission", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(0);

        result = sysClient.hasPermission("blackberry.app");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "hasPermission", {"module": "blackberry.app"});
        expect(result).toEqual(0);
    });

    it("hasCapability", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(true);

        result = sysClient.hasCapability("abc.def");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "hasCapability", {"capability": "abc.def"});
        expect(result).toBeTruthy();
    });

    it("getFontInfo", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(true);

        result = sysClient.getFontInfo();

        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "getFontInfo");
        expect(result).toBeTruthy();
    });

    it("getCurrentTimezone", function () {
        spyOn(mockedWebworks, "execSync").andReturn("America/New_York");

        var result = sysClient.getCurrentTimezone();

        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "getCurrentTimezone");
        expect(result).toBe("America/New_York");
    });

    it("getTimezones", function () {
        var timezones = ["America/New_York", "America/Los_Angeles"],
            result;

        spyOn(mockedWebworks, "execSync").andReturn(timezones);

        result = sysClient.getTimezones();

        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "getTimezones");
        expect(result).toBe(timezones);
    });

    it("ALLOW", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "ALLOW", 0);
    });

    it("DENY", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "DENY", 1);
    });

    describe("device properties and registerEvents", function () {

        var mockDeviceProperties = {
            hardwareId: "123",
            softwareVersion: "456",
            name: "789"
        };

        beforeEach(function () {
            mockedWebworks.execSync = mockedWebworks.execSync = jasmine.createSpy().andReturn(mockDeviceProperties);
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            delete require.cache[require.resolve(apiDir + "/client")];
            sysClient = require(apiDir + "/client");
        });

        afterEach(function () {
            delete GLOBAL.window;
            delete require.cache[require.resolve(apiDir + "/client")];
            sysClient = null;
        });

        it("execSync should have been called once for all system fields", function () {
            expect(mockedWebworks.execSync.callCount).toEqual(2); // the extra call is for registerEvents
        });

        it("registerEvents", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain([ID, "registerEvents", null]);
        });

        it("readonly fields set", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "hardwareId", "123");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "softwareVersion", "456");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "name", "789");
        });
    });

    describe("properties", function () {

        describe("region", function () {
            beforeEach(function () {
                mockedWebworks.execSync = jasmine.createSpy("execSync").andCallFake(function (namespace, field) {
                    if (field === "language") {
                        return "fr_CA";
                    } else if (field === "region") {
                        return "en_US";
                    }
                });
                mockedWebworks.defineReadOnlyField = jasmine.createSpy();
                GLOBAL.window = {
                    webworks: mockedWebworks
                };
                // client needs to be required for each test
                delete require.cache[require.resolve(apiDir + "/client")];
                sysClient = require(apiDir + "/client");
            });

            afterEach(function () {
                delete GLOBAL.window;
                delete require.cache[require.resolve(apiDir + "/client")];
                sysClient = null;
            });

            it("region", function () {
                expect(sysClient.region).toEqual("en_US");
                expect(mockedWebworks.execSync.argsForCall).toContain([ID, "region", null]);
            });
        });

        describe("language", function () {
            var mockNavigator;

            beforeEach(function () {
                mockNavigator = {
                    language: (new Date()).toString()
                };
                GLOBAL.navigator = mockNavigator;
                sysClient = require(apiDir + "/client");
            });

            afterEach(function () {
                delete GLOBAL.navigator;
            });

            it("defines a getter for navigator.language", function () {
                expect(sysClient.language).toEqual(mockNavigator.language);
            });

        });
    });
});
