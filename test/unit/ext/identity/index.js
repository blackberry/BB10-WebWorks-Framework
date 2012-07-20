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
var _apiDir = __dirname + "./../../../../ext/identity/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    ppsUtils,
    mockedPPS,
    path = "/pps/services/private/deviceproperties",
    mode = "0";

describe("identity index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
        mockedPPS = {
            init: jasmine.createSpy(),
            open: jasmine.createSpy().andReturn(true),
            read: jasmine.createSpy().andReturn({"devicepin": "abcdefg"}),
            close: jasmine.createSpy()
        };
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        ppsUtils = null;
        index = null;
        mockedPPS = null;
    });

    describe("uuid", function () {
        it("can call success with devicepin", function () {
            var success = jasmine.createSpy();

            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.uuid(success, null, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith("abcdefg");
        });

        it("can call fail if failed to open PPS object", function () {
            var fail = jasmine.createSpy();

            mockedPPS.open = jasmine.createSpy().andReturn(false);
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.uuid(null, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).not.toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();            
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String));
        });
    });
});