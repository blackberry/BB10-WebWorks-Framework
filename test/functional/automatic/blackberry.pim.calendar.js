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

var cal,
    recEvent,
    CalendarEvent,
    CalendarFolder,
    CalendarFindOptions,
    CalendarEventFilter,
    CalendarError,
    CalendarRepeatRule,
    Attendee,
    calEvent,
    originalEventId,
    timeout = 20000,
    defaultFolder;

function testReadOnly(object, property) {
    var oldValue = object[property];
    object[property] = "test different";
    expect(object[property]).toBe(oldValue);
}

function findByEventsByPrefix(prefix, onFound, expandRecurring) {
    var filter = {
            "substring": prefix,
            "expandRecurring": !!expandRecurring
        },
        findOptions = {
            "filter": filter,
            "detail": CalendarFindOptions.DETAIL_FULL
        };

    cal.findEvents(
        findOptions,
        function (events) {
            if (onFound && typeof onFound === "function") {
                onFound(events);
            }
        }, function (error) {
            console.log("Failed to find events with prefix '" + prefix + "', error code=" + error.code);
        });
}

function deleteEventWithMatchingPrefix(prefix, callback) {
    var numEventsRemoved = 0,
        numEventsNotRemoved = 0,
        numEventsFound = -1,
        curIndex,
        successCb = function () {
            numEventsRemoved++;
            console.log("Current # events removed: " + numEventsRemoved);
        },
        errorCb = function (error) {
            console.log("Event not removed! error=" + error.code);
            numEventsNotRemoved++;
            console.log("Current # events not removed: " + numEventsNotRemoved);
        };

    findByEventsByPrefix(prefix, function (events) {
            numEventsFound = events.length;
            events.forEach(function (e, index) {
                curIndex = index;
                e.remove(successCb, errorCb);
                waitsFor(function () {
                    console.log("numEventsNotRemoved=" + numEventsNotRemoved + " numEventsRemoved=" + numEventsRemoved + " curIndex=" + curIndex);
                    return (numEventsNotRemoved + numEventsRemoved === curIndex + 1);
                }, "Event not removed", timeout);
            });
        });

    waitsFor(function () {
        return numEventsFound !== -1 && (numEventsRemoved + numEventsNotRemoved === numEventsFound);
    }, "Not all callbacks invoked", timeout);

    runs(function () {
        console.log("# events removed=" + numEventsRemoved + " # events found=" + numEventsFound);
        expect(numEventsRemoved).toBe(numEventsFound);
        callback(numEventsRemoved === numEventsFound);
    });
}

function createEventForFind(start, end, summary, location, allDay, callback) {
    var called = false,
        error = false,
        evt = cal.createEvent({
            "summary": summary,
            "location": location,
            "allDay": !!allDay,
            "start": start,
            "end": end
        });

    evt.save(function () {
        called = true;
    }, function (error) {
        error = true;
        called = true;
    });

    waitsFor(function () {
        return called;
    }, "Event not saved", timeout);

    runs(function () {
        if (callback && typeof callback === "function") {
            callback(called && !error);
        }
    });
}

function isDefaultFolderAccessible() {
    return !!defaultFolder;
}

beforeEach(function () {
    cal = blackberry.pim.calendar;
    CalendarEvent = cal.CalendarEvent;
    CalendarFolder = cal.CalendarFolder;
    CalendarFindOptions = cal.CalendarFindOptions;
    CalendarEventFilter = cal.CalendarEventFilter;
    CalendarError = cal.CalendarError;
    CalendarRepeatRule = cal.CalendarRepeatRule;
    Attendee = cal.Attendee;
});

describe("blackberry.pim.calendar", function () {
    describe("Object and constants definitions", function () {
        it('blackberry.pim.calendar should exist', function () {
            expect(cal).toBeDefined();
        });

        it('blackberry.pim.calendar child objects should exist', function () {
            expect(CalendarEvent).toBeDefined();
            expect(CalendarFolder).toBeDefined();
            expect(CalendarFindOptions).toBeDefined();
            expect(CalendarEventFilter).toBeDefined();
            expect(CalendarError).toBeDefined();
            expect(Attendee).toBeDefined();
            expect(CalendarRepeatRule).toBeDefined();
        });

        it('blackberry.pim.calendar.CalendarFindOptions constants should exist', function () {
            expect(CalendarFindOptions.SORT_FIELD_SUMMARY).toBeDefined();
            expect(CalendarFindOptions.SORT_FIELD_LOCATION).toBeDefined();
            expect(CalendarFindOptions.SORT_FIELD_START).toBeDefined();
            expect(CalendarFindOptions.SORT_FIELD_END).toBeDefined();
            expect(CalendarFindOptions.DETAIL_MONTHLY).toBeDefined();
            expect(CalendarFindOptions.DETAIL_WEEKLY).toBeDefined();
            expect(CalendarFindOptions.DETAIL_FULL).toBeDefined();
            expect(CalendarFindOptions.DETAIL_AGENDA).toBeDefined();
        });

        it('blackberry.pim.calendar.CalendarFindOptions constants should be read-only', function () {
            testReadOnly(CalendarFindOptions, "SORT_FIELD_SUMMARY");
            testReadOnly(CalendarFindOptions, "SORT_FIELD_LOCATION");
            testReadOnly(CalendarFindOptions, "SORT_FIELD_START");
            testReadOnly(CalendarFindOptions, "SORT_FIELD_END");
            testReadOnly(CalendarFindOptions, "DETAIL_MONTHLY");
            testReadOnly(CalendarFindOptions, "DETAIL_WEEKLY");
            testReadOnly(CalendarFindOptions, "DETAIL_FULL");
            testReadOnly(CalendarFindOptions, "DETAIL_AGENDA");
        });

        it('blackberry.pim.calendar.CalendarError constants should exist', function () {
            expect(CalendarError.UNKNOWN_ERROR).toBeDefined();
            expect(CalendarError.INVALID_ARGUMENT_ERROR).toBeDefined();
            expect(CalendarError.TIMEOUT_ERROR).toBeDefined();
            expect(CalendarError.PENDING_OPERATION_ERROR).toBeDefined();
            expect(CalendarError.IO_ERROR).toBeDefined();
            expect(CalendarError.NOT_SUPPORTED_ERROR).toBeDefined();
            expect(CalendarError.PERMISSION_DENIED_ERROR).toBeDefined();
        });

        it('blackberry.pim.calendar.CalendarError constants should be read-only', function () {
            testReadOnly(CalendarError, "UNKNOWN_ERROR");
            testReadOnly(CalendarError, "INVALID_ARGUMENT_ERROR");
            testReadOnly(CalendarError, "TIMEOUT_ERROR");
            testReadOnly(CalendarError, "PENDING_OPERATION_ERROR");
            testReadOnly(CalendarError, "IO_ERROR");
            testReadOnly(CalendarError, "NOT_SUPPORTED_ERROR");
            testReadOnly(CalendarError, "PERMISSION_DENIED_ERROR");
        });

        it('blackberry.pim.calendar.CalendarRepeatRule constants should exist', function () {
            expect(CalendarRepeatRule.SUNDAY).toBeDefined();
            expect(CalendarRepeatRule.MONDAY).toBeDefined();
            expect(CalendarRepeatRule.TUESDAY).toBeDefined();
            expect(CalendarRepeatRule.WEDNESDAY).toBeDefined();
            expect(CalendarRepeatRule.THURSDAY).toBeDefined();
            expect(CalendarRepeatRule.FRIDAY).toBeDefined();
            expect(CalendarRepeatRule.SATURDAY).toBeDefined();
            expect(CalendarRepeatRule.LAST_DAY_IN_MONTH).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_DAILY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_WEEKLY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_MONTHLY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_MONTHLY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_YEARLY).toBeDefined();
            expect(CalendarRepeatRule.FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH).toBeDefined();
        });

        it('blackberry.pim.calendar.CalendarRepeatRule constants should be read-only', function () {
            testReadOnly(CalendarRepeatRule, "SUNDAY");
            testReadOnly(CalendarRepeatRule, "MONDAY");
            testReadOnly(CalendarRepeatRule, "TUESDAY");
            testReadOnly(CalendarRepeatRule, "WEDNESDAY");
            testReadOnly(CalendarRepeatRule, "THURSDAY");
            testReadOnly(CalendarRepeatRule, "FRIDAY");
            testReadOnly(CalendarRepeatRule, "SATURDAY");
            testReadOnly(CalendarRepeatRule, "LAST_DAY_IN_MONTH");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_DAILY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_WEEKLY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_MONTHLY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_MONTHLY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_MONTHLY_AT_A_WEEK_DAY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_YEARLY");
            testReadOnly(CalendarRepeatRule, "FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH");
        });

        it('blackberry.pim.calendar.CalendarEvent constants should exist', function () {
            expect(CalendarEvent.SENSITIVITY_NORMAL).toBeDefined();
            expect(CalendarEvent.SENSITIVITY_PERSONAL).toBeDefined();
            expect(CalendarEvent.SENSITIVITY_PRIVATE).toBeDefined();
            expect(CalendarEvent.SENSITIVITY_CONFIDENTIAL).toBeDefined();
            expect(CalendarEvent.TRANSPARENCY_FREE).toBeDefined();
            expect(CalendarEvent.TRANSPARENCY_TENTATIVE).toBeDefined();
            expect(CalendarEvent.TRANSPARENCY_BUSY).toBeDefined();
            expect(CalendarEvent.TRANSPARENCY_OUT_OF_OFFICE).toBeDefined();
        });

        it('blackberry.pim.calendar.CalendarEvent constants should be read-only', function () {
            testReadOnly(CalendarEvent, "SENSITIVITY_NORMAL");
            testReadOnly(CalendarEvent, "SENSITIVITY_PERSONAL");
            testReadOnly(CalendarEvent, "SENSITIVITY_PRIVATE");
            testReadOnly(CalendarEvent, "SENSITIVITY_CONFIDENTIAL");
            testReadOnly(CalendarEvent, "TRANSPARENCY_FREE");
            testReadOnly(CalendarEvent, "TRANSPARENCY_TENTATIVE");
            testReadOnly(CalendarEvent, "TRANSPARENCY_BUSY");
            testReadOnly(CalendarEvent, "TRANSPARENCY_OUT_OF_OFFICE");
        });

        it('blackberry.pim.calendar.Attendee constants should exist', function () {
            expect(Attendee.TYPE_HOST).toBeDefined();
            expect(Attendee.TYPE_PARTICIPANT).toBeDefined();
            expect(Attendee.ROLE_CHAIR).toBeDefined();
            expect(Attendee.ROLE_REQUIRED_PARTICIPANT).toBeDefined();
            expect(Attendee.ROLE_OPTIONAL_PARTICIPANT).toBeDefined();
            expect(Attendee.ROLE_NON_PARTICIPANT).toBeDefined();
            expect(Attendee.STATUS_UNKNOWN).toBeDefined();
            expect(Attendee.STATUS_TENTATIVE).toBeDefined();
            expect(Attendee.STATUS_ACCEPTED).toBeDefined();
            expect(Attendee.STATUS_DECLINED).toBeDefined();
            expect(Attendee.STATUS_NOT_RESPONDED).toBeDefined();
        });

        it('blackberry.pim.calendar.Attendee constants should be read-only', function () {
            testReadOnly(Attendee, "TYPE_HOST");
            testReadOnly(Attendee, "TYPE_PARTICIPANT");
            testReadOnly(Attendee, "ROLE_CHAIR");
            testReadOnly(Attendee, "ROLE_REQUIRED_PARTICIPANT");
            testReadOnly(Attendee, "ROLE_OPTIONAL_PARTICIPANT");
            testReadOnly(Attendee, "ROLE_NON_PARTICIPANT");
            testReadOnly(Attendee, "STATUS_UNKNOWN");
            testReadOnly(Attendee, "STATUS_TENTATIVE");
            testReadOnly(Attendee, "STATUS_ACCEPTED");
            testReadOnly(Attendee, "STATUS_DECLINED");
            testReadOnly(Attendee, "STATUS_NOT_RESPONDED");
        });
    });

    describe("Child objects creation", function () {
        it('Can create blackberry.pim.calendar.CalendarEventFilter object', function () {
            var start = new Date(),
                end = new Date(),
                filter = new CalendarEventFilter({
                    "substring": "abc",
                    "start": start,
                    "end": end,
                    "expandRecurring": true
                });

            expect(filter).toBeDefined();
            expect(filter.substring).toBe("abc");
            expect(filter.folders).toBe(null);
            expect(filter.start).toBe(start);
            expect(filter.end).toBe(end);
            expect(filter.expandRecurring).toBe(true);
        });

        it('Can create blackberry.pim.calendar.CalendarFindOptions object', function () {
            var filter = new CalendarEventFilter({
                    "substring": "abc",
                    "start": new Date(),
                    "end": new Date(),
                    "expandRecurring": true
                }),
                sort = [{
                    "fieldName": CalendarFindOptions.SORT_FIELD_START,
                    "desc": false
                }],
                detail = CalendarFindOptions.DETAIL_FULL,
                limit = 5,
                options = new CalendarFindOptions({
                    "filter": filter,
                    "sort": sort,
                    "detail": detail,
                    "limit": limit
                });

            expect(options).toBeDefined();
            expect(options.filter.substring).toBe("abc");
            expect(options.filter.folders).toBe(null);
            expect(options.filter.expandRecurring).toBe(true);
            expect(options.sort.length).toBe(1);
            expect(options.sort).toContain({
                "fieldName": CalendarFindOptions.SORT_FIELD_START,
                "desc": false
            });
            expect(options.detail).toBe(detail);
            expect(options.limit).toBe(5);
        });

        it('Can create blackberry.pim.calendar.CalendarRepeatRule object', function () {
            var rule = new CalendarRepeatRule({
                "frequency": CalendarRepeatRule.FREQUENCY_WEEKLY,
                "numberOfOccurrences": 9,
                "expires": new Date("Dec 31, 2012")
            });

            expect(rule.frequency).toBe(CalendarRepeatRule.FREQUENCY_WEEKLY);
            expect(rule.numberOfOccurrences).toBe(9);
            expect(rule.expires.toISOString()).toBe(new Date("Dec 31, 2012").toISOString());
        });

        it('Can create blackberry.pim.calendar.Attendee object', function () {
            var attendee = new Attendee({
                "email": "abc@blah.com",
                "name": "John Doe",
                "role": Attendee.ROLE_REQUIRED_PARTICIPANT,
                "type": Attendee.TYPE_PARTICIPANT
            });

            expect(attendee.email).toBe("abc@blah.com");
            expect(attendee.name).toBe("John Doe");
            expect(attendee.role).toBe(Attendee.ROLE_REQUIRED_PARTICIPANT);
            expect(attendee.type).toBe(Attendee.TYPE_PARTICIPANT);
        });
    });

    describe("blackberry.pim.calendar.getDefaultCalendarFolder", function () {
        it('returns the default calendar folder', function () {
            defaultFolder = cal.getDefaultCalendarFolder();

            if (isDefaultFolderAccessible()) {
                expect(defaultFolder.default).toBeTruthy();
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("blackberry.pim.calendar.getCalendarAccounts", function () {
        it('returns at least one account', function () {
            var accounts = cal.getCalendarAccounts();

            expect(accounts).toBeDefined();
            expect(accounts.length).toBeGreaterThan(0);
        });
    });

    describe("blackberry.pim.calendar.getDefaultCalendarAccount", function () {
        it('returns the default calendar account', function () {
            var defaultAccount = cal.getDefaultCalendarAccount();

            if (isDefaultFolderAccessible()) {
                expect(defaultAccount).toBeDefined();
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("blackberry.pim.calendar.createEvents / save / remove", function () {
        it('should return a CalendarEvent object', function () {
            var start = new Date("Dec 31, 2012, 12:00"),
                end = new Date("Jan 01, 2013, 12:00"),
                summary = "WebWorksTest create event 1 (wwt001)",
                location = "Location 1";

            calEvent = cal.createEvent({
                "summary": summary,
                "location": location,
                "allDay": true,
                "start": start,
                "end": end
            });

            expect(calEvent).toBeDefined();
            expect(calEvent.summary).toBe(summary);
            expect(calEvent.location).toBe(location);
            expect(calEvent.allDay).toBeTruthy();
            expect(calEvent.start).toBe(start);
            expect(calEvent.end).toBe(end);
            expect(typeof calEvent.save).toBe("function");
            expect(typeof calEvent.remove).toBe("function");
            expect(typeof calEvent.createExceptionEvent).toBe("function");
        });

        it('can call save to persist the event on the device', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created).toBeDefined();
                        expect(typeof created.id).toBe("string");
                        expect(created.id).not.toBe("");
                        expect(created.start.toISOString()).toBe(new Date(Date.parse("Dec 31, 2012, 12:00")).toISOString());
                        expect(created.end.toISOString()).toBe(new Date(Date.parse("Jan 01, 2013, 12:00")).toISOString());
                        expect(created.allDay).toBeTruthy();
                        expect(created.summary).toBe("WebWorksTest create event 1 (wwt001)");
                        expect(created.location).toBe("Location 1");
                        calEvent = created;
                        originalEventId = calEvent.id;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy();

                calEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('saved event can be found by findEvents', function () {
            if (isDefaultFolderAccessible()) {
                var called = false;

                findByEventsByPrefix("wwt001", function (events) {
                    expect(events.length).toBe(1);

                    if (events.length === 1) {
                        expect(events[0].id).not.toBe("");
                        expect(events[0].start.toISOString()).toBe(new Date("Dec 31, 2012, 12:00").toISOString());
                        expect(events[0].end.toISOString()).toBe(new Date("Jan 01, 2013, 12:00").toISOString());
                        expect(events[0].allDay).toBeTruthy();
                        expect(events[0].summary).toBe("WebWorksTest create event 1 (wwt001)");
                        expect(events[0].location).toBe("Location 1");
                    }

                    called = true;
                });

                waitsFor(function () {
                    return called;
                }, "Find callback not called", timeout);
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can save event with some fields that contain double quotes', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 08, 2013, 11:00"),
                    end = new Date("Jan 08, 2013, 12:00"),
                    summary = "WebWorksTest quotes and multi-line (wwt002)",
                    location = "Location 1",
                    description = "This is a multi-line description\n\nWith \"quotes\"! http://www.rim.com\n",
                    called = false,
                    evt,
                    successCb = jasmine.createSpy().andCallFake(function (saved) {
                        expect(saved).toBeDefined();
                        expect(saved.description).toEqual(description.replace(/\n/g, "\\n"));
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                evt = cal.createEvent({
                    "summary": summary,
                    "location": location,
                    "start": start,
                    "end": end,
                    "description": description
                });
                evt.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('omitting start or end date causes save() to trigger error callback', function () {
            var start = new Date("Jan 08, 2013, 12:00"),
                summary = "No end date",
                location = "Location 1",
                called = false,
                evt,
                successCb = jasmine.createSpy().andCallFake(function (saved) {
                    called = true;
                }),
                errorCb = jasmine.createSpy().andCallFake(function (error) {
                    expect(error).toBeDefined();
                    expect(error.code).toEqual(CalendarError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            evt = cal.createEvent({
                "summary": summary,
                "location": location,
                "start": start
            });

            evt.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Event not saved to device calendar", timeout);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });

        it('end must not be before start', function () {
            var start = new Date("Jan 08, 2013, 12:00"),
                end = new Date("Jan 08, 2013, 11:00"),
                summary = "End before start",
                location = "Location 1",
                called = false,
                evt,
                successCb = jasmine.createSpy().andCallFake(function (saved) {
                    called = true;
                }),
                errorCb = jasmine.createSpy().andCallFake(function (error) {
                    expect(error).toBeDefined();
                    expect(error.code).toEqual(CalendarError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            evt = cal.createEvent({
                "summary": summary,
                "location": location,
                "start": start,
                "end": end
            });

            evt.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Event not saved to device calendar", timeout);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });

        it('can edit a saved event', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    newSummary = "WebWorksTest create event 1 modified (wwt003)",
                    newLocation = "Location 1 modified",
                    newStart = new Date("Dec 31, 2012, 11:30"),
                    newEnd = new Date("Dec 31, 2012, 11:45"),
                    newAllDay = false,
                    successCb = jasmine.createSpy().andCallFake(function (saved) {
                        expect(saved.id).toEqual(originalEventId);
                        expect(saved.summary).toBe(newSummary);
                        expect(saved.location).toBe(newLocation);
                        expect(saved.allDay).toBe(newAllDay);
                        expect(saved.start.toISOString()).toBe(new Date("Dec 31, 2012, 11:30").toISOString());
                        expect(saved.end.toISOString()).toBe(new Date("Dec 31, 2012, 11:45").toISOString());
                        calEvent = saved;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                calEvent.summary = newSummary;
                calEvent.location = newLocation;
                calEvent.allDay = newAllDay;
                calEvent.start = newStart;
                calEvent.end = newEnd;

                calEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('edited event can be found by findEvents', function () {
            if (isDefaultFolderAccessible()) {
                var called = false;

                findByEventsByPrefix("wwt003", function (events) {
                    expect(events.length).toBe(1);

                    if (events.length === 1) {
                        expect(events[0].id).not.toBe("");
                        expect(events[0].start.toISOString()).toBe(new Date("Dec 31, 2012, 11:30").toISOString());
                        expect(events[0].end.toISOString()).toBe(new Date("Dec 31, 2012, 11:45").toISOString());
                        expect(events[0].allDay).toBeFalsy();
                        expect(events[0].summary).toBe("WebWorksTest create event 1 modified (wwt003)");
                        expect(events[0].location).toBe("Location 1 modified");
                    }

                    called = true;
                });

                waitsFor(function () {
                    return called;
                }, "Find callback not called", timeout);
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can edit description/transparency/sensitivity', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    newDesc = "This description was added after the event was created.",
                    originalSummary = calEvent.summary,
                    originalLocation = calEvent.location,
                    originalAllDay = calEvent.allDay,
                    originalStart = calEvent.start,
                    originalEnd = calEvent.end,
                    successCb = jasmine.createSpy().andCallFake(function (saved) {
                        expect(saved.description).toEqual(newDesc);
                        expect(saved.transparency).toEqual(CalendarEvent.TRANSPARENCY_TENTATIVE);
                        expect(saved.sensitivity).toEqual(CalendarEvent.SENSITIVITY_CONFIDENTIAL);
                        expect(saved.id).toEqual(originalEventId);
                        expect(saved.summary).toBe(originalSummary);
                        expect(saved.location).toBe(originalLocation);
                        expect(saved.allDay).toBe(originalAllDay);
                        expect(saved.start.toISOString()).toBe(originalStart.toISOString());
                        expect(saved.end.toISOString()).toBe(originalEnd.toISOString());
                        calEvent = saved;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                calEvent.description = newDesc;
                calEvent.transparency = CalendarEvent.TRANSPARENCY_TENTATIVE;
                calEvent.sensitivity = CalendarEvent.SENSITIVITY_CONFIDENTIAL;
                calEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can call remove to remove the event from the device', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function () {
                        called = true;

                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                calEvent.remove(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Event not removed from device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('removed event cannot be found by findEvents', function () {
            if (isDefaultFolderAccessible()) {
                var called = false;

                findByEventsByPrefix("wwt003", function (events) {
                    expect(events.length).toBe(0);
                    called = true;
                });

                waitsFor(function () {
                    return called;
                }, "Find callback not called", timeout);
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('removing an event that has not been saved triggers error callback', function () {
            var start = new Date("Jan 08, 2013, 12:00"),
                end = new Date("Jan 08, 2013, 12:30"),
                summary = "Not saved yet",
                location = "Location 1",
                evt,
                called = false,
                successCb = jasmine.createSpy().andCallFake(function (saved) {
                    called = true;
                }),
                errorCb = jasmine.createSpy().andCallFake(function (error) {
                    expect(error).toBeDefined();
                    expect(error.code).toEqual(CalendarError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            evt = cal.createEvent({
                "summary": summary,
                "location": location,
                "start": start,
                "end": end
            });

            evt.remove(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Callbacks not triggered", timeout);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });
    });

    describe("Events with attendees", function () {
        it('Can create an event that has attendees', function () {
            if (isDefaultFolderAccessible()) {
                // Google Calendar has trouble with attendees
                var start = new Date("Jan 2, 2013, 12:00"),
                    end = new Date("Jan 2, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest event with attendees (wwt004)",
                    attendee1 = new Attendee({
                        "email": "abc@blah.com",
                        "name": "John Doe",
                        "owner": true,
                        "role": Attendee.ROLE_CHAIR,
                        "type": Attendee.TYPE_HOST
                    }),
                    attendee2 = new Attendee({
                        "email": "def@blah.com",
                        "name": "Jane Doe",
                        "owner": false,
                        "role": Attendee.ROLE_REQUIRED_PARTICIPANT,
                        "type": Attendee.TYPE_PARTICIPANT
                    }),
                    called = false,
                    evt,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.attendees).toBeDefined();
                        expect(created.attendees.length).toBeDefined();
                        expect(created.attendees.length).toBe(2);
                        called = true;
                    }),
                    errorCb = jasmine.createSpy(function (error) {
                        called = true;
                    });

                evt = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "attendees": [attendee1, attendee2]});
                evt.save(successCb, errorCb);
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can add attendees to an existing event', function () {
            if (isDefaultFolderAccessible()) {
                // Google Calendar has trouble with attendees
                var start = new Date("Feb 2, 2013, 12:00"),
                    end = new Date("Feb 2, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest event without attendees (wwt005)",
                    called = false,
                    found = false,
                    evt,
                    saveErrorCb1 = jasmine.createSpy("Save error callback 1").andCallFake(function (error) {
                        called = true;
                    }),
                    saveErrorCb2 = jasmine.createSpy("Save error callback 2").andCallFake(function (error) {
                        called = true;
                    }),
                    successCb1 = jasmine.createSpy("Success callback 1").andCallFake(function (saved) {
                        evt = saved;
                        called = true;
                    }),
                    successCb2 = jasmine.createSpy("Success callback 2").andCallFake(function () {
                        called = true;
                    }),
                    attendee = new Attendee({
                        "email": "abc@blah.com",
                        "name": "John Doe",
                        "owner": true,
                        "role": Attendee.ROLE_CHAIR,
                        "type": Attendee.TYPE_HOST
                    });

                evt = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end});
                evt.save(successCb1, saveErrorCb1);

                waitsFor(function () {
                    return called;
                }, "Event not saved", timeout);

                runs(function () {
                    expect(successCb1).toHaveBeenCalled();
                    expect(saveErrorCb1).not.toHaveBeenCalled();

                    called = false;
                    evt.summary = "WebWorksTest event with 1 attendee added (wwt005)";
                    evt.attendees = [attendee];
                    evt.save(successCb2, saveErrorCb2);
                });

                waitsFor(function () {
                    return called;
                }, "Attendee not added to event", timeout);

                runs(function () {
                    expect(successCb2).toHaveBeenCalled();
                    expect(saveErrorCb2).not.toHaveBeenCalled();

                    findByEventsByPrefix("wwt005", function (events) {
                        expect(events.length).toBe(1);

                        if (events.length === 1) {
                            expect(events[0].id).not.toBe("");
                            expect(events[0].start.toISOString()).toBe(new Date("Feb 2, 2013, 12:00").toISOString());
                            expect(events[0].end.toISOString()).toBe(new Date("Feb 2, 2013, 12:30").toISOString());
                            expect(events[0].allDay).toBeFalsy();
                            expect(events[0].summary).toBe("WebWorksTest event with 1 attendee added (wwt005)");
                            expect(events[0].location).toBe("some location");
                            expect(!!events[0].attendees).toBeTruthy();

                            if (!!events[0].attendees) {
                                expect(events[0].attendees.length).toBe(1);

                                if (events[0].attendees.length === 1) {
                                    expect(events[0].attendees[0].email).toBe("abc@blah.com");
                                    expect(events[0].attendees[0].name).toBe("John Doe");
                                }
                            }
                        }

                        found = true;
                    });
                });

                waitsFor(function () {
                    return found;
                }, "Event not found", timeout);
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("Recurring event", function () {
        it('Can save a monthly recurring event on device (no constructor)', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 6, 2014, 12:00"),
                    end = new Date("Jan 6, 2014, 12:30"),
                    location = "some location",
                    summary = "WebWorksTest recurring event no constructor (wwt005b)",
                    rule = {
                        "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY,
                        "expires": new Date("Dec 31, 2014"),
                        "numberOfOccurrences": 4
                    },
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(location);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY);
                        expect(created.recurrence.numberOfOccurrences).toBe(4);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": location, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can remove a single occurrence of a recurring event', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    foundEvents,
                    removeSuccessCb = jasmine.createSpy("Remove success callback").andCallFake(function () {
                        called = true;
                    }),
                    successCb = jasmine.createSpy("Find success callback").andCallFake(function (events) {
                        expect(events).toBeDefined();
                        expect(Array.isArray(events)).toBeTruthy();
                        foundEvents = events;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                cal.findEvents({
                    "filter": {
                        "substring": "wwt005b",
                        "expandRecurring": true
                    }
                }, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find event did not return", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    if (Array.isArray(foundEvents) && foundEvents.length === 4) {
                        called = false;
                        // remove the Feb occurence
                        foundEvents[1].remove(removeSuccessCb, errorCb, false);
                    } else {
                        this.fail(new Error("Should have found 4 occurrences"));
                    }
                });

                waitsFor(function () {
                    return called;
                }, "Remove did not return", timeout);

                runs(function () {
                    expect(removeSuccessCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    called = false;
                    cal.findEvents({
                        "filter": {
                            "substring": "wwt005b",
                            "expandRecurring": true
                        }
                    }, successCb, errorCb);
                });

                waitsFor(function () {
                    return called;
                }, "Find event did not return", timeout);

                runs(function () {
                    var starts = [];

                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    expect(Array.isArray(foundEvents)).toBeTruthy();
                    expect(foundEvents.length).toBe(3);

                    if (Array.isArray(foundEvents) && foundEvents.length === 3) {
                        foundEvents.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });
                    } else {
                        this.fail(new Error("Should have found 3 occurrences"));
                    }

                    expect(starts).toContain(new Date("Jan 6, 2014, 12:00").toISOString());
                    expect(starts).toContain(new Date("March 6, 2014, 12:00").toISOString());
                    expect(starts).toContain(new Date("April 6, 2014, 12:00").toISOString());
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        xit('Can save a recurring event that does not expire', function () {
            // TODO needs to check if this is a valid test
            var start = new Date("Dec 31, 2014, 12:00"),
                end = new Date("Dec 31, 2014, 12:30"),
                location = "some location",
                summary = "WebWorksTest recurring event never expires",
                rule = {
                    "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY,
                    "dayInMonth": CalendarRepeatRule.LAST_DAY_IN_MONTH
                },
                called = false,
                successCb2 = jasmine.createSpy().andCallFake(function (events) {
                    var found = false;
                    expect(events.length >= 1).toBeTruthy();
                    events.forEach(function (e) {
                        if (e.start.toISOString() === new Date("Jan 31, 2046, 12:00").toISOString() &&
                            e.end.toISOString() === new Date("Jan 31, 2046, 12:30").toISOString()) {
                            found = true;
                        }
                    });
                    expect(found).toBeTruthy();
                    called = true;
                }),
                successCb = jasmine.createSpy().andCallFake(function (created) {
                    expect(created.summary).toBe(summary);
                    expect(created.location).toBe(location);
                    expect(created.recurrence).toBeDefined();
                    expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY);
                    called = true;
                }),
                errorCb = jasmine.createSpy(function (error) {
                    called = true;
                }),
                evt;

            evt = cal.createEvent({"summary": summary, "location": location, "start": start, "end": end, "recurrence": rule});
            evt.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Recurring event not saved to device calendar", timeout);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();

                called = false;
                cal.findEvents({
                    "filter": {
                        "start": new Date("Jan 30, 2046"),
                        "end": new Date("Feb 1, 2046")
                    },
                    "expandRecurring": true
                }, successCb2, errorCb);
            });

            waitsFor(function () {
                return called;
            }, "Recurring event not found", timeout);

            runs(function () {
                expect(successCb2).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Can save a monthly recurring event on device', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 6, 2013, 12:00"),
                    end = new Date("Jan 6, 2013, 12:30"),
                    location = "some location",
                    summary = "WebWorksTest awesome recurring event (wwt006)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY,
                        "expires": new Date("Dec 31, 2013"),
                        "numberOfOccurrences": 4
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": location, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    if (recEvent) {
                        expect(recEvent.summary).toBe(summary);
                        expect(recEvent.location).toBe(location);
                        expect(recEvent.recurrence).toBeDefined();
                        expect(recEvent.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY);
                        expect(recEvent.recurrence.numberOfOccurrences).toBe(4);
                    }
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can find recurring event (with expandRecurring set to false)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    findOptions = {
                        "filter": {
                            "substring": "wwt006",
                            "expandRecurring": false
                        },
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                            expect(events.length).toBe(1); // only found original event if expand flag is set to false

                            if (events.length === 1) {
                                expect(events[0].summary).toBe(recEvent.summary);
                                expect(events[0].location).toBe(recEvent.location);
                                expect(events[0].start.toISOString()).toBe(recEvent.start.toISOString());
                                expect(events[0].end.toISOString()).toBe(recEvent.end.toISOString());
                            }

                            called = true;
                        }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can find recurring event (with expandRecurring set to true)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    findOptions = {
                        "filter": {
                            "substring": "wwt006",
                            "expandRecurring": true
                        },
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(4); // found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                            expect(evt.summary).toBe(recEvent.summary);
                            expect(evt.location).toBe(recEvent.location);
                            expect(evt.allDay).toBe(recEvent.allDay);
                        });

                        expect(starts).toContain(new Date("Jan 6, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 6, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Mar 6, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Apr 6, 2013, 12:00").toISOString());

                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can save a recurring event (with expires) on device', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 7, 2013, 12:00"),
                    end = new Date("Jan 7, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest awesome rec event binding expires (wwt007)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY,
                        "expires": new Date("Mar 30, 2013"),
                        "numberOfOccurrences": 4
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY);
                        expect(created.recurrence.numberOfOccurrences).toBe(4);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Expires in CalendarRepeatRule works', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    findOptions = {
                        "filter": {
                            "substring": "wwt007",
                            "expandRecurring": true
                        },
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(3); // found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                            expect(evt.summary).toBe(recEvent.summary);
                            expect(evt.location).toBe(recEvent.location);
                            expect(evt.allDay).toBe(recEvent.allDay);
                        });

                        expect(starts).toContain(new Date("Jan 7, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 7, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Mar 7, 2013, 12:00").toISOString());

                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can save a recurring event repeating on Mon/Wed every week', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 21, 2013, 12:00"),
                    end = new Date("Jan 21, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest every Mon and Wed (wwt008)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_WEEKLY,
                        "expires": new Date("Mar 30, 2013"),
                        "dayInWeek": CalendarRepeatRule.MONDAY | CalendarRepeatRule.WEDNESDAY
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_WEEKLY);
                        expect(created.recurrence.dayInWeek).toBe(CalendarRepeatRule.MONDAY | CalendarRepeatRule.WEDNESDAY);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Weekly recurrence with multiple weekdays works', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(20); // found all occurrences since expand flag is true
                        called = true;
                    });

                findByEventsByPrefix("wwt008", successCb, true);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can save a recurring event repeating on first Friday of every month', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Feb 1, 2013, 12:00"),
                    end = new Date("Feb 1, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest first Fri every month (wwt009)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY,
                        "expires": new Date("Jun 30, 2013"),
                        "dayInWeek": CalendarRepeatRule.FRIDAY,
                        "weekInMonth": 1
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY);
                        expect(created.recurrence.dayInWeek).toBe(CalendarRepeatRule.FRIDAY);
                        expect(created.recurrence.weekInMonth).toBe(1);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Monthly recurrence at a weekday works', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(5); // found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });

                        expect(starts).toContain(new Date("Feb 1, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Mar 1, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Apr 5, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("May 3, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jun 7, 2013, 12:00").toISOString());

                        called = true;
                    });

                findByEventsByPrefix("wwt009", successCb, true);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can save a recurring event repeating on seventh month of the first Friday every year', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jul 5, 2013, 12:00"),
                    end = new Date("Jul 5, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest 1st Fri of 7th month every year (wwt010)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH,
                        "expires": new Date("Jun 30, 2017, 12:00"),
                        "dayInWeek": CalendarRepeatRule.FRIDAY,
                        "weekInMonth": 1,
                        "monthInYear": 7
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH);
                        expect(created.recurrence.dayInWeek).toBe(CalendarRepeatRule.FRIDAY);
                        expect(created.recurrence.weekInMonth).toBe(1);
                        expect(created.recurrence.monthInYear).toBe(7);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Yearly recurrence at a weekday of a month works', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(4); // found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });

                        expect(starts).toContain(new Date("Jul 5, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jul 4, 2014, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jul 3, 2015, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jul 1, 2016, 12:00").toISOString());

                        called = true;
                    });

                findByEventsByPrefix("wwt010", successCb, true);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can save a recurring event repeating on the last day of every month', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 31, 2013, 12:00"),
                    end = new Date("Jan 31, 2013, 12:30"),
                    venue = "some location",
                    summary = "WebWorksTest last day of every month (wwt011)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY,
                        "expires": new Date("Jun 1, 2013, 12:00"),
                        "dayInWeek": CalendarRepeatRule.LAST_DAY_IN_MONTH
                    }),
                    called = false,
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        expect(created.summary).toBe(summary);
                        expect(created.location).toBe(venue);
                        expect(created.recurrence).toBeDefined();
                        expect(created.recurrence.frequency).toBe(CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY);
                        expect(created.recurrence.dayInWeek).toBe(CalendarRepeatRule.LAST_DAY_IN_MONTH);
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Monthly recurrence on the last day of the month works', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(5); // found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });

                        expect(starts).toContain(new Date("Jan 31, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 28, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Mar 31, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Apr 30, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("May 31, 2013, 12:00").toISOString());

                        called = true;
                    });

                findByEventsByPrefix("wwt011", successCb, true);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("Exception event", function () {
        it('Can create an exception event', function () {
            if (isDefaultFolderAccessible()) {
                var start = new Date("Jan 21, 2013, 12:00"),
                    end = new Date("Jan 21, 2013, 12:30"),
                    location = "some location",
                    summary = "WebWorksTest test exception event (wwt012)",
                    rule = new CalendarRepeatRule({
                        "frequency": CalendarRepeatRule.FREQUENCY_WEEKLY,
                        "expires": new Date("Feb 18, 2013, 12:00"),
                        "dayInWeek": CalendarRepeatRule.TUESDAY | CalendarRepeatRule.FRIDAY
                    }),
                    called = false,
                    exceptionEvtSavedCalled = false,
                    exceptionSavedCb = jasmine.createSpy().andCallFake(function (exc) {
                        expect(exc.id).not.toBe(recEvent.id);
                        expect(exc.parentId).toBe(recEvent.id);
                        exceptionEvtSavedCalled = true;
                    }),
                    exceptionErrorCb = jasmine.createSpy().andCallFake(function (error) {
                        exceptionEvtSavedCalled = true;
                    }),
                    successCb = jasmine.createSpy().andCallFake(function (created) {
                        recEvent = created;
                        called = true;
                    }),
                    errorCb = jasmine.createSpy(function (error) {
                        called = true;
                    });

                recEvent = cal.createEvent({"summary": summary, "location": location, "start": start, "end": end, "recurrence": rule});
                recEvent.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Recurring event not saved to device calendar", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    findByEventsByPrefix("wwt012", function (events) {
                        var starts = [],
                            exceptionEvt;

                        expect(events.length).toBe(8);

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });

                        expect(starts).toContain(new Date("Jan 22, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jan 25, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jan 29, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 1, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 5, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 8, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 12, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 15, 2013, 12:00").toISOString());

                        exceptionEvt = recEvent.createExceptionEvent(new Date("Feb 15, 2013, 12:00"));
                        exceptionEvt.start = new Date("Feb 16, 2013, 12:00");
                        exceptionEvt.end = new Date("Feb 16, 2013, 12:30");

                        exceptionEvt.save(exceptionSavedCb, exceptionErrorCb);
                    }, true);
                });

                waitsFor(function () {
                    return exceptionEvtSavedCalled;
                }, "Exception event not saved to device calendar", timeout);

                runs(function () {
                    expect(exceptionSavedCb).toHaveBeenCalled();
                    expect(exceptionErrorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Exception event replaces original occurence', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        var starts = [];

                        expect(events.length).toBe(8);// found all occurrences since expand flag is true

                        events.forEach(function (evt) {
                            starts.push(evt.start.toISOString());
                        });

                        expect(starts).toContain(new Date("Jan 22, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jan 25, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Jan 29, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 1, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 5, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 8, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 12, 2013, 12:00").toISOString());
                        expect(starts).toContain(new Date("Feb 16, 2013, 12:00").toISOString());

                        called = true;
                    });

                findByEventsByPrefix("wwt012", successCb, true);

                waitsFor(function () {
                    return called;
                }, "Find callback never invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("blackberry.pim.calendar.findEvents", function () {
        var findDataInit = false;

        beforeEach(function () {
            if (!findDataInit && isDefaultFolderAccessible()) {
                createEventForFind(
                    new Date("Dec 31, 2012, 12:00"),
                    new Date("Jan 01, 2013, 12:00"),
                    "(wwt013) WebWorksTest abc",
                    "Home",
                    true);

                createEventForFind(
                    new Date("Apr 1, 2046, 14:00"),
                    new Date("Apr 1, 2046, 14:30"),
                    "WebWorksTest April fool party",
                    "Home",
                    false);

                createEventForFind(
                    new Date("Dec 31, 2012, 12:00"),
                    new Date("Jan 01, 2013, 12:00"),
                    "(wwt013) WebWorksTest ab",
                    "Work",
                    true);

                createEventForFind(
                    new Date("Dec 30, 2012, 12:00"),
                    new Date("Dec 31, 2012, 12:00"),
                    "(wwt013) WebWorksTest abcd",
                    "Work",
                    true);

                findDataInit = true;
            }
        });

        it('invoke error callback with invalid arguments error if find options has invalid detail level', function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy(),
                filter = {
                    "substring": "abc"
                },
                findOptions = {
                    "filter": filter,
                    "detail": -890,
                    "limit": 5
                };

            cal.findEvents(findOptions, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new CalendarError(CalendarError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        xit('can still find events even if find options is null', function () {
            var called = false,
                successCb = jasmine.createSpy().andCallFake(function (events) {
                    expect(events.length).toBeGreaterThan(0);
                    called = true;
                }),
                errorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            cal.findEvents(null, successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Find callback not invoked", timeout);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('can find event by substring', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "substring": "wwt013",
                        "expandRecurring": false
                    },
                    findOptions = {
                        "filter": filter,
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(3);
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can find event with date range', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "start": new Date("Mar 31, 2046"),
                        "end": new Date("Apr 2, 2046")
                    },
                    findOptions = {
                        "filter": filter,
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(1);
                        expect(events[0].summary).toBe("WebWorksTest April fool party");
                        expect(events[0].location).toBe("Home");
                        expect(events[0].allDay).toBeFalsy();
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can get all events (max=findOptions.limit) if filter is a blank object without any params', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events).toBeDefined();
                        expect(Array.isArray(events)).toBeTruthy();
                        expect(events.length).toEqual(5);
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    }),
                    filter = {},
                    findOptions = {
                        "filter": filter,
                        "detail": CalendarFindOptions.DETAIL_FULL,
                        "limit": 5
                    };

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(errorCb).not.toHaveBeenCalled();
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('Can get all events (max=findOptions.limit) if filter is not defined in CalendarFindOptions', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events).toBeDefined();
                        expect(Array.isArray(events)).toBeTruthy();
                        expect(events.length).toEqual(5);
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function (error) {
                        called = true;
                    }),
                    findOptions = {
                        "detail": CalendarFindOptions.DETAIL_FULL,
                        "limit": 5
                    };

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(errorCb).not.toHaveBeenCalled();
                    expect(successCb).toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        xit('Can get all events (max=infinity) if findOptions is a blank object without any params', function () {
            var called = false,
                successCb = jasmine.createSpy().andCallFake(function (events) {
                    expect(events).toBeDefined();
                    expect(Array.isArray(events)).toBeTruthy();
                    expect(events.length).toBeGreaterThan(5);
                    called = true;
                }),
                errorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                }),
                findOptions = {};

            cal.findEvents(findOptions, successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Find callback not invoked", timeout);

            runs(function () {
                expect(errorCb).not.toHaveBeenCalled();
                expect(successCb).toHaveBeenCalled();
            });
        });

        it('can sort search results by summary (desc)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "substring": "wwt013",
                        "expandRecurring": false
                    },
                    findOptions = {
                        "filter": filter,
                        "sort": [{"fieldName": CalendarFindOptions.SORT_FIELD_SUMMARY, "desc": true}],
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(3);
                        if (events.length === 3) {
                            expect(events[0].summary).toBe("(wwt013) WebWorksTest abcd");
                            expect(events[1].summary).toBe("(wwt013) WebWorksTest abc");
                            expect(events[2].summary).toBe("(wwt013) WebWorksTest ab");
                        }
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can sort search results by start time (asc)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "substring": "wwt013",
                        "expandRecurring": false
                    },
                    findOptions = {
                        "filter": filter,
                        "sort": [{"fieldName": CalendarFindOptions.SORT_FIELD_START, "desc": false}],
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(3);
                        expect(events[0].summary).toBe("(wwt013) WebWorksTest abcd");
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can sort search results by end time (asc)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "substring": "wwt013",
                        "expandRecurring": false
                    },
                    findOptions = {
                        "filter": filter,
                        "sort": [{"fieldName": CalendarFindOptions.SORT_FIELD_END, "desc": false}],
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        expect(events.length).toBe(3);
                        expect(events[0].summary).toBe("(wwt013) WebWorksTest abcd");
                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });

        it('can sort search results by location (asc)', function () {
            if (isDefaultFolderAccessible()) {
                var called = false,
                    filter = {
                        "substring": "wwt013",
                        "expandRecurring": false
                    },
                    findOptions = {
                        "filter": filter,
                        "sort": [{"fieldName": CalendarFindOptions.SORT_FIELD_LOCATION, "desc": false}],
                        "detail": CalendarFindOptions.DETAIL_FULL
                    },
                    successCb = jasmine.createSpy().andCallFake(function (events) {
                        // TODO: this fails due to the following PR
                        // PR 218835 - Using location as sort field in CalendarService::events() does not return any results
                        expect(events.length).toBe(3);

                        if (events.length === 3) {
                            expect(events[0].summary).toBe("(wwt013) WebWorksTest abc");
                            expect(events[0].location).toBe("Home");
                        }

                        called = true;
                    }),
                    errorCb = jasmine.createSpy().andCallFake(function () {
                        called = true;
                    });

                cal.findEvents(findOptions, successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "Find callback not invoked", timeout);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("blackberry.pim.calendar.getEvent", function () {
        var eventToFind = null;

        it('can get the event with specified eventId and folder', function () {
            if (isDefaultFolderAccessible()) {
                var evt,
                    eventFound,
                    summary = "(wwt014) WebWorksTest: Testing getEvent",
                    location = "Somewhere",
                    start = new Date(),
                    end = new Date(start.valueOf() + 60 * 60 * 1000),
                    successCreateEvent = jasmine.createSpy().andCallFake(function (event) {
                        eventToFind = event;
                    }),
                    errorCreateEvent = jasmine.createSpy();

                evt = cal.createEvent({
                    "summary": summary,
                    "location": location,
                    "allDay": false,
                    "start": start,
                    "end": end
                });

                runs(function () {
                    evt.save(successCreateEvent, errorCreateEvent);
                });

                waitsFor(function () {
                    return !!eventToFind;
                }, "create new event was failed", timeout);

                runs(function () {
                    eventFound = cal.getEvent(eventToFind.id, eventToFind.folder);
                    expect(eventFound.id).toBe(eventToFind.id);
                    expect(eventFound.summary).toEqual(summary);
                    expect(eventFound.location).toEqual(location);
                });
            } else {
                this.fail(new Error("Default folder not accessible (probably set to work account)"));
            }
        });
    });

    describe("Clean up all test events", function () {
        it("Clean up all test events", function () {
            var called = false,
                cleanedUpSuccess = false;

            deleteEventWithMatchingPrefix("WebWorksTest", function (eventsCleanedUp) {
                expect(eventsCleanedUp).toBeTruthy();
                cleanedUpSuccess = eventsCleanedUp;
                called = true;
            });

            waitsFor(function () {
                return called;
            }, "Callback not invoked", timeout);

            runs(function () {
                expect(cleanedUpSuccess).toBeTruthy();
            });
        });
    });
});
