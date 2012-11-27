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

/*global internal */

function testAppValue(field, value) {
    expect(blackberry.app[field]).toBeDefined();
    expect(blackberry.app[field]).toEqual(value);
}

function testAppReadOnly(field) {
    var before = blackberry.app[field];
    blackberry.app[field] = "MODIFIED";
    expect(blackberry.app[field]).toEqual(before);
}

describe("blackberry.app", function () {
    var waitForTimeout = 2000;

    describe("pause", function () {
        var onPause;

        beforeEach(function () {
            onPause = jasmine.createSpy();
            blackberry.event.addEventListener("pause", onPause);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("pause", onPause);
            onPause = null;
        });

        it("should invoke callback when application is thumbnailed when Application Behavior is 'Paused'", function () {
            waitsFor(function () {
                return onPause.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onPause).toHaveBeenCalled();
            });

            internal.automation.swipeUp();
        });
    });

    describe("resume", function () {
        var onResume;

        beforeEach(function () {
            onResume = jasmine.createSpy();
            blackberry.event.addEventListener("resume", onResume);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("resume", onResume);
            onResume = null;
        });


        it("should invoke callback when application is fullscreened when Application Behavior is 'Paused'", function () {
            waitsFor(function () {
                return onResume.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onResume).toHaveBeenCalled();
                waits(2000);
            });

            internal.automation.touch(300, 300);
        });
    });

    describe("minimize", function () {
        var onPause;

        beforeEach(function () {
            onPause = jasmine.createSpy();
            blackberry.event.addEventListener("pause", onPause);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("pause", onPause);
            onPause = null;
        });

        it("should invoke pause when application is minimzied", function () {
            waitsFor(function () {
                return onPause.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onPause).toHaveBeenCalled();
                internal.automation.touch(300, 300);
                waits(2000);
            });

            blackberry.app.minimize();
        });
    });


    describe("swipedown", function () {
        var onSwipeDown;

        beforeEach(function () {
            onSwipeDown = jasmine.createSpy();
            blackberry.event.addEventListener("swipedown", onSwipeDown);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("swipedown", onSwipeDown);
            onSwipeDown = null;
        });

        it("should invoke callback when user swipes down from within application", function () {
            internal.automation.swipeDown();

            waitsFor(function () {
                return onSwipeDown.callCount;
            }, "event never fired", waitForTimeout * 2);

            runs(function () {
                expect(onSwipeDown).toHaveBeenCalled();
            });

        });
    });

    describe("orientation", function () {
        var onOrientationChange;

        beforeEach(function () {
            onOrientationChange = jasmine.createSpy();
            blackberry.event.addEventListener("orientationchange", onOrientationChange);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("orientationchange", onOrientationChange);
            onOrientationChange = null;
        });

        it("should invoke callback with landscape-primary when user rotates the phone counter-clockwise from within application", function () {
            internal.automation.rotate("LEFT_UP");
            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout * 2);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("landscape-primary");
            });
        });

        it("should invoke callback with landscape-secondary when user rotates the phone clockwise from within application", function () {
            internal.automation.rotate("RIGHT_UP");

            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout * 2);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("landscape-secondary");
            });
        });

        it("should invoke callback with portrait-primary when user rotates the phone back to normal position from within application", function () {
            internal.automation.rotate("TOP_UP");

            waitsFor(function () {
                return onOrientationChange.callCount;
            }, "event never fired", waitForTimeout * 2);

            runs(function () {
                expect(onOrientationChange).toHaveBeenCalledWith("portrait-primary");
            });
        });


        it("should be able to lock orientation and still listen to the event", function () {

            blackberry.app.lockOrientation("portrait-primary");

            waits(4000);

            runs(function () {
                internal.automation.rotate("RIGHT_UP");
                waitsFor(function () {
                    return onOrientationChange.callCount;
                }, "event never fired", waitForTimeout * 2);

                runs(function () {
                    expect(onOrientationChange).toHaveBeenCalledWith("landscape-secondary");
                    expect(blackberry.app.orientation).toBe("landscape-secondary");
                    expect(window.orientation).toBe(0);
                });
            });
        });

        it("should be able to unlock orientation and still listen to the event", function () {
            waits(2000);
            runs(function () {
                blackberry.app.unlockOrientation();

                waitsFor(function () {
                    return onOrientationChange.callCount;
                }, "event never fired", waitForTimeout * 2);

                runs(function () {
                    expect(onOrientationChange).toHaveBeenCalledWith("landscape-secondary");
                    expect(blackberry.app.orientation).toBe("landscape-secondary");
                    waits(4000);
                    runs(function () {
                        expect(window.orientation).toBe(90);
                    });
                });
            });
        });

        it("should have the correct orientation set", function () {
            waits(2000);
            runs(function () {
                internal.automation.rotate("LEFT_UP");
                waits(2000);
                runs(function () {
                    expect(blackberry.app.orientation).toBe("landscape-primary");
                    internal.automation.rotate("TOP_UP");
                });
            });

        });

        it("should have the correct orientation set", function () {
            waits(2000);
            runs(function () {
                internal.automation.rotate("RIGHT_UP");
                waits(2000);
                runs(function () {
                    expect(blackberry.app.orientation).toBe("landscape-secondary");
                    internal.automation.rotate("TOP_UP");
                });
            });

        });

    });

    describe("onKeyboard Events", function () {
        var onKeyboardOpening,
            onKeyboardOpened,
            onKeyboardClosing,
            onKeyboardClosed,
            onKeyboardPosition;

        beforeEach(function () {
            onKeyboardOpening = jasmine.createSpy();
            onKeyboardOpened = jasmine.createSpy();
            onKeyboardClosing = jasmine.createSpy();
            onKeyboardClosed = jasmine.createSpy();
            onKeyboardPosition = jasmine.createSpy();
            blackberry.event.addEventListener("keyboardOpening", onKeyboardOpening);
            blackberry.event.addEventListener("keyboardOpened", onKeyboardOpened);
            blackberry.event.addEventListener("keyboardClosing", onKeyboardClosing);
            blackberry.event.addEventListener("keyboardClosed", onKeyboardClosed);
            blackberry.event.addEventListener("keyboardPosition", onKeyboardPosition);

        });

        afterEach(function () {
            blackberry.event.removeEventListener("keyboardOpening", onKeyboardOpening);
            blackberry.event.removeEventListener("keyboardOpened", onKeyboardOpened);
            blackberry.event.removeEventListener("keyboardClosing", onKeyboardClosing);
            blackberry.event.removeEventListener("keyboardClosed", onKeyboardClosed);
            blackberry.event.removeEventListener("keyboardPosition", onKeyboardPosition);
            onKeyboardOpening = null;
            onKeyboardOpened = null;
            onKeyboardClosing = null;
            onKeyboardClosed = null;
            onKeyboardPosition = null;
        });

        it("should invoke callbacks when user opens keyboard", function () {

            waitsFor(function () {
                return onKeyboardOpening.callCount && onKeyboardOpened.callCount;
            }, "event never fired", waitForTimeout * 3);

            runs(function () {
                expect(onKeyboardOpening).toHaveBeenCalled();
                expect(onKeyboardOpened).toHaveBeenCalled();
                expect(onKeyboardPosition).toHaveBeenCalled();
            });

            internal.automation.showKeyboard();

        });

        it("should invoke callbacks when user closes keyboard", function () {

            waitsFor(function () {
                return onKeyboardClosing.callCount && onKeyboardClosed.callCount;
            }, "event never fired", waitForTimeout * 3);

            runs(function () {
                expect(onKeyboardClosing).toHaveBeenCalled();
                expect(onKeyboardClosed).toHaveBeenCalled();
            });
            internal.automation.hideKeyboard();
        });

    });

});
