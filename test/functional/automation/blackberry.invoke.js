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

describe("blackberry.invoke", function () {
    var onSuccess,
        onError,
        onSuccessFlag,
        onErrorFlag,
        invokeWait = 3000,
        invokeCardWait = invokeWait * 3,
        uiGestureWait = 750;

    beforeEach(function () {
        spyOn(window.webworks.event, 'isOn').andReturn(false);
        onSuccessFlag = false;
        onErrorFlag = false;
        onSuccess = jasmine.createSpy("success callback").andCallFake(
            function () {
                onSuccessFlag = true;
            });
        onError = jasmine.createSpy("error callback").andCallFake(
            function () {
                onErrorFlag = true;
            });
    });

    afterEach(function () {
        onSuccess = null;
        onError = null;
        onSuccessFlag = false;
        onErrorFlag = false;
    });

    it('invoke should invoke google.com with unbound invocation', function () {
        var request = {
            uri: "http://www.google.com"
        };

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }
        waits(invokeWait);
        runs(function () {
            expect(internal.automation.getForegroundAppInfo().label).toEqual("Browser");
            internal.automation.swipeUp();
            waits(uiGestureWait);
            runs(function () {
                internal.automation.touchTopRightAppTile();
                waits(uiGestureWait);
                runs(function () {
                    expect(internal.automation.getForegroundAppInfo().label).toEqual("WebWorks Test App-en");
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onError).not.toHaveBeenCalled();
                });
            });
        });
    });

    it('invoke should invoke google.com with bound invocation', function () {
        var request = {
            target: "sys.browser",
            uri: "http://www.google.com"
        };

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }
        waits(invokeWait);
        runs(function () {
            expect(internal.automation.getForegroundAppInfo().label).toEqual("Browser");
            internal.automation.swipeUp();
            waits(uiGestureWait);
            runs(function () {
                internal.automation.touchTopRightAppTile();
                waits(uiGestureWait);
                runs(function () {
                    expect(internal.automation.getForegroundAppInfo().label).toEqual("WebWorks Test App-en");
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onError).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe("Cards", function () {
        var request = {
            target: "com.webworks.test.functional.invoke.card.target",
        },
        onChildCardClosed,
        onChildCardStartPeek,
        onChildCardEndPeek;

        beforeEach(function () {
            onChildCardClosed = jasmine.createSpy("onChildCardClosed event");
            onChildCardStartPeek = jasmine.createSpy("onChildCardStartPeek event");
            onChildCardEndPeek = jasmine.createSpy("onChildCardEndPeek event");
            blackberry.event.addEventListener("onChildCardClosed", onChildCardClosed);
            blackberry.event.addEventListener("onChildCardStartPeek", onChildCardStartPeek);
            blackberry.event.addEventListener("onChildCardEndPeek", onChildCardEndPeek);
        });

        afterEach(function () {
            onChildCardClosed = null;
            onChildCardStartPeek = null;
            onChildCardEndPeek = null;
            blackberry.event.removeEventListener("onChildCardClosed", onChildCardClosed);
            blackberry.event.removeEventListener("onChildCardStartPeek", onChildCardStartPeek);
            blackberry.event.removeEventListener("onChildCardEndPeek", onChildCardEndPeek);
        });

        it('invoke should invoke card, and close it with closeChildCard', function () {
            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }
            waits(invokeCardWait);
            runs(function () {
                expect(internal.automation.getForegroundAppInfo()["total-cards"]).toEqual("1");
                expect(internal.automation.getForegroundAppInfo()["label-card0"]).toEqual("WebWorks Test App-en");
                blackberry.invoke.closeChildCard();
                waitsFor(function () {
                    return onChildCardClosed.callCount;
                });
                runs(function () {
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onError).not.toHaveBeenCalled();
                    expect(internal.automation.getForegroundAppInfo()["total-cards"]).toEqual("0");
                });
            });
        });

        it('invoke should not invoke card whith invalid target name', function () {
            request.target = "com.webworks.test.functional.invoke.card.invalid.target";
            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }
            waits(500);
            runs(function () {
                expect(internal.automation.getForegroundAppInfo()["total-cards"]).toEqual("0");
                expect(onSuccess).not.toHaveBeenCalled();
                expect(onError).toHaveBeenCalled();
            });
        });
    });
});
