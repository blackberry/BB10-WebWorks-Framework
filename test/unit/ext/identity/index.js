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
    path,
    mode = "0";

describe("identity index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
        mockedPPS = {
            init: jasmine.createSpy(),
            open: jasmine.createSpy().andReturn(true),
            read: jasmine.createSpy(),
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
        path = "/pps/services/private/deviceproperties";

        beforeEach(function () {
            mockedPPS.read.andReturn({"devicepin": "abcdefg"});
        });

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

    describe("IMSI", function () {
        var imsi = "310150123456789",
            path = "/pps/services/cellular/uicc/card0/status_restricted";

        beforeEach(function () {
            mockedPPS.read.andReturn({"imsi": imsi});
        });

        it("can call success with IMSI", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.IMSI(success, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(imsi);
            expect(fail).not.toHaveBeenCalled();
        });

        it("can call fail if failed to open PPS object", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            mockedPPS.open = jasmine.createSpy().andReturn(false);
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.IMSI(success, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).not.toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, "Cannot open PPS object");
        });
    });

    describe("IMEI", function () {
        var imei = "AA-BBBBBB-CCCCCC-D",
            path = "/pps/services/private/deviceproperties";

        beforeEach(function () {
            mockedPPS.read.andReturn({"IMEI": imei});
        });

        it("can call success with IMEI", function () {
            var success = jasmine.createSpy("success"),
                fail = jasmine.createSpy("fail");

            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.IMEI(success, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(imei);
        });

        it("can call fail if failed to open PPS object", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            mockedPPS.open = jasmine.createSpy().andReturn(false);
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.IMEI(success, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).not.toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, "Cannot open PPS object");
        });
    });
});
