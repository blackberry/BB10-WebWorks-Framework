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
var _apiDir = __dirname + "./../../../../ext/pim.calendar/",
    _libDir = __dirname + "./../../../../lib/",
    utils = require(_libDir + "utils"),
    events = require(_libDir + "event"),
    CalendarFindOptions = require(_apiDir + "CalendarFindOptions"),
    CalendarEvent = require(_apiDir + "CalendarEvent"),
    CalendarError = require(_apiDir + "CalendarError"),
    index,
    mockJnextObjId = 123;

describe("pim.calendar/index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function () {
                return JSON.stringify({_success: "astrign"});
            }),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        GLOBAL.window = {
            qnx: {
                webplatform: {
                    device: {
                        timezone: "America/New_York"
                    }
                }
            }
        };
        spyOn(events, "trigger");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });

    it("JNEXT require/createObject/registerEvents are not called upon requiring index", function () {
        expect(JNEXT.require).not.toHaveBeenCalled();
        expect(JNEXT.createObject).not.toHaveBeenCalled();
        expect(JNEXT.registerEvents).not.toHaveBeenCalled();
    });

    it("find - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {};

        spyOn(utils, "hasPermission").andReturn(true);

        index.find(successCb, failCb, {
            _eventId: encodeURIComponent(JSON.stringify("abc")),
            options: encodeURIComponent(JSON.stringify(findOptions))
        });

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("find");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });
    it("find - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {   
                filter: [{
                    fieldName: CalendarFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], 
                limit: 5
            };

        spyOn(utils, "hasPermission").andReturn(false);

        index.find(successCb, failCb, {
            _eventId: encodeURIComponent(JSON.stringify("abc")),
            fields: encodeURIComponent(JSON.stringify(["name"])),
            options: encodeURIComponent(JSON.stringify(findOptions))
        });

        expect(events.trigger).toHaveBeenCalledWith(jasmine.any(String), {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": CalendarError.PERMISSION_DENIED_ERROR
            }))
        });
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("save - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            evt = {},
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(true);

        for (key in evt) {
            if (evt.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(evt[key]));
            }
        }

        args["_eventId"] = encodeURIComponent(JSON.stringify("abc"));

        index.save(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("save");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("save - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            evt = new CalendarEvent({
                "summary": "a test",
                "location": "test",
                "start": new Date("Jan 01, 2015, 12:00"),
                "end": new Date("Jan 01, 2015, 12:30"),
            }),
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(false);

        for (key in evt) {
            if (evt.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(evt[key]));
            }
        }

        args["_eventId"] = encodeURIComponent(JSON.stringify("abc"));

        index.save(successCb, failCb, args);

        expect(events.trigger).toHaveBeenCalledWith(jasmine.any(String), {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": CalendarError.PERMISSION_DENIED_ERROR
            }))
        });
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });
    it("remove - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(true);

        index.remove(successCb, failCb, {
            accountId : encodeURIComponent(JSON.stringify(1)),
            calEventId : encodeURIComponent(JSON.stringify(2)),
            _eventId : encodeURIComponent(JSON.stringify("abc")),
            removeAll : encodeURIComponent(JSON.stringify(true))
        });

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("remove");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("remove - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(false);

        index.remove(successCb, failCb, {
            accountId : encodeURIComponent(JSON.stringify(1)),
            calEventId : encodeURIComponent(JSON.stringify(2)),
            _eventId : encodeURIComponent(JSON.stringify("abc")),
            removeAll : encodeURIComponent(JSON.stringify(true))
        });

        expect(events.trigger).toHaveBeenCalledWith(jasmine.any(String), {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": CalendarError.PERMISSION_DENIED_ERROR
            }))
        });
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getDefaultCalendarAccount", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};
 
        index.getDefaultCalendarAccount(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("getDefaultCalendarAccount");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getCalendarAccounts", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};
 
        index.getCalendarAccounts(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("getCalendarAccounts");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getEvent", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            folder = {accountId: "abc"};
 
        index.getEvent(successCb, failCb, { 
                eventId : encodeURIComponent(JSON.stringify("abc")),
                folder: encodeURIComponent(JSON.stringify(folder))
            } 
        );
        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("getEvent");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getDefaultCalendarFolder  - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(true);
 
        index.getDefaultCalendarFolder(successCb, failCb, {});
        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalled();
        expect(JNEXT.invoke.mostRecentCall.args[0]).toBe(mockJnextObjId);
        expect(JNEXT.invoke.mostRecentCall.args[1]).toContain("getDefaultCalendarFolder");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });
});
