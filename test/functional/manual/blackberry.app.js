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
    var waitForTimeout = 15000;
    
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
            window.confirm("Changed settings General -> Application Behavior to 'Paused', then thumbnail this app");

            waitsFor(function () {
                return onPause.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onPause).toHaveBeenCalled();
            });
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
            window.confirm("Changed settings General -> Application Behavior to 'Paused', thumbnail this app, then tap it to make it fullscreen");

            waitsFor(function () {
                return onResume.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onResume).toHaveBeenCalled();
            });
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
            window.confirm("Swipe down from the top of the application");

            waitsFor(function () {
                return onSwipeDown.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSwipeDown).toHaveBeenCalled();
            });
        });
    });
    
});
