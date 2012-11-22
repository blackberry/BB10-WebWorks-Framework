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
    _apiDir = _extDir + "/identity",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {};

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("identity client", function () {
    describe("when user has specified correct permission", function () {
        beforeEach(function () {
            mockedWebworks.execSync = jasmine.createSpy().andCallFake(function (service, action, args) {
                var result = "Unsupported action";

                if (action === "getFields") {
                    result = {
                        uuid: "0x12345678",
                        IMSI: "310150123456789",
                        IMEI: "AA-BBBBBB-CCCCCC-D"
                    };
                }

                return result;
            });
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            client = require(_apiDir + "/client");
        });

        afterEach(function () {
            unloadClient();
            delete GLOBAL.window;
        });

        it("execSync should have been called once for all fields", function () {
            expect(mockedWebworks.execSync.callCount).toEqual(1);
        });

        it("uuid should call execSync and value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", "0x12345678");
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "getFields", null);
            expect(mockedWebworks.execSync).not.toHaveBeenCalledWith(_ID, "uuid", null);
        });

        it("IMSI value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "IMSI", "310150123456789");
            expect(mockedWebworks.execSync).not.toHaveBeenCalledWith(_ID, "IMSI", null);
        });

        it("IMSI value should be defined", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "IMEI", "AA-BBBBBB-CCCCCC-D");
            expect(mockedWebworks.execSync).not.toHaveBeenCalledWith(_ID, "IMEI", null);
        });
    });

    describe("when user hasn't specified correct permission", function () {
        beforeEach(function () {
            spyOn(console, "error");
            mockedWebworks.execSync = jasmine.createSpy().andThrow("Cannot read PPS object");
            GLOBAL.window = {
                webworks: mockedWebworks
            };
            // client needs to be required for each test
            client = require(_apiDir + "/client");
        });

        afterEach(function () {
            unloadClient();
            delete GLOBAL.window;
        });

        afterEach(unloadClient);

        it("uuid should call execSync and catch error and return null", function () {
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "getFields", null);
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", null);
        });
    });
});
