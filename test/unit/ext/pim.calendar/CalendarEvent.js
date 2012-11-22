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
    CalendarEvent,
    CalendarError,
    mockedWebworks = {
        event: {}
    };

describe("pim.calendar CalendarEvent", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;
        CalendarEvent = require(_apiDir + "/CalendarEvent");
        CalendarError = require(_apiDir + "/CalendarError");
        mockedWebworks.execAsync = jasmine.createSpy("webworks.execAsync");
    });

    afterEach(function () {
        delete require.cache[require.resolve(_apiDir + "/client")];
        delete GLOBAL.window;
    });

    describe("constructor", function () {
        it("can set the default values", function () {
            var evt = new CalendarEvent(),
                field;

            for (field in evt) {
                if (evt.hasOwnProperty(field)) {
                    if (field === "reminder") {
                        expect(evt[field]).toBe(15);
                    } else if (field === "transparency") {
                        expect(evt[field]).toBe(2);
                    } else if (field === "status") {
                        expect(evt[field]).toBe(0);
                    } else if (field === "description" || field === "location" || field === "summary" || field === "timezone" || field === "url") {
                        expect(evt[field]).toBe("");
                    } else if (field === "birthday" || field === "allDay") {
                        expect(evt[field]).toBeFalsy();
                    } else if (field === "attendees") {
                        expect(evt[field]).toEqual([]);
                    } else {
                        expect(evt[field]).toBe(null);
                    }
                }
            }
        });

        it("can populate the object based on the properties parameter", function () {
            var evt = new CalendarEvent({
                    "summary": "My test event",
                    "reminder": 60,
                    "location": "Home"
                }),
                field;

            for (field in evt) {
                if (evt.hasOwnProperty(field)) {
                    if (field === "reminder") {
                        expect(evt[field]).toBe(60);
                    } else if (field === "transparency") {
                        expect(evt[field]).toBe(2);
                    } else if (field === "summary") {
                        expect(evt[field]).toBe("My test event");
                    } else if (field === "location") {
                        expect(evt[field]).toBe("Home");
                    } else if (field === "status") {
                        expect(evt[field]).toBe(0);
                    } else if (field === "description" || field === "timezone" || field === "url") {
                        expect(evt[field]).toBe("");
                    } else if (field === "birthday" || field === "allDay") {
                        expect(evt[field]).toBeFalsy();
                    } else if (field === "attendees") {
                        expect(evt[field]).toEqual([]);
                    } else {
                        expect(evt[field]).toBe(null);
                    }
                }
            }
        });

        it("populates the id, parentId, and folder and makes them read-only", function () {
            var folder = {
                    "id": "3",
                    "accountId": "123343",
                    "ownerEmail": "abc@blah.com"
                },
                evt = new CalendarEvent({
                    "id": "3",
                    "folder": folder,
                    "parentId": "2"
                });

            expect(evt.id).toBe("3");
            expect(evt.parentId).toBe("2");
            expect(evt.folder.id).toEqual(folder.id);
            expect(evt.folder.accountId).toEqual(folder.accountId);
            expect(evt.folder.ownerEmail).toEqual(folder.ownerEmail);
            evt.id = "12345";
            evt.parentId = "23423";
            evt.folder = {
                "a": "12"
            };
            expect(evt.id).toBe("3");
            expect(evt.parentId).toBe("2");
            expect(evt.folder.accountId).toEqual(folder.accountId);
            expect(evt.folder.ownerEmail).toEqual(folder.ownerEmail);
        });
    });

    describe("save", function () {
        it("calls the success callback if success flag is true", function () {
            var start = new Date("Jan 1, 2014, 12:00"),
                end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "start": start,
                    "end": end
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: true,
                            event: {
                                "id": "1"
                            }
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            evt.save(onSaveSuccess, onSaveError);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "save", jasmine.any(Object));
            expect(onSaveSuccess).toHaveBeenCalledWith(new CalendarEvent({"id": "1"}));
            expect(onSaveError).not.toHaveBeenCalled();
        });

        it("calls the error callback if start/end date is missing", function () {
            var end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "end": end
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError");

            evt.save(onSaveSuccess, onSaveError);

            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": CalendarError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback if end date is before start date", function () {
            var start = new Date("Jan 1, 2014, 13:00"),
                end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "start": start,
                    "end": end
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError");

            evt.save(onSaveSuccess, onSaveError);

            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": CalendarError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback if success flag is false", function () {
            var start = new Date("Jan 1, 2014, 12:00"),
                end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "start": start,
                    "end": end
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: false,
                            code: CalendarError.UNKNOWN_ERROR
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            evt.save(onSaveSuccess, onSaveError);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "save", jasmine.any(Object));
            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith(new CalendarError(CalendarError.UNKNOWN_ERROR));
        });

    });

    describe("remove", function () {
        it("calls the success callback", function () {
            var start = new Date("Jan 1, 2014, 12:00"),
                end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "start": start,
                    "end": end,
                    "id": "1",
                    "folder": {
                        "accountId": "1"
                    }
                }),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: true,
                            id : 0
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            evt.remove(onRemoveSuccess, onRemoveError);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "remove", jasmine.any(Object));
            expect(onRemoveSuccess).toHaveBeenCalledWith();
            expect(onRemoveError).not.toHaveBeenCalled();
        });

        it("calls the error callback if event has no id", function () {
            var evt = new CalendarEvent(),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError");

            spyOn(console, "log");

            evt.remove(onRemoveSuccess, onRemoveError);

            expect(onRemoveSuccess).not.toHaveBeenCalled();
            expect(onRemoveError).toHaveBeenCalledWith({"code": CalendarError.INVALID_ARGUMENT_ERROR});
        });
    });

    describe("createExceptionEvent", function () {
        it("returns an event with id set to null and parentId set to original event id", function () {
            var start = new Date("Jan 1, 2014, 12:00"),
                end = new Date("Jan 1, 2014, 12:30"),
                evt = new CalendarEvent({
                    "start": start,
                    "end": end,
                    "id": "1",
                    "folder": {
                        "accountId": "1"
                    }
                }),
                exceptionEvt = evt.createExceptionEvent(new Date("Jan 1, 2014, 12:00"));

            expect(exceptionEvt.id).toEqual(null);
            expect(exceptionEvt.parentId).toEqual("1");
            expect(exceptionEvt.originalStartTime.toISOString()).toEqual(new Date("Jan 1, 2014, 12:00").toISOString());
        });
    });
});