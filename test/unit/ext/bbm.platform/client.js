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
var root = __dirname + "/../../../../",
    apiDir = root + "ext/bbm.platform/",
    _ID = require(apiDir + "/manifest").namespace,
    client = null,
    mockedWebworks = {
        execSync: jasmine.createSpy(),
        execAsync: jasmine.createSpy(),
        event: { once : jasmine.createSpy(),
                 isOn : jasmine.createSpy() }
    };

describe("bbm.platform", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        client = require(apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
        delete require.cache[require.resolve(apiDir + "/client")];
    });

    describe("bbm.platform.register", function () {
        it("registers an application", function () {
            var options = { uuid : "blah" };

            client.register(options);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "register", { "options" : options });
        });
    });

    describe("bbm.platform.self", function () {
        it("getDisplayPicture calls execAsync", function () {
            client.self.getDisplayPicture(function (img) { });
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "self/getDisplayPicture", { "eventId" : "bbm.self.displayPicture" });
        });

        it("setStatus calls execAsync", function () {
            client.self.setStatus("available", "Hello");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "self/setStatus", { "status" : "available", "statusMessage" : "Hello" });
        });

        it("setPersonalMessage calls execAsync", function () {
            client.self.setPersonalMessage("Hello World");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "self/setPersonalMessage", { "personalMessage" : "Hello World" });
        });

        it("setDisplayPicture calls execAsync", function () {
            client.self.setDisplayPicture("/tmp/avatar.gif");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "self/setDisplayPicture", { "displayPicture" : "/tmp/avatar.gif" });
        });

    });

    describe("bbm.platform.users", function () {
        it("inviteToDownload calls execAsync", function () {
            client.users.inviteToDownload();
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "users/inviteToDownload");
        });
    });
});

