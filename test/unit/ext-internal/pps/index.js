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
var _apiDir = __dirname + "./../../../../ext-internal/pps/",
    _libDir = __dirname + "./../../../../lib/",
    index;

describe("pps index", function () {

    beforeEach(function () {
        index = require(_apiDir + "index");
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                pps: {
                    syncReadPPSObject : jasmine.createSpy(),
                    syncWritePPSObject : jasmine.createSpy()
                }
            }
        };
    });

    afterEach(function () {
        index = null;
    });

    describe("syncWrite", function () {

        it("can call success", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                returnValue = { "good" : 1 };
            window.qnx.webplatform.pps.syncWritePPSObject.andReturn(returnValue);
            index.syncWrite(success, fail, { 
                writeData: "%7B%22msg%22%3A%22hide%22%7D",
                path : "%22%2Fpath%22",
                options: "undefined"
            });
            expect(window.qnx.webplatform.pps.syncWritePPSObject).toHaveBeenCalledWith(
                { msg : "hide" }, 
                "/path", 
                undefined);
            expect(success).toHaveBeenCalledWith(returnValue);
            expect(fail).not.toHaveBeenCalled();
        });

        it("can call fail", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            window.qnx.webplatform.pps.syncWritePPSObject.andThrow("ERROR");
            index.syncWrite(success, fail, { 
                writeData: "%7B%22msg%22%3A%22hide%22%7D",
                path : "%22%2Fpath%22",
                options: "undefined"
            });
            expect(window.qnx.webplatform.pps.syncWritePPSObject).toHaveBeenCalledWith(
                { msg : "hide" }, 
                "/path", 
                undefined);
            expect(success).not.toHaveBeenCalledWith();
            expect(fail).toHaveBeenCalledWith("ERROR");
        });

        it("can call fail when writeData is undefined", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            index.syncWrite(success, fail, { 
                writeData : "undefined", 
                path: " %22%2Fpath%22", 
                options: "undefined"
            });
            expect(window.qnx.webplatform.pps.syncWritePPSObject).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalledWith();
            expect(fail).toHaveBeenCalled();
        });

        it("can call fail when path is undefined", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            index.syncWrite(success, fail, { 
                writeData : "%7B%22msg%22%3A%22hide%22%7D", 
                path: "undefined", 
                options: "undefined"
            });
            expect(window.qnx.webplatform.pps.syncWritePPSObject).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalledWith();
            expect(fail).toHaveBeenCalled();
        });

    });

    describe("syncRead", function () {

        it("can call success", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                returnValue = { "good" : 1 };
            window.qnx.webplatform.pps.syncReadPPSObject.andReturn(returnValue);
            index.syncRead(success, fail, { path : "%22%2Fpath%22", options: "undefined"});
            expect(window.qnx.webplatform.pps.syncReadPPSObject).toHaveBeenCalledWith("/path", undefined);
            expect(success).toHaveBeenCalledWith(returnValue);
            expect(fail).not.toHaveBeenCalled();
        });

        it("can call fail", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            window.qnx.webplatform.pps.syncReadPPSObject.andThrow("ERROR");
            index.syncRead(success, fail, { path : "%22%2Fpath%22", options: "undefined"});
            expect(window.qnx.webplatform.pps.syncReadPPSObject).toHaveBeenCalledWith("/path", undefined);
            expect(success).not.toHaveBeenCalledWith();
            expect(fail).toHaveBeenCalledWith("ERROR");
        });

        it("can call fail when path is undefined", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            index.syncRead(success, fail, { path : "undefined", options: "undefined"});
            expect(window.qnx.webplatform.pps.syncReadPPSObject).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalledWith();
            expect(fail).toHaveBeenCalled();
        });

    });

});
