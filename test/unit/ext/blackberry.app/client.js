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
var _ID = "blackberry.app",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {
        execSync: jasmine.createSpy()
    },
    fields = [
        "author",
        "authorEmail",
        "authorURL",
        "copyright",
        "description",
        "id",
        "license",
        "licenseURL",
        "name",
        "version"
    ],
    execSyncArgs = [];

beforeEach(function () {
    GLOBAL.window = GLOBAL;
    GLOBAL.window.webworks = mockedWebworks;

    fields.forEach(function (field) {
        execSyncArgs.push([_ID, field, null]);
    });

    client = require(_apiDir + "/client");
});

afterEach(function () {
    delete GLOBAL.window;
    client = null;
});

describe("blackberry.app client", function () {
    it("execSync should have been called once for each blackberry.app field", function () {
        expect(mockedWebworks.execSync.callCount).toEqual(fields.length + 1); // +1 to account for the call to execSync for events
    });

    describe("author", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("author")]);
        });
    });

    describe("authorEmail", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("authorEmail")]);
        });
    });

    describe("authorURL", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("authorURL")]);
        });
    });

    describe("copyright", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("copyright")]);
        });
    });

    describe("description", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("description")]);
        });
    });

    describe("id", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("id")]);
        });
    });

    describe("license", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("license")]);
        });
    });

    describe("licenseURL", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("licenseURL")]);
        });
    });

    describe("name", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("name")]);
        });
    });

    describe("version", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("version")]);
        });
    });
    
    describe("exit", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            client.exit();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith("blackberry.app", "exit");
        });
    });
});
