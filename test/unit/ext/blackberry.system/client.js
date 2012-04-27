/*
 * Copyright 2010-2011 Research In Motion Limited.
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
    sysClient = null,
    mockedWebworks = {
        exec : function () {},
        execSync: function () {},
        defineReadOnlyField: jasmine.createSpy()
    };

describe("blackberry.system client", function () {
    beforeEach(function () {
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;
        sysClient = require(root + "ext/blackberry.system/client");
    });

    it("hasPermission", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(0);

        result = sysClient.hasPermission("blackberry.app");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith("blackberry.system", "hasPermission", {"module": "blackberry.app"});
        expect(result).toEqual(0);
    });

    it("hasCapability", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(true);

        result = sysClient.hasCapability("abc.def");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith("blackberry.system", "hasCapability", {"capability": "abc.def"});
        expect(result).toBeTruthy();
    });

    it("ALLOW", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "ALLOW", 0);
    });

    it("DENY", function () {
        expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(sysClient, "DENY", 1);
    });
});