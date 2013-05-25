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

describe("calendar cards", function () {
    var onDone,
        onCancel,
        waitTimeout = 4000,
        invokeCallback = function (e) {
            if (e) {
                console.log(e);
            }
        };

    beforeEach(function () {
        onDone = jasmine.createSpy();
        onCancel = jasmine.createSpy();
    });

    afterEach(function () {
        onDone = null;
        onCancel = null;
    });


    it("opens and cancels calendarPicker", function () {
        blackberry.invoke.card.invokeCalendarPicker({}, onDone, onCancel, invokeCallback);
        waits(waitTimeout);
        runs(function () {
            internal.automation.touchTopLeft();
            waits(waitTimeout);
            runs(function () {
                expect(onCancel).toHaveBeenCalledWith('cancel');
            });
        });
    });

    it("opens and cancels calendarComposer", function () {
        blackberry.invoke.card.invokeCalendarComposer({}, onDone, onCancel, invokeCallback);
        waits(waitTimeout);
        runs(function () {
            internal.automation.touchTopLeft();
            waits(waitTimeout);
            runs(function () {
                expect(onDone).toHaveBeenCalled();
            });
        });
    });

    it("creates event in composer then searches for and picks it in picker", function () {
        var pickedVcs,
            flag = false,
            eventSubject = "X24df42",
            partialVcs = "BEGIN:VCALENDAR",
            composerDone = jasmine.createSpy("composer done"),
            composerCancel = jasmine.createSpy("composer cancel"),
            pickerDone = jasmine.createSpy("picker done").andCallFake(function (vcs) {
                pickedVcs = vcs;
                flag = true;
            }),
            pickerCancel = jasmine.createSpy("picker cancel"),
            formatDate = function (s) {
                return s.substring(0, 10) + s.substring(15, s.length) + s.substring(10, 15);
            },
            meetingStartTime = new Date();

        meetingStartTime.setMonth(meetingStartTime.getMonth() + 10);

        blackberry.invoke.card.invokeCalendarComposer({
            accountId: 0,
            startTime: formatDate(meetingStartTime.toString().slice(0, -15)),
            duration: 20
        }, composerDone, composerCancel, invokeCallback);
        waits(waitTimeout);
        runs(function () {
            internal.automation.touch(screen.availWidth / 2, 250);
            waits(waitTimeout / 2);
            runs(function () {
                internal.automation.touch(screen.availWidth / 2, 250);
                waits(waitTimeout / 2);
                runs(function () {
                    internal.automation.injectText(eventSubject);
                    waits(waitTimeout);
                    runs(function () {
                        internal.automation.touchTopRight();
                        waits(waitTimeout / 2);
                        runs(function () {
                            blackberry.invoke.card.invokeCalendarPicker({}, pickerDone, pickerCancel, invokeCallback);
                            waits(waitTimeout);
                            runs(function () {
                                internal.automation.touchBottomRight();
                                waits(waitTimeout / 2);
                                runs(function () {
                                    internal.automation.injectText(eventSubject);
                                    waits(waitTimeout);
                                    runs(function () {
                                        internal.automation.touch(screen.availWidth / 2, 400);
                                        waits(waitTimeout / 2);
                                        runs(function () {
                                            expect(pickerDone).toHaveBeenCalled();
                                            waitsFor(function () {
                                                return flag;
                                            });
                                            runs(function () {
                                                expect(pickerCancel).not.toHaveBeenCalled();
                                                expect(pickedVcs.indexOf(partialVcs)).toEqual(0);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
