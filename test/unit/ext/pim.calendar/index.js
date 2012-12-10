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
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function (id, command) {
                if (command.indexOf("getCalendarFolders") !== -1) {
                    return JSON.stringify([{
                        id: "1",
                        accountId: "1"
                    }]);
                } else if (command.indexOf("getDefaultCalendarFolder") !== -1) {
                    return JSON.stringify({
                        id: "1",
                        accountId: "1"
                    });
                } else if (command.indexOf("getCalendarAccounts") !== -1) {
                    return JSON.stringify([{
                        id: "1"
                    }]);
                } else if (command.indexOf("getDefaultCalendarAccount") !== -1) {
                    return JSON.stringify({
                        id: "1"
                    });
                } else if (command.indexOf("getEvent") !== -1) {
                    return JSON.stringify({
                        _success: true,
                        event: {
                            id: "123"
                        }
                    });
                } else {
                    return JSON.stringify({});
                }
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
            findOptions = {
                limit: 5,
                detail: CalendarFindOptions.DETAIL_AGENDA
            },
            args = {
                _eventId: encodeURIComponent(JSON.stringify("abc")),
                options: encodeURIComponent(JSON.stringify(findOptions))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.find(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["options"]["sourceTimezone"] = window.qnx.webplatform.device.timezone;

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "find " + JSON.stringify(args));
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

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["sourceTimezone"] = window.qnx.webplatform.device.timezone;
        args["targetTimezone"] = "";

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "save " + JSON.stringify(args));
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
            failCb = jasmine.createSpy(),
            args = {
                accountId : encodeURIComponent(JSON.stringify(1)),
                calEventId : encodeURIComponent(JSON.stringify(2)),
                _eventId : encodeURIComponent(JSON.stringify("abc")),
                removeAll : encodeURIComponent(JSON.stringify(true))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.remove(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        args["sourceTimezone"] = window.qnx.webplatform.device.timezone;

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "remove " + JSON.stringify(args));
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

    it("getDefaultCalendarAccount - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};
 
        spyOn(utils, "hasPermission").andReturn(false);

        index.getDefaultCalendarAccount(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalledWith(null);
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getDefaultCalendarAccount - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(true);

        index.getDefaultCalendarAccount(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDefaultCalendarAccount");
        expect(successCb).toHaveBeenCalledWith({
            id: "1"
        });
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getCalendarAccounts - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};

        spyOn(utils, "hasPermission").andReturn(false);

        index.getCalendarAccounts(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalledWith(null);
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getCalendarAccounts - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {};
 
        spyOn(utils, "hasPermission").andReturn(true);

        index.getCalendarAccounts(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getCalendarAccounts");
        expect(successCb).toHaveBeenCalledWith([{
            id: "1"
        }]);
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getEvent - without correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {
                eventId: encodeURIComponent(JSON.stringify("123")),
                accountId: encodeURIComponent(JSON.stringify("1"))
            };
 
        spyOn(utils, "hasPermission").andReturn(false);

        index.getEvent(successCb, failCb, args);

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalledWith(null);
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getEvent - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            args = {
                eventId: encodeURIComponent(JSON.stringify("123")),
                accountId: encodeURIComponent(JSON.stringify("1"))
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.getEvent(successCb, failCb, args);

        Object.getOwnPropertyNames(args).forEach(function (key) {
            args[key] = JSON.parse(decodeURIComponent(args[key]));
        });

        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getEvent " + JSON.stringify(args));
        expect(successCb).toHaveBeenCalledWith({
            id: "123"
        });
        expect(failCb).not.toHaveBeenCalled();
    });

    it("getDefaultCalendarFolder  - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy();

        spyOn(utils, "hasPermission").andReturn(true);
 
        index.getDefaultCalendarFolder(successCb, failCb, {});
        expect(events.trigger).not.toHaveBeenCalled();
        expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDefaultCalendarFolder");
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });
});
