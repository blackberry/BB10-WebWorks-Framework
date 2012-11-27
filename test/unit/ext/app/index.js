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
var _apiDir = __dirname + "./../../../../ext/app/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    index,
    mockedMinimize,
    mockedExit,
    mockedRotate,
    mockedLockRotation,
    mockedUnlockRotation,
    config;

function getWebPlatformEventName(e) {
    switch (e) {
    case "pause":
        return "inactive";
    case "resume":
        return "active";
    case "orientationchange":
        return [ 'rotate', 'rotateWhenLocked' ];
    default:
        return e;
    }
}

function testRegisterEvent(e) {
    var args = {eventName : encodeURIComponent(e)},
        success = jasmine.createSpy(),
        utils = require(_libDir + "utils"),
        appEvents = require(_libDir + "events/applicationEvents");

    spyOn(appEvents, "addEventListener");

    spyOn(utils, "loadExtensionModule").andCallFake(function () {
        return eventExt;
    });

    index.registerEvents(success);
    eventExt.add(null, null, args);
    expect(success).toHaveBeenCalled();
    expect(events.add).toHaveBeenCalled();
    expect(events.add.mostRecentCall.args[0].event).toEqual(getWebPlatformEventName(e));
    expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
}

function testUnRegisterEvent(e) {
    var args = {eventName : encodeURIComponent(e)};

    eventExt.remove(null, null, args);
    expect(events.remove).toHaveBeenCalled();
    expect(events.remove.mostRecentCall.args[0].event).toEqual(getWebPlatformEventName(e));
    expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
}

describe("app index", function () {

    beforeEach(function () {
        config = require(_libDir + "config");
        index = require(_apiDir + "index");
        mockedMinimize = jasmine.createSpy("minimize");
        mockedExit = jasmine.createSpy("exit");
        mockedRotate = jasmine.createSpy();
        mockedLockRotation = jasmine.createSpy();
        mockedUnlockRotation = jasmine.createSpy();
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                getApplication: function () {
                    return {
                        minimizeWindow: mockedMinimize,
                        exit: mockedExit,
                        rotate: mockedRotate,
                        lockRotation: mockedLockRotation,
                        unlockRotation: mockedUnlockRotation
                    };
                }
            }
        };
    });

    afterEach(function () {
        config = null;
        index = null;
        mockedMinimize = null;
        mockedExit = null;
        mockedRotate = null;
        mockedLockRotation = null;
        mockedUnlockRotation = null;
    });

    describe("getReadOnlyFields", function () {
        it("can call success", function () {
            var success = jasmine.createSpy(),
                expectedReturn = {
                    author : "Me",
                    authorEmail : "guocat@gmail.com",
                    authorURL : "http://bbtools_win7_01/yui",
                    copyright : "@Rebecca",
                    description : "this is the description",
                    id : "",
                    license : "This is a license",
                    licenseURL : "",
                    name : "wwTest",
                    version : "1.0.0.0"
                };
            index.getReadOnlyFields(success, null, null, null);
            expect(success).toHaveBeenCalledWith(expectedReturn);
        });
    });

    describe("lockOrientation", function () {
        it("calls webplatform rotate and lock methods", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                mockArgs = { orientation : encodeURIComponent("\"landscape-primary\"") };

            index.lockOrientation(success, fail, mockArgs, null);
            expect(fail).not.toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(true);
            expect(mockedRotate).toHaveBeenCalledWith("left_up");
        });
    });

    describe("unlockOrientation", function () {
        it("calls webplatform unlockRotation method", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            index.unlockOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedUnlockRotation).toHaveBeenCalled();
        });
    });

    describe("rotate", function () {
        it("calls webplatform rotate method", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            index.rotate(success, fail, {orientation: encodeURIComponent("\"landscape\"")}, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(mockedRotate).toHaveBeenCalledWith('left_up');
        });
    });

    describe("currentOrientation", function () {
        it("converts 0 degrees from window.orientation to portrait-primary", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            GLOBAL.window.orientation = 0;

            index.currentOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalledWith("portrait-primary");
        });

        it("converts 90 degrees from window.orientation to portrait-primary", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            GLOBAL.window.orientation = 90;

            index.currentOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalledWith("landscape-secondary");
        });

        it("converts 180 degrees from window.orientation to portrait-primary", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            GLOBAL.window.orientation = 180;

            index.currentOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalledWith("portrait-secondary");
        });

        it("converts -90 degrees from window.orientation to portrait-primary", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            GLOBAL.window.orientation = -90;

            index.currentOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalledWith("landscape-primary");
        });

        it("converts 270 degrees from window.orientation to portrait-primary", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();
            GLOBAL.window.orientation = 270;
            index.currentOrientation(success, fail, null, null);
            expect(success).toHaveBeenCalledWith("landscape-primary");
        });
    });

    describe("minimize", function () {
        it("can call minimize on the qnx.weblplatform Application", function () {
            var success = jasmine.createSpy();
            index.minimize(success, null, null, null);
            expect(mockedMinimize).toHaveBeenCalled();
        });
    });

    describe("exit", function () {
        it("can call exit on the qnx.weblplatform Application", function () {
            var success = jasmine.createSpy();
            index.exit(success, null, null, null);
            expect(mockedExit).toHaveBeenCalled();
        });
    });

    describe("events", function () {
        beforeEach(function () {
            spyOn(events, "add");
            spyOn(events, "remove");
        });

        it("can register 'pause' event", function () {
            testRegisterEvent("pause");
        });

        it("can register 'resume' event", function () {
            testRegisterEvent("resume");
        });

        it("can register 'swipedown' event", function () {
            testRegisterEvent("swipedown");
        });

        it("can register 'keyboardOpening' event", function () {
            testRegisterEvent("keyboardOpening");
        });

        it("can register 'keyboardOpened' event", function () {
            testRegisterEvent("keyboardOpened");
        });

        it("can register 'keyboardClosing' event", function () {
            testRegisterEvent("keyboardClosing");
        });

        it("can register 'keyboardClosed' event", function () {
            testRegisterEvent("keyboardClosed");
        });

        it("can register 'keyboardPosition' event", function () {
            testRegisterEvent("keyboardPosition");
        });

        it("can un-register 'pause' event", function () {
            testUnRegisterEvent("pause");
        });

        it("can un-register 'resume' event", function () {
            testUnRegisterEvent("resume");
        });

        it("can un-register 'swipedown' event", function () {
            testUnRegisterEvent("swipedown");
        });

        it("can un-register 'keyboardOpening' event", function () {
            testUnRegisterEvent("keyboardOpening");
        });

        it("can un-register 'keyboardOpened' event", function () {
            testUnRegisterEvent("keyboardOpened");
        });

        it("can un-register 'keyboardClosing' event", function () {
            testUnRegisterEvent("keyboardClosing");
        });

        it("can un-register 'keyboardClosed' event", function () {
            testUnRegisterEvent("keyboardClosed");
        });

        it("can un-register 'keyboardPosition' event", function () {
            testUnRegisterEvent("keyboardPosition");
        });
    });
});
