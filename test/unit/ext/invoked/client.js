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

var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/invoked",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {
        execSync: jasmine.createSpy("webworks.execSync")
    };

describe("invoked client", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });

    describe("cardResizeDone", function () {
        it("should call execSync for cardResizeDone", function () {
            expect(client.cardResizeDone).toBeDefined();
            client.cardResizeDone();
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "cardResizeDone");
        });
    });

    describe("cardStartPeek", function () {
        var peekType = "root";

        it("should call execSync for cardStartPeek", function () {
            expect(client.cardStartPeek).toBeDefined();
            client.cardStartPeek(peekType);
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "cardStartPeek", {'peekType': peekType});
        });
    });

    describe("cardRequestClosure", function () {
        var request = {
            reason: "Request Reason",
            type: "mime/type",
            data: "Request data"
        };

        it("should call execSync for cardRequestClosure", function () {
            expect(client.cardRequestClosure).toBeDefined();
            client.cardRequestClosure(request);
            expect(window.webworks.execSync).toHaveBeenCalledWith(_ID, "cardRequestClosure", {'request': request});
        });
    });

    it("should register for events by calling registerEvents method", function () {
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "registerEvents", null);
    });
});

