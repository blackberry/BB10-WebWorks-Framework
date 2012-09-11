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

var _apiDir = __dirname + "./../../../../ext/invoked/",
    _libDir = __dirname + "./../../../../lib/",
    mockedInvocation,
    index,
    successCB,
    failCB,
    errorCode = -1;

describe("invoked index", function () {

    beforeEach(function () {
        mockedInvocation = {
            getRequest: jasmine.createSpy("invocation.getRequest"),
            getStartupMode: jasmine.createSpy("invocation.getStartupMode").andCallFake(function () {
                return 0;
            }),
            LAUNCH: 0
        };
        GLOBAL.window = {};
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
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        index = null;
        successCB = null;
        failCB = null;
    });

    describe("events", function () {
        var utils,
            events,
            eventExt;

        beforeEach(function () {
            utils = require(_libDir + "utils");
            events = require(_libDir + "event");
            eventExt = require(__dirname + "./../../../../ext/event/index");
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
        });

        afterEach(function () {
            utils = null;
            events = null;
            eventExt = null;
        });

        it("can register for events", function () {
            var evts = ["invoked", "onCardResize", "onCardClosed"],
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

        it("call successCB when all went well", function () {
            var eventName = "invoked",
                args = {eventName: encodeURIComponent(eventName)};

            spyOn(events, "add");
            index.registerEvents(jasmine.createSpy(), jasmine.createSpy());
            eventExt.add(successCB, failCB, args);
            expect(events.add).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("call errorCB when there was an error", function () {
            var eventName = "invoked",
                args = {eventName: encodeURIComponent(eventName)};

            spyOn(events, "add").andCallFake(function () {
                throw "";
            });

            index.registerEvents(jasmine.createSpy(), jasmine.createSpy());
            eventExt.add(successCB, failCB, args);
            expect(events.add).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
        });

        it("can un-register from events", function () {
            var evts = ["invoked", "onCardResize", "onCardClosed"],
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

        it("call successCB when all went well even when event is not defined", function () {
            var eventName = "eventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};

            spyOn(events, "remove");
            eventExt.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("call errorCB when there was exception occured", function () {
            var eventName = "invoked",
                args = {eventName: encodeURIComponent(eventName)};

            spyOn(events, "remove").andCallFake(function () {
                throw "";
            });
            eventExt.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
        });
    });

    describe("methods", function () {
        beforeEach(function () {
            mockedInvocation.cardResized = jasmine.createSpy("invocation.cardResized");
            mockedInvocation.cardPeek = jasmine.createSpy("invocation.cardPeek");
            mockedInvocation.sendCardDone = jasmine.createSpy("invocation.sendCardDone");
        });

        afterEach(function () {
            delete mockedInvocation.cardResizeDone;
            delete mockedInvocation.cardStartPeek;
            delete mockedInvocation.cardRequestClosure;
        });

        // Positive
        it("can call cardResizeDone with success callback at the end", function () {
            index.cardResizeDone(successCB, failCB);
            expect(mockedInvocation.cardResized).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("can call cardStartPeek with success callback at the end", function () {
            var cartType = "root",
                args = {
                    'peekType': encodeURIComponent(cartType)
                };

            index.cardStartPeek(successCB, failCB, args);
            expect(mockedInvocation.cardPeek).toHaveBeenCalledWith(cartType);
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("can call cardRequestClosure with success callback at the end", function () {
            var request = {
                    reason: "Close Reason",
                    type: "mime/type",
                    data: "Close Data"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.cardRequestClosure(successCB, failCB, args);
            expect(mockedInvocation.sendCardDone).toHaveBeenCalledWith(request);
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        // Negative
        it("can call cardResizeDone with fail callback on wrong call", function () {
            index.cardResizeDone(null, failCB);
            expect(mockedInvocation.cardResized).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalledWith(errorCode, jasmine.any(Object));
        });

        it("can call cardStartPeek with fail callback when missing required parameter", function () {
            index.cardStartPeek(successCB, failCB);
            expect(mockedInvocation.cardResized).not.toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalledWith(errorCode, jasmine.any(Object));
        });

        it("can call cardRequestClosure with fail callback when missing required parameter", function () {
            index.cardRequestClosure(successCB, failCB);
            expect(mockedInvocation.sendCardDone).not.toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalledWith(errorCode, jasmine.any(Object));
        });
    });
});

