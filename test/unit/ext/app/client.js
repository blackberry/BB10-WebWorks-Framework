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
        description: {
            "default": "testDescription",
            "fr-FR": "testDescription-FR",
            "en": "testDescription-en"
        },
        id : "testId",
        license: "testLicense",
        licenseURL: "testLicenseURL",
        name: {
            "default": "testName",
            "fr-FR": "testName-FR",
            "en": "testName-EN"
        },
        version: "testVersion",
        orientation: "portrait-primary"
    },
    mockedWebworks;


describe("app client", function () {

    beforeEach(function () {
        mockedWebworks = {
            execSync: jasmine.createSpy("ext/app/client mockWebworks").andReturn(mockData)
        };
        GLOBAL.window = {
            webworks: mockedWebworks,
            orientation: 0
        };
        GLOBAL.navigator = {
            language: ""
        };
        delete require.cache[require.resolve(_apiDir + "/client")];
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        mockedWebworks = null;
        delete GLOBAL.window;
        delete GLOBAL.navigator;
        client = null;
    });

    it("execSync should have been called once for all app fields", function () {
        expect(mockedWebworks.execSync).toHaveBeenCalled();
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
        it("should be populated with default localized value", function () {
            navigator.language = "IDoNotExist";
            expect(client.description === mockData.description["default"]);
        });

        it("should be populated with localized value when provided", function () {
            navigator.language = "fr-FR";
            expect(client.description === mockData.description["fr-FR"]);
        });

        it("should be populated with localized language value, when region value not available", function () {
            navigator.language = "en-FR";
            expect(client.description === mockData.description["en"]);
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
        it("should be populated with default localized value", function () {
            GLOBAL.window.navigator = {language: "IDoNotExist"};
            expect(client.name === mockData.name["default"]);
        });

        it("should be populated with localized value when provided", function () {
            GLOBAL.window.navigator = {language: "fr-FR"};
            expect(client.name === mockData.name["fr-FR"]);
        });

        it("should be populated with localized language value, when region value not availble", function () {
            GLOBAL.window.navigator = {language: "en-FR"};
            expect(client.name === mockData.name["en"]);
        });
    });

    describe("version", function () {
        it("should be populated", function () {
            expect(client.version === mockData.version);
        });
    });

    describe("exit", function () {
        it("should call execSync", function () {
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
            client.lockOrientation('portrait-primary');
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "lockOrientation", { orientation: 'portrait-primary' });
        });
    });

    describe("unlockOrientation", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            client.unlockOrientation();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "unlockOrientation");
        });
    });

    describe("rotate", function () {
        it("should call execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy();
            client.rotate('landscape');
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "rotate", {orientation: 'landscape'});
        });
    });
});
