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
    _apiDir = _extDir + "/sensors",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {
        execSync: jasmine.createSpy(),
        execAsync: jasmine.createSpy()
    };


describe("sensors", function () {
    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("setOptions", function () {
        it("calls execAsync", function () {
            client.setOptions("devicecompass", { delay : 1000 });
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "setOptions", { options : { delay : 1000, sensor : "devicecompass" } });
        });
    });
});
