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

var _apiDir = __dirname + "./../../../../ext/invoke/",
    _libDir = __dirname + "./../../../../lib/",
    _extDir = __dirname + "./../../../../ext/",
    mockedInvocation,
    mockedApplication,
    mockedController,
    _event,
    index,
    successCB,
    failCB,
    errorCode = -1;

describe("invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            invoke: jasmine.createSpy("invocation.invoke"),
            queryTargets: jasmine.createSpy("invocation.queryTargets"),
            TARGET_TYPE_MASK_APPLICATION: 1,
            TARGET_TYPE_MASK_CARD: 2,
            TARGET_TYPE_MASK_VIEWER: 4
        };
        mockedController = {
            dispatchEvent : jasmine.createSpy(),
            addEventListener : jasmine.createSpy(),
            removeEventListener : jasmine.createSpy()
        };
        mockedApplication = {
            interrupter : false,
            invocation: mockedInvocation,
            addEventListener : jasmine.createSpy().andCallFake(function (eventName, callback) {
                    callback();
                }),
            removeEventListener : jasmine.createSpy()
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                },
                getController : function () {
                    return mockedController;
                },
            }
        };

        GLOBAL.qnx = GLOBAL.window.qnx;
        _event = require(_libDir + "./event");
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

    describe("invoke", function () {

        it("can invoke with target", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({target: "abc.xyz"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                target: "abc.xyz"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });

        it("can invoke with uri", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });

        it("can invoke with uri using the file_transfer_mode property", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com", file_transfer_mode: "PRESERVE"})),
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com",
                file_transfer_mode : "PRESERVE"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });

    });

    describe("query", function () {
        var APPLICATION = 1,
            CARD = 2,
            VIEWER = 4;

        it("can query the invocation framework", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for application targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for viewer targets", function  () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = VIEWER;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for card targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for all targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not generate a target_type property in the request if it is not an array", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "APPLICATION"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will only use valid entries in the target type array to generate the target type mask", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER", "CARD", "INVALID_ENTRY"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = ["INVALID_ENTRY"];
            request["target_type_mask"] = APPLICATION | VIEWER | CARD;
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });
    });

    describe("card", function () {
        beforeEach(function () {
            mockedInvocation.closeChildCard = jasmine.createSpy("invocation.closeChildCard");
        });

        afterEach(function () {
            delete mockedInvocation.closeChildCard;
        });

        describe("methods", function () {
            it("can call closeChildCard with success callback at the end", function () {
                index.closeChildCard(successCB, failCB);
                expect(mockedInvocation.closeChildCard).toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
                expect(failCB).not.toHaveBeenCalled();
            });

            it("can call closeChildCard with fail callback on wrong call", function () {
                index.closeChildCard(null, failCB);
                expect(mockedInvocation.closeChildCard).toHaveBeenCalled();
                expect(successCB).not.toHaveBeenCalled();
                expect(failCB).toHaveBeenCalledWith(errorCode, jasmine.any(Object));
            });
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
                var evts = ["onChildCardStartPeek", "onChildCardEndPeek", "onChildCardClosed"],
                    args;

                spyOn(events, "add");

                evts.forEach(function (e) {
                    args = {eventName : encodeURIComponent(e)};
                    index.registerEvents(successCB);
                    eventExt.add(null, null, args);
                    expect(successCB).toHaveBeenCalled();
                    expect(events.add).toHaveBeenCalled();
                    expect(events.add.mostRecentCall.args[0].event).toEqual(e);
                    expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
                });
            });

            it("call successCB when all went well", function () {
                var eventName = "onChildCardClosed",
                    args = {eventName: encodeURIComponent(eventName)};

                spyOn(events, "add");
                index.registerEvents(jasmine.createSpy(), jasmine.createSpy());
                eventExt.add(successCB, failCB, args);
                expect(events.add).toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
                expect(failCB).not.toHaveBeenCalled();
            });

            it("call errorCB when there was an error", function () {
                var eventName = "onChildCardClosed",
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
                var evts = ["onChildCardStartPeek", "onChildCardEndPeek", "onChildCardClosed"],
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
                var eventName = "onChildCardClosed",
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

        describe("interrupt invocation", function () {

            it("expect returnInterruption to be defined", function () {
                expect(index.returnInterruption).toBeDefined();
            });

            it("can properly register for invocation interruption", function () {
                var args = {someTestStuff : 'Test arges'};
                index.registerInterrupter(successCB, failCB, args);
                expect(mockedApplication.invocation.interrupter).toEqual(jasmine.any(Function));
                expect(successCB).toHaveBeenCalled();
            });

            it("can properly trigger an event to the client after registration", function () {
                var args = {someTestStuff : 'Test arges'},
                    mockedRequest = {'mocked' : 'request'},
                    returnCallback = jasmine.createSpy();

                index.registerInterrupter(successCB, failCB, args);
                expect(mockedApplication.invocation.interrupter).toEqual(jasmine.any(Function));

                spyOn(_event, 'trigger');
                mockedApplication.invocation.interrupter(mockedRequest, returnCallback);
                expect(_event.trigger).toHaveBeenCalledWith('invocation.interrupted', mockedRequest);

                expect(successCB).toHaveBeenCalled();
            });

            it("can properly return from the client to continue invocation", function () {
                var mockedRequest = { request : encodeURIComponent(JSON.stringify({something : 'some other data'})) },
                    returnCallback = jasmine.createSpy();

                index.registerInterrupter(successCB, failCB, mockedRequest);
                expect(mockedApplication.invocation.interrupter).toEqual(jasmine.any(Function));

                spyOn(_event, 'trigger');
                mockedApplication.invocation.interrupter(mockedRequest, returnCallback);
                expect(_event.trigger).toHaveBeenCalledWith('invocation.interrupted', mockedRequest);

                index.returnInterruption(successCB, failCB, mockedRequest);
                expect(returnCallback).toHaveBeenCalledWith(JSON.parse(decodeURIComponent(mockedRequest.request)));
                expect(successCB).toHaveBeenCalled();
            });

            it("can properly clear invocation interruption", function () {
                index.clearInterrupter(successCB, failCB);
                expect(mockedApplication.invocation.interrupter).toEqual(undefined);
            });

        });
    });
});
