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
    index;

describe("identity index", function () {
    beforeEach(function () {
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        index = null;
    });

    describe("getFields", function () {
        beforeEach(function () {
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        device: {
                        }
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
        });

        it("can call success", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                mockedDevice = {
                    devicePin: (new Date()).getTime(),
                    IMSI: "310150123456789",
                    IMEI: "AA-BBBBBB-CCCCCC-D"
                };

            window.qnx.webplatform.device = mockedDevice;

            index.getFields(success, fail);

            expect(success).toHaveBeenCalledWith({
                uuid: mockedDevice.devicePin,
                IMSI: mockedDevice.IMSI,
                IMEI: mockedDevice.IMEI
            });
            expect(fail).not.toHaveBeenCalled();
        });

        it("will call fail when the fields are missing", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            index.getFields(success, fail);

            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, "Cannot retrieve data from system");
        });


        it("will call fail when an error occurs", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                errMsg = "Something bad happened";

            Object.defineProperty(window.qnx.webplatform.device, "devicePin", {
                get: function () {
                    throw new Error(errMsg);
                }
            });

            index.getFields(success, fail);

            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, errMsg);
        });
    });
});
