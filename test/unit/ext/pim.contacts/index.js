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
var _apiDir = __dirname + "./../../../../ext/pim.contacts/",
    _libDir = __dirname + "./../../../../lib/",
    utils = require(_libDir + "utils"),
    events = require(_libDir + "event"),
    ContactFindOptions = require(_apiDir + "ContactFindOptions"),
    Contact = require(_apiDir + "Contact"),
    ContactName = require(_apiDir + "ContactName"),
    ContactError = require(_apiDir + "ContactError"),
    index,
    mockJnextObjId = 123;

describe("pim.contacts index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke"),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        spyOn(events, "trigger");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        index = null;
    });

    it("JNEXT require/createObject/registerEvents are not called upon requiring index", function () {
        expect(JNEXT.require).not.toHaveBeenCalledWith("libpimcontacts");
        expect(JNEXT.createObject).not.toHaveBeenCalledWith("libpimcontacts.PimContacts");
        expect(JNEXT.registerEvents).not.toHaveBeenCalled();
    });

    it("find - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }],
                limit: 5
            };

        spyOn(utils, "hasPermission").andReturn(true);

        index.find(successCb, failCb, {
            _eventId: encodeURIComponent(JSON.stringify("abc")),
            fields: encodeURIComponent(JSON.stringify(["name"])),
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
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
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
                "code": ContactError.PERMISSION_DENIED_ERROR
            }))
        });
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });

    it("save - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            contact = new Contact({
                name: {"familyName": "Smith", "givenName": "John"},
                note: "this is a test"
            }),
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(true);

        for (key in contact) {
            if (contact.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(contact[key]));
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
            contact = new Contact({
                name: {"familyName": "Smith", "givenName": "John"},
                note: "this is a test"
            }),
            args = {},
            key;

        spyOn(utils, "hasPermission").andReturn(false);

        for (key in contact) {
            if (contact.hasOwnProperty(key)) {
                args[key] = encodeURIComponent(JSON.stringify(contact[key]));
            }
        }

        args["_eventId"] = encodeURIComponent(JSON.stringify("abc"));

        index.save(successCb, failCb, args);

        expect(events.trigger).toHaveBeenCalledWith(jasmine.any(String), {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": ContactError.PERMISSION_DENIED_ERROR
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
            contactId: encodeURIComponent(JSON.stringify(1)),
            _eventId: encodeURIComponent(JSON.stringify("abc"))
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
            contactId: encodeURIComponent(JSON.stringify(1)),
            _eventId: encodeURIComponent(JSON.stringify("abc"))
        });

        expect(events.trigger).toHaveBeenCalledWith(jasmine.any(String), {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": ContactError.PERMISSION_DENIED_ERROR
            }))
        });
        expect(JNEXT.invoke).not.toHaveBeenCalled();
        expect(successCb).toHaveBeenCalled();
        expect(failCb).not.toHaveBeenCalled();
    });
});
