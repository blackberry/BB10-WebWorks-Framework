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
    selectedFolder,
    timeout = 15000;

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

function getCalendarFolder(domainSubstr) {
    var folders = [],
        found,
        accounts = cal.getCalendarAccounts();

    if (accounts) {
        accounts.forEach(function (acct) {
            if (acct.folders) {
                folders = folders.concat(acct.folders);
            }
        });
    }

    if (domainSubstr) {
        domainSubstr = domainSubstr.toLowerCase();
    }

    folders.forEach(function (f) {
        if (!domainSubstr) {
            if (f.name === "Home") {
                found = f;
                return;
            }
        } else {
            if (f.ownerEmail && f.ownerEmail.toLowerCase().indexOf(domainSubstr) !== -1) {
                if (f.ownerEmail.toLowerCase().indexOf("outlook") === -1 || f.type === 8) {
                    found = f;
                    return;
                }
            }
        }
    });

    return found;
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

describe("blackberry.pim.calendar", function () {
    it('can create event in a specified calendar folder (not local)', function () {
        var substr = window.prompt("Enter the domain substring of the calendar you want to use", "gmail"),
            evt,
            called = false,
            successCb = jasmine.createSpy().andCallFake(function (saved) {
                expect(saved.folder).toBeDefined();
                called = true;
            }),
            errorCb = jasmine.createSpy().andCallFake(function () {
                called = true;
            });

        selectedFolder = getCalendarFolder(substr);

        if (!selectedFolder) {
            window.alert("The specified calendar folder cannot be found. All the tests will be skipped");
        } else {
            evt = cal.createEvent({
                "summary": "WebWorksTest manual create event in folder (wwtmanual)",
                "location": "Location manual",
                "allDay": false,
                "start": new Date("Jan 15, 2013, 12:00"),
                "end": new Date("Jan 15, 2013, 12:30"),
            }, selectedFolder);
            evt.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "Event not saved to device calendar", timeout);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        }
    });

    it('can search events in the selected folder only', function () {
        if (selectedFolder) {
            var filter = {
                    "substring": "wwtmanual",
                    "folders": [selectedFolder]
                },
                findOptions = {
                    "filter": filter,
                    "detail": CalendarFindOptions.DETAIL_FULL
                },
                called = false,
                homeCalFolder = getCalendarFolder(),
                successCb = jasmine.createSpy("Find success callback").andCallFake(function (events) {
                    expect(events.length).toBe(1); // should only find the one in specified folder, not the one in local folder

                    if (events.length === 1) {
                        expect(events[0].summary).toBe("WebWorksTest manual create event in folder (wwtmanual)");
                        expect(events[0].location).toBe("Location manual");
                    }

                    called = true;
                }),
                errorCb = jasmine.createSpy("Find error callback").andCallFake(function () {
                    called = true;
                }),
                evt;

            // create event in local calendar with common prefix
            evt = cal.createEvent({
                "summary": "WebWorksTest manual create event in local folder (wwtmanual)",
                "location": "Location manual",
                "allDay": false,
                "start": new Date("Jan 15, 2013, 12:00"),
                "end": new Date("Jan 15, 2013, 12:30")
            }, homeCalFolder);

            evt.save(function (saved) {
                called = true;
            }, function (error) {
                called = true;
            });

            waitsFor(function () {
                return called;
            }, "Event not saved in calendar", timeout);

            runs(function () {
                called = false;
                cal.findEvents(findOptions, successCb, errorCb);
            });

            waitsFor(function () {
                return called;
            }, "Event not found in calendar", timeout);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        }
    });

    it('can create event with a different timezone', function () {
        window.alert("Before proceeding, make sure device is in a different timezone than Pacific Time.");

        var homeCalFolder = getCalendarFolder(),
            pst = "America/Los_Angeles",
            evt = cal.createEvent({
                "summary": "WebWorksTest diff timezone",
                "start": new Date("Jan 1, 2014, 12:30"),
                "end": new Date("Jan 1, 2014, 14:00"),
                "allDay": false,
                "timezone": pst
            }, homeCalFolder),
            called = false,
            successCb = jasmine.createSpy().andCallFake(function (created) {
                expect(created.start.toISOString()).toBe(new Date("Jan 01 2014 12:30:00 GMT-0800").toISOString());
                expect(created.end.toISOString()).toBe(new Date("Jan 01 2014 14:00:00 GMT-0800").toISOString());
                called = true;
            }),
            errorCb = jasmine.createSpy().andCallFake(function () {
                called = true;
            });

        evt.save(successCb, errorCb);

        waitsFor(function () {
            return called;
        }, "Event not saved in calendar", timeout);

        runs(function () {
            expect(successCb).toHaveBeenCalled();
            expect(errorCb).not.toHaveBeenCalled();
        });
    });

    it('can return error when save an event which was changed by others scince last fetch', function () {
        var homeCalFolder = getCalendarFolder(),
            start = new Date(),
            end = new Date(start.valueOf() + 60 * 60 * 1000),
            summary = "wwft01: WebWorksTest - Synchronization check",
            evt = cal.createEvent({
                "summary": summary,
                "start": start,
                "end": end,
                "allDay": false
            }, homeCalFolder),
            called = false,
            successCb = jasmine.createSpy().andCallFake(function (created) {
                evt = created;
                called = true;
            }),
            errorCb = jasmine.createSpy().andCallFake(function () {
                called = true;
            });

        runs(function () {
            evt.save(function (e) {
                evt = e;
                called = true;
            }, function (err) {
                console.log(err);
            });
        });

        waitsFor(function () {
            return called;
        }, "Event not saved in calendar", timeout);

        runs(function () {
            window.alert('Before proceeding, open Calendar app and search event with keyword "wwft01", then change the start time to 12:00PM');
            called = false;
            start = new Date(start.valueOf() + 2 * 60 * 60 * 1000);
            end = new Date(start.valueOf() + 60 * 60 * 1000);
            evt.start = start;
            evt.end = end;
            evt.save(successCb, errorCb);
        });

        waitsFor(function () {
            return called;
        }, "Event not saved in calendar", timeout);

        runs(function () {
            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalled();
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
