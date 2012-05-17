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
var _ID = "blackberry.connection",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {},
    fields = [
        "UNKNOWN",
        "ETHERNET",
        "WIFI",
        "BLUETOOTH_DUN",
        "USB",
        "VPN",
        "BB",
        "CELLULAR",
        "NONE"
    ],
    defineROFieldArgs = [];

beforeEach(function () {
    GLOBAL.window = GLOBAL;
});

afterEach(function () {
    delete GLOBAL.window;
});

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("blackberry.connection", function () {
    beforeEach(function () {
        mockedWebworks.execSync = jasmine.createSpy().andReturn(2);
        mockedWebworks.defineReadOnlyField = jasmine.createSpy();
        GLOBAL.window.webworks = mockedWebworks;
        // client needs to be required for each test
        client = require(_apiDir + "/client");
        fields.forEach(function (field, index) {
            defineROFieldArgs.push([client, field, index]);
        });
        spyOn(console, "error");
    });

    afterEach(function () {
        unloadClient();
        defineROFieldArgs = [];
    });

    describe("blackberry.connection constants", function () {
        it("call defineReadOnlyField for each constant", function () {
            expect(mockedWebworks.defineReadOnlyField.callCount).toEqual(fields.length);
        });

        it("call defineReadOnlyField with right params", function () {
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("UNKNOWN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("ETHERNET")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("WIFI")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("BLUETOOTH_DUN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("USB")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("VPN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("BB")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("CELLULAR")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[fields.indexOf("NONE")]);
        });
    });

    describe("blackberry.connection.type", function () {
        it("calls execSync and equals to execSync return value", function () {
            expect(client.type).toEqual(2);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "type");
        });

        it("return UNKNOWN if execSync throws error", function () {
            mockedWebworks.execSync = jasmine.createSpy().andThrow("Too bad");
            expect(client.type).toEqual(0);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "type");
        });
    });
});
