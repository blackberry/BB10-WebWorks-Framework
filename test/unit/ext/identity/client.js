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
    mockedWebworks = {},
    fields = [
        "uuid"
    ],
    execSyncArgs = [];

beforeEach(function () {
    GLOBAL.window = GLOBAL;

    fields.forEach(function (field) {
        execSyncArgs.push([_ID, field, null]);
    });
});

afterEach(function () {
    execSyncArgs = [];
    delete GLOBAL.window;
});

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("identity client", function () {
    describe("when user has specified correct permission", function () {
        beforeEach(function () {
            mockedWebworks.execSync = jasmine.createSpy().andReturn("0x12345678");
            mockedWebworks.defineReadOnlyField = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            // client needs to be required for each test
            client = require(_apiDir + "/client");
        });

        afterEach(unloadClient);

        it("execSync should have been called once for each identity field", function () {
            expect(mockedWebworks.execSync.callCount).toEqual(fields.length);
        });

        it("uuid should call execSync and equal to execSync return value", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("uuid")]);
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", "0x12345678");
        });
    });

    describe("when user hasn't specified correct permission", function () {
        beforeEach(function () {
            spyOn(console, "error");
            mockedWebworks.execSync = jasmine.createSpy().andThrow("Cannot read PPS object"); 
            GLOBAL.window.webworks = mockedWebworks;
            client = require(_apiDir + "/client");
        });

        afterEach(unloadClient);

        it("uuid should call execSync and catch error and return null", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("uuid")]);
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "uuid", null);
        });
    });
});