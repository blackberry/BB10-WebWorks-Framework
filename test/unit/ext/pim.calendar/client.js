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
var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/pim.calendar",
    _ID = require(_apiDir + "/manifest").namespace,
    calendar = require(_apiDir + "/client"),
    CalendarFindOptions = calendar.CalendarFindOptions,
    CalendarEvent = calendar.CalendarEvent,
    CalendarRepeatRule = calendar.CalendarRepeatRule,
    CalendarErr = calendar.CalendarError,
    CalendarFolder = calendar.CalendarFolder,
    CalendarEventFilter = calendar.CalendarEventFilter,
    Attendee = calendar.Attendee,
    mockedWebworks = {
        execAsync: jasmine.createSpy("webworks.execAsync"),
        event: {
            once: jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                callback({
                    result: escape(JSON.stringify({
                        _success: true,
                        contacts: []
                    }))
                });
            })
        }
    };

describe("pim.calendar/client", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("Testing createEvent", function () {
        it("has method createEvent", function () {
            expect(calendar.createEvent).toBeDefined();
        });

        it("returns an event when call createEvent with given properties", function () {
            var summary = "WebWorks API UNIT TEST: pim.calendar.createEvent",
                start = new Date(),
                end   = new Date(start.valueOf() + 60 * 60 * 1000),
                properties = {
                    summary: summary,
                    start  : start,
                    end    : end
                },
                event = calendar.createEvent(properties);
            expect(event).toBeDefined();
            expect(event.start).toEqual(start);
            expect(event.end).toEqual(end);
            expect(event.summary).toEqual(summary);
        });
    });

    describe("Testing getCalendarAccounts", function () {
        beforeEach(function () {
            GLOBAL.window.webworks.execSync = jasmine.createSpy("webworks.execSync").andReturn(
                [
                    {id: 1, name: "account1", enterprise: false},
                    {id: 2, name: "account2", enterprise: true}
                ]
            );
        });

        it("has method getCalendarAccounts", function () {
            expect(calendar.getCalendarAccounts).toBeDefined();
        });

        it("returns all accounts of calendar", function () {
            var accounts = calendar.getCalendarAccounts();
            expect(accounts).toBeDefined();
            expect(accounts.length).toBeGreaterThan(0);
        });
    });

    describe("Testing getDefaultCalendarAccount", function () {
        it("has method getDefaultCalendarAccount", function () {
            expect(calendar.getDefaultCalendarAccount).toBeDefined();
        });

        it("returns default account of calendar", function () {
            var account = calendar.getDefaultCalendarAccount();
            expect(account).toBeDefined();
        });
    });

    describe("Testing getCalendarFolders", function () {
        beforeEach(function () {
            GLOBAL.window.webworks.execSync = jasmine.createSpy("webworks.execSync").andReturn(
                [
                    {id: 1, name: "folder1"},
                    {id: 2, name: "folder2"}
                ]
            );
        });

        it("has method getCalendarFolders", function () {
            expect(calendar.getCalendarFolders).toBeDefined();
        });

        it("returns folders of calendar", function () {
            var folders = calendar.getCalendarFolders();
            expect(folders).toBeDefined();
        });
    });

    describe("Testing getDefaultCalendarFolder", function () {
        beforeEach(function () {
            GLOBAL.window.webworks.execSync = jasmine.createSpy("webworks.execSync").andReturn(
                [
                    {id: 1, name: "default folder"},
                ]
            );
        });

        it("has method getDefaultCalendarFolder", function () {
            expect(calendar.getDefaultCalendarFolder).toBeDefined();
        });

        it("returns default folder of calendar", function () {
            var folder = calendar.getDefaultCalendarFolder();
            expect(folder).toBeDefined();
        });
    });

    describe("Testing getEvent", function () {
        it("has method getEvent", function () {
            expect(calendar.getEvent).toBeDefined();
        });

        it("returns the event with specific eventId and folder in calendar", function () {
            var event = calendar.getEvent();
            expect(event).toBeDefined();
        });
    });

    describe("Testing findEvents", function () {
        it("has method findEvents", function () {
            expect(calendar.findEvents).toBeDefined();
        });

        it("returns the event with specific criteria in calendar", function () {
            var findOptions = {
                    "filter": {
                        "substring": "wwt006",
                        "expandRecurring": false
                    },
                    "detail": CalendarFindOptions.DETAIL_FULL
                },
                onSuccess = jasmine.createSpy("onSuccess").andCallFake(function (events) {
                    expect(events).toBeDefined();
                }),
                onError   = jasmine.createSpy("onError").andCallFake(function (error) {
                    expect(error).toBeDefined();
                });
            calendar.findEvents(findOptions, onSuccess, onError);
            expect(window.webworks.execAsync).toHaveBeenCalled();
        });
    });
});
