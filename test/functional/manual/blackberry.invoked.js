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
var onSuccess,
    onError,
    onSuccessFlag,
    onErrorFlag,
    delay = 750;

describe("blackberry.invoked", function () {
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

    describe("Cards", function () {
        var request = {
                target: "net.rim.webworks.invoke.invoke.card.type",
            },
            onCardResize,
            onCardClosed,
            confirm;

        beforeEach(function () {
            onCardResize = jasmine.createSpy("onCardResize event");
            onCardClosed = jasmine.createSpy("onCardClosed event");
            blackberry.event.addEventListener("onCardResize", onCardResize);
            blackberry.event.addEventListener("onCardClosed", onCardClosed);
        });

        afterEach(function () {
            onCardResize = null;
            onCardClosed = null;
            blackberry.event.removeEventListener("onCardResize", onCardResize);
            blackberry.event.removeEventListener("onCardClosed", onCardClosed);
            confirm = null;
        });

        it('should be able to call cardResizeDone to perform peek', function () {
            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Rotate screen on card and then select cardResizeDone.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay * 5);

                    runs(function () {
                        confirm = window.confirm("Was you able to select cardResizeDone?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });

        it('should be able to call cardStartPeek to perform peek', function () {
            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Select card peek when card is shown to perform peek.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay);

                    runs(function () {
                        confirm = window.confirm("Was you able to perform a peek?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });

        it('should be able to call cardRequestClosure to close the card', function () {
            var request = {
                    reason: "Testing cardRequestClosure method",
                    type: "type/any",
                    data: "Not that time"
                };

            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Select close button when card in shown.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay);

                    runs(function () {
                        confirm = window.confirm("Was you able to close card by pressing close button?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });

        it('invoke should receive invoked event when invoking other card', function () {
            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Register for invoked event, unregister from it and close card at the end.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay * 10);

                    runs(function () {
                        confirm = window.confirm("Was you able to receive invoked info?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });

        it('invoke should receive onCardResize event when child card was closed', function () {
            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Register for onCardResize rotate screen than unregister from event and close card at the end.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay * 15);

                    runs(function () {
                        confirm = window.confirm("Was info onCardResize accurate?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });

        it('invoke should receive onCardClosed event when child card was closed', function () {
            request.target = "net.rim.webworks.invoke.invoke.card.type";

            alert("Register for onCardClosed event then select close the card.");

            try {
                blackberry.invoke.invoke(request, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }

            waitsFor(function () {
                return onSuccessFlag || onErrorFlag;
            }, "The callback flag should be set to true", delay);

            runs(function () {
                expect(onSuccessFlag).toEqual(true);
                if (onSuccessFlag) {
                    waits(delay * 15);

                    runs(function () {
                        confirm = window.confirm("Was onCardClosed triggered with an accurate info?");
                        expect(confirm).toEqual(true);
                    });
                }
            });
        });
    });
});
