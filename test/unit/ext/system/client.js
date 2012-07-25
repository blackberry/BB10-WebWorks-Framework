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
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;
        sysClient = require(apiDir + "/client");
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

    it("ALLOW", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "ALLOW", 0);
    });

    it("DENY", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "DENY", 1);
    });

    describe("device properties and registerEvents", function () {
        var fields = [
                "hardwareId",
                "softwareVersion"
            ],
            execSyncArgs = [];

        beforeEach(function () {
            delete require.cache[require.resolve(apiDir + "/client")];
            sysClient = null;

            GLOBAL.window = GLOBAL;
            fields.forEach(function (field) {
                execSyncArgs.push([ID, field, null]);
            });
            mockedWebworks.execSync = jasmine.createSpy().andReturn(null);
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            // client needs to be required for each test
            sysClient = require(apiDir + "/client");
        });

        afterEach(function () {
            execSyncArgs = [];
            delete GLOBAL.window;
        });

        it("execSync should have been called once for each system field", function () {
            expect(mockedWebworks.execSync.callCount).toEqual(fields.length + 1); // the extra call is for registerEvents
        });

        it("registerEvents", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain([ID, "registerEvents", null]);
        });

        it("hardwareId", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("hardwareId")]);
        });

        it("softwareVersion", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("softwareVersion")]);
        });

        it("readonly fields set", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "hardwareId", null);
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "softwareVersion", null);
        });
    });
});