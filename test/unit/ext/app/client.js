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
    _apiDir = _extDir + "/app",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockData = {
        author: "testAuthor",
        authorEmail: "testEmail",
        authorURL: "testURL",
        copyright: "testCopyright",
        description: "testDescription",
        id : "testId",
        license: "testLicense",
        licenseURL: "testLicenseURL",
        name: "testName",
        version: "testVersion",
        orientation: "portrait-primary"
    },
    mockedWebworks = {
        execSync: jasmine.createSpy().andReturn(mockData)
    };

beforeEach(function () {
    GLOBAL.window = GLOBAL;
    GLOBAL.window.webworks = mockedWebworks;
    GLOBAL.window.orientation = 0;
    client = require(_apiDir + "/client");
});

afterEach(function () {
    delete GLOBAL.window;
    client = null;
});

describe("app client", function () {
    it("execSync should have been called once for all app fields", function () {
        expect(mockedWebworks.execSync.callCount).toEqual(2); // +1 to account for the call to execSync for events
    });

    describe("author", function () {
        it("should be populated", function () {
            expect(client.author === mockData.author);
        });
    });

    describe("authorEmail", function () {
        it("should be populated", function () {
            expect(client.authorEmail === mockData.authorEmail);
        });
    });

    describe("authorURL", function () {
        it("should be populated", function () {
            expect(client.authorURL === mockData.authorURL);
        });
    });

    describe("copyright", function () {
        it("should be populated", function () {
            expect(client.copyright === mockData.copyright);
        });
    });

    describe("description", function () {
        it("should be populated", function () {
            expect(client.description === mockData.description);
        });
    });

    describe("id", function () {
        it("should be populated", function () {
            expect(client.id === mockData.id);
        });
    });

    describe("license", function () {
        it("should be populated", function () {
            expect(client.license === mockData.license);
        });
    });

    describe("licenseURL", function () {
        it("should be populated", function () {
            expect(client.licenseURL === mockData.licenseURL);
        });
    });

    describe("name", function () {
        it("should be populated", function () {
            expect(client.name === mockData.name);
        });
    });

    describe("version", function () {
        it("should be populated", function () {
            expect(client.version === mockData.version);
        });
    });

    describe("exit", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            client.exit();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "exit");
        });
    });

    describe("orientation", function () {
        it("should be populated", function () {
            expect(client.orientation === mockData.orientation);
        });
    });

    describe("lockOrientation", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            client.lockOrientation('portrait-primary');
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "lockOrientation", { orientation: 'portrait-primary' });
        });
    });

    describe("unlockOrientation", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            client.unlockOrientation();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "unlockOrientation");
        });
    });

    describe("rotate", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            GLOBAL.window.webworks = mockedWebworks;
            client.rotate('landscape');
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "rotate", {orientation: 'landscape'});
        });
    });
});
