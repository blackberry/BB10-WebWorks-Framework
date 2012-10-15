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
    mode = "0",
    devicePropertiesPath = "/pps/services/private/deviceproperties",
    uiccPath = "/pps/services/cellular/uicc/card0/status_restricted";

describe("identity index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
        mockedPPS = {
            init: jasmine.createSpy(),
            open: jasmine.createSpy().andCallFake(function (openPath) {
                path = openPath;
                return true;
            }),
            read: jasmine.createSpy(),
            close: jasmine.createSpy()
        };
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        ppsUtils = null;
        index = null;
        mockedPPS = null;
        path = null;
    });

    describe("getFields", function () {

        beforeEach(function () {

            mockedPPS.read.andCallFake(function () {
                if (path === devicePropertiesPath) {
                    return {
                        devicepin: "abcdefg",
                        IMEI: "AA-BBBBBB-CCCCCC-D",
                    };
                }
                if (path === uiccPath) {
                    return { imsi: "310150123456789" };
                }
            });
        });

        it("can call success", function () {
            var success = jasmine.createSpy();

            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.getFields(success, null, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open.callCount).toEqual(2); 
            expect(mockedPPS.open).toHaveBeenCalledWith(devicePropertiesPath, mode);
            expect(mockedPPS.open).toHaveBeenCalledWith(uiccPath, mode);
            expect(mockedPPS.read).toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith({
                uuid: "abcdefg",
                IMSI: "310150123456789",
                IMEI: "AA-BBBBBB-CCCCCC-D"
            });
        });

        it("can call fail if failed to open PPS object", function () {
            var fail = jasmine.createSpy();

            mockedPPS.open = jasmine.createSpy().andReturn(false);
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.getFields(null, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open.callCount).toEqual(2);
            expect(mockedPPS.open).toHaveBeenCalledWith(devicePropertiesPath, mode);
            expect(mockedPPS.open).toHaveBeenCalledWith(uiccPath, mode);
            expect(mockedPPS.read).not.toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String));
        });
    });
});
