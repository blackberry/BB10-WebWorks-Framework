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
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/blackberry.event/index"),
    mockedInvocation,
    index;

describe("blackberry.invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            addEventListener: jasmine.createSpy("invocation addEventListener"),
            removeEventListener: jasmine.createSpy("invocation removeEventListener"),
            getStartupMode: jasmine.createSpy("getStartupMode").andCallFake(function () {
                return 0;
            }),
            LAUNCH: 0
        };
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };
        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.window.qnx = null;
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
            };

        beforeEach(function () {
            successCB = jasmine.createSpy("Success Callback");
            failCB = jasmine.createSpy("Fail Callback");
        });
        
        afterEach(function () {
            successCB = null;
            failCB = null;
        });

        // Positive test cases
        it("should call success callback when invoked with valid args", function () {
            index.invoke(successCB, failCB, mockValidArgs);
            index.invoke(successCB, failCB, mockValidArgsNoProtocolUrl);
            expect(successCB.callCount).toEqual(2);            
        });

        it("should call qnx.callExtensionMethod when invoked with valid args", function () {
            spyOn(qnx, "callExtensionMethod");
            index.invoke(successCB, failCB, mockValidArgs);            
            expect(qnx.callExtensionMethod).toHaveBeenCalledWith("navigator.invoke", "http://www.rim.com");
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

        it("should not call qnx.callExtensionMethod when passed wrong appType", function () {
            spyOn(qnx, "callExtensionMethod");
            index.invoke(successCB, failCB, mockWrongArgsForAppType);
            expect(qnx.callExtensionMethod).not.toHaveBeenCalled();
        });

        it("should not call any of qnx.callExtensionMethod methods when passed wrong protocol", function () {
            spyOn(qnx, "callExtensionMethod");
            index.invoke(successCB, failCB, mockWrongArgsForProtocol1);
            index.invoke(successCB, failCB, mockWrongArgsForProtocol2);
            expect(qnx.callExtensionMethod).not.toHaveBeenCalled();
        });
    });

    describe("'invoked' event", function () {
        it("can register for 'invoked' event", function () {
            var evts = ["invoked"],
                args,
                success = jasmine.createSpy();

            spyOn(events, "add");

            evts.forEach(function (e) {
                args = {eventName : encodeURIComponent(e)};
                index.registerEvents(success);
                eventExt.add(null, null, args);
                expect(success).toHaveBeenCalled();
                expect(events.add).toHaveBeenCalled();
                expect(events.add.mostRecentCall.args[0].event).toEqual(e);
                expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });
        });

        it("can un-register from 'invoked' event", function () {
            var evts = ["invoked"],
                args;
            spyOn(events, "remove");

            evts.forEach(function (e) {
                args = {eventName : encodeURIComponent(e)}; 
                eventExt.remove(null, null, args);
                expect(events.remove).toHaveBeenCalled();
                expect(events.remove.mostRecentCall.args[0].event).toEqual(e);
                expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });
        });
    });
});
