/*
 * Copyright 2012-2013 Research In Motion Limited.
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


describe("blackberry.ui.toast", function () {

    describe("Can display toasts", function () {

        it("should display simple toast", function () {
            var successFlag,
                callback = jasmine.createSpy().andCallFake(function (success) {
                    successFlag = success;
                });
            internal.automation.compareCurrentScreen('Toast1.bmp', callback);
            waits(500);
            runs(function () {
                showOverlay();
                blackberry.ui.toast.show("I am a Brown Toast");
                waits(2000);
                runs(function () {
                    waitsFor(function () {
                        return callback.callCount;
                    }, 10000);
                    runs(function () {
                        expect(successFlag).toBe("true");
                        hideOverlay();
                    });
                });
            });
        });

        it("should display simple toast with a button", function () {
            var successFlag,
                callback = jasmine.createSpy().andCallFake(function (success) {
                    successFlag = success;
                });
            internal.automation.compareCurrentScreen('Toast2.bmp', callback);
            waits(500);
            runs(function () {
                showOverlay();
                blackberry.ui.toast.show("I am a Brown Toast", {buttonText : "Click Me"});
                waits(4000);
                runs(function () {
                    waitsFor(function () {
                        return callback.callCount;
                    }, 10000);
                    runs(function () {
                        expect(successFlag).toBe("true");
                        hideOverlay();
                    });
                });
            });
        });
    });

    describe("callbacks for toasts", function () {
        it("should be able to click on toast and get a callback", function () {
            var id,
                callback = jasmine.createSpy();

            showOverlay();
            id = blackberry.ui.toast.show("I am a Brown Toast", {buttonText : "Click Me", buttonCallback : callback});
            waits(500);
            runs(function () {
                internal.automation.touch(screen.availHeight / 2, (screen.availWidth * 3 / 4) + 20);
                waitsFor(function () {
                    return callback.callCount;
                }, 10000);
                runs(function () {
                    expect(id).toEqual(jasmine.any(Number));
                    expect(callback).toHaveBeenCalledWith();
                    hideOverlay();
                });
            });
        });

        it("should be able to get a callback when the toast is dismissed on simple toast", function () {
            var id,
                callbackDismissed = jasmine.createSpy();

            showOverlay();
            id = blackberry.ui.toast.show("I am a Brown Toast", {buttonText : "Click Me", dismissCallback : callbackDismissed});
            waitsFor(function () {
                return callbackDismissed.callCount;
            }, 10000);
            runs(function () {
                expect(id).toEqual(jasmine.any(Number));
                expect(callbackDismissed).toHaveBeenCalledWith();
                hideOverlay();
            });
        });

        it("should be able to get a callback when the toast is dismissed on simple toast", function () {
            var id,
                callbackButton = jasmine.createSpy(),
                callbackDismissed = jasmine.createSpy();

            showOverlay();
            id = blackberry.ui.toast.show("I am a Brown Toast", {buttonText : "Click Me", dismissCallback : callbackDismissed, buttonCallback : callbackButton});
            waitsFor(function () {
                return callbackButton.callCount || callbackDismissed.callCount;
            }, 10000);
            runs(function () {
                expect(id).toEqual(jasmine.any(Number));
                expect(callbackButton).not.toHaveBeenCalled();
                expect(callbackDismissed).toHaveBeenCalledWith();
                hideOverlay();
            });
        });
    });
});
