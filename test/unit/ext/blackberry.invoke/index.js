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

var _apiDir = __dirname + "./../../../../ext/blackberry.invoke/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    ppsUtils,
    mockedPPS;

describe("blackberry.invoke index", function () {

    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        ppsUtils = null;
        index = null;
    });

    describe("Browser Invoke", function () {
        var appType_Browser = 11,
            httpUrl = 'http://www.rim.com',
            noProtocolUrl = 'www.rim.com',
            wrongAppType = -1,
            successCB,
            failCB,
            mockValidArgs = {
                appType: appType_Browser,
                args: encodeURIComponent(JSON.stringify({
                    url: httpUrl
                }))
            },
            mockValidArgsNoProtocolUrl = {
                appType: appType_Browser,
                args: encodeURIComponent(JSON.stringify({
                    url: noProtocolUrl
                }))
            },
            mockWrongArgsForAppType = {
                appType: wrongAppType,
                args: encodeURIComponent(JSON.stringify({
                    url: httpUrl
                }))
            },
            mockWrongArgsForProtocol1 = {
                appType: appType_Browser,
                args: encodeURIComponent(JSON.stringify({
                    url: 'wrong://www.rim.com'
                }))
            },
            mockWrongArgsForProtocol2 = {
                appType: appType_Browser,
                args: encodeURIComponent(JSON.stringify({
                    url: 'httpx://www.rim.com'
                }))
            },
            expectedOpenMethodArgs = {
                path: '/pps/services/navigator/control?server',
                mode: 2
            },
            expectedWriteMethodArgs = {
                id: '',
                dat: httpUrl, 
                msg: 'invoke'
            };

        beforeEach(function () {
            successCB = jasmine.createSpy("Success Callback");
            failCB = jasmine.createSpy("Fail Callback");
            mockedPPS = { 
                init: jasmine.createSpy("Init Method"),
                open: jasmine.createSpy("Open Method"),
                read: jasmine.createSpy("Read Method"),
                write: jasmine.createSpy("Write Method"),
                close: jasmine.createSpy("Close Method")
            };
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);
        });
        
        afterEach(function () {
            successCB = null;
            failCB = null;
            mockedPPS = null;
        });

        // Positive test cases
        it("should call success callback when invoked with valid args", function () {
            index.invoke(successCB, failCB, mockValidArgs);
            index.invoke(successCB, failCB, mockValidArgsNoProtocolUrl);
            expect(successCB.callCount).toEqual(2);            
        });

        it("should call ppsUtil methods when invoked with valid args", function () {
            index.invoke(successCB, failCB, mockValidArgs);            
            expect(ppsUtils.createObject).toHaveBeenCalled();
            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(expectedOpenMethodArgs.path, expectedOpenMethodArgs.mode);
            expect(mockedPPS.write).toHaveBeenCalledWith(expectedWriteMethodArgs);
            expect(mockedPPS.close).toHaveBeenCalled();
        });
        
        //Negative test cases
        it("should call fail callback when passed wrong appType", function () {
            index.invoke(successCB, failCB, mockWrongArgsForAppType);
            expect(failCB).toHaveBeenCalledWith(wrongAppType, "The application specified to invoke is not supported.");
        });

        it("should call fail callback when passed wrong protocol", function () {
            index.invoke(successCB, failCB, mockWrongArgsForProtocol1);
            index.invoke(successCB, failCB, mockWrongArgsForProtocol2);
            expect(failCB.callCount).toEqual(2); 
            expect(failCB).toHaveBeenCalledWith(wrongAppType, "Please specify a fully qualified URL that starts with either the 'http://' or 'https://' protocol.");
        });

        it("should not call any of ppsUtils methods when passed wrong appType", function () {
            index.invoke(successCB, failCB, mockWrongArgsForAppType);            
            expect(ppsUtils.createObject).not.toHaveBeenCalled();
            expect(mockedPPS.init).not.toHaveBeenCalled();
            expect(mockedPPS.open).not.toHaveBeenCalled();
            expect(mockedPPS.write).not.toHaveBeenCalled();
            expect(mockedPPS.close).not.toHaveBeenCalled();
        });

        it("should not call any of ppsUtils methods when passed wrong protocol", function () {
            index.invoke(successCB, failCB, mockWrongArgsForProtocol1);            
            index.invoke(successCB, failCB, mockWrongArgsForProtocol2);            
            expect(ppsUtils.createObject).not.toHaveBeenCalled();
            expect(mockedPPS.init).not.toHaveBeenCalled();
            expect(mockedPPS.open).not.toHaveBeenCalled();
            expect(mockedPPS.write).not.toHaveBeenCalled();
            expect(mockedPPS.close).not.toHaveBeenCalled();
        });
    });
});
