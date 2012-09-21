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
    _apiDir = _extDir + "/pim.contacts",
    _ID = require(_apiDir + "/manifest").namespace,
    Contact,
    ContactError,
    mockedWebworks = {
        event: {}
    };

describe("pim.contacts Contact", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;
        Contact = require(_apiDir + "/Contact");
        ContactError = require(_apiDir + "/ContactError");
        mockedWebworks.execAsync = jasmine.createSpy("webworks.execAsync");
    });

    afterEach(function () {
        delete require.cache[require.resolve(_apiDir + "/client")];
        delete GLOBAL.window;
    });

    describe("constructor", function () {
        it("can set the default values", function () {
            var contact = new Contact(),
                field;

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field === "favorite") {
                        expect(contact[field]).toBe(false);
                    } else {
                        expect(contact[field]).toBe(null);
                    }
                }
            }
        });

        it("can populate the object based on the properties parameter", function () {
            var contact = new Contact({"displayName": "John Smith"}),
                field;

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field === "displayName") {
                        expect(contact[field]).toBe("John Smith");
                    } else if (field === "favorite") {
                        expect(contact[field]).toBe(false);
                    } else {
                        expect(contact[field]).toBe(null);
                    }
                }
            }
        });

        it("populates the id and makes it read-only", function () {
            var contact = new Contact({"id": "0"});

            expect(contact.id).toBe("0");
            contact.id = "12345";
            expect(contact.id).toBe("0");
        });
    });

    describe("save", function () {
        it("calls the success callback", function () {
            var contact = new Contact(),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: true,
                            id : 0
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            contact.save(onSaveSuccess, onSaveError);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "save", jasmine.any(Object));
            expect(onSaveSuccess).toHaveBeenCalledWith(new Contact({"id": "0"}));
            expect(onSaveError).not.toHaveBeenCalled();
        });

        it("calls the error callback", function () {
            var contact = new Contact(),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: false,
                            code : ContactError.UNKNOWN_ERROR
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            contact.save(onSaveSuccess, onSaveError);

            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.UNKNOWN_ERROR});
        });

        it("calls the error callback when onSaveSuccess is omitted", function () {
            var contact = new Contact(),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once");

            GLOBAL.window.webworks.event.once = once;

            contact.save(null, onSaveError);

            expect(once).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback when arguments are incorrect", function () {
            var contact = new Contact({"phoneNumbers": [{"value": "1234567890"}]}),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once");

            GLOBAL.window.webworks.event.once = once;

            contact.save(onSaveSuccess, onSaveError);

            expect(once).not.toHaveBeenCalled();
            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback when the id is incorrect", function () {
            var contact = new Contact({"id": "abc"}),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once");

            GLOBAL.window.webworks.event.once = once;

            contact.save(onSaveSuccess, onSaveError);

            expect(once).not.toHaveBeenCalled();
            expect(onSaveSuccess).not.toHaveBeenCalled();
            expect(onSaveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });

        it("converts Date objects to strings", function () {
            var contact = new Contact({
                    "birthday": new Date("January 1, 1970"),
                    "anniversary": new Date("July 1, 1990")
                }),
                onSaveSuccess = jasmine.createSpy("onSaveSuccess"),
                onSaveError = jasmine.createSpy("onSaveError"),
                once = jasmine.createSpy("webworks.event.once"),
                result;

            GLOBAL.window.webworks.event.once = once;

            contact.save(onSaveSuccess, onSaveError);

            expect(once).toHaveBeenCalledWith("blackberry.pim.contacts", jasmine.any(String), jasmine.any(Function));
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "save", jasmine.any(Object));

            result = mockedWebworks.execAsync.mostRecentCall.args[2];
            expect(result.birthday).toBe("Thu Jan 01 1970");
            expect(result.anniversary).toBe("Sun Jul 01 1990");
        });
    });

    describe("clone", function () {
        it("returns a Contact with a null id", function () {
            var contact = new Contact({"id": "0"}),
                clonedContact;

            clonedContact = contact.clone();

            expect(clonedContact.id).toBe(null);
            expect(contact.id).toBe("0");
        });

        it("copies all properties to the new Contact", function () {
            var contact = new Contact({
                    id: "0",
                    name: { "givenName": "John", "familyName": "Smith", "middleName": "H" },
                    displayName: "John",
                    nickname: "Johnny",
                    emails: [],
                    birthday: new Date("January 1, 1970")
                }),
                clonedContact,
                field;

            clonedContact = contact.clone();

            for (field in contact) {
                if (contact.hasOwnProperty(field)) {
                    if (field !== "id") {
                        expect(clonedContact[field]).toBe(contact[field]);
                    }
                }
            }
        });
    });

    describe("remove", function () {
        it("calls the success callback", function () {
            var contact = new Contact({"id": "0"}),
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

            contact.remove(onRemoveSuccess, onRemoveError);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "remove", jasmine.any(Object));
            expect(onRemoveSuccess).toHaveBeenCalledWith();
            expect(onRemoveError).not.toHaveBeenCalled();
        });

        it("calls the error callback", function () {
            var contact = new Contact({"id": "0"}),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError"),
                once = jasmine.createSpy("webworks.event.once").andCallFake(function (service, eventId, callback) {
                    callback({
                        result: escape(JSON.stringify({
                            _success: false,
                            code : ContactError.UNKNOWN_ERROR
                        }))
                    });
                });

            GLOBAL.window.webworks.event.once = once;

            contact.remove(onRemoveSuccess, onRemoveError);

            expect(onRemoveSuccess).not.toHaveBeenCalled();
            expect(onRemoveError).toHaveBeenCalledWith({"code": ContactError.UNKNOWN_ERROR});
        });

        it("calls the error callback when the id is incorrect", function () {
            var contact = new Contact({"id": null}),
                onRemoveSuccess = jasmine.createSpy("onRemoveSuccess"),
                onRemoveError = jasmine.createSpy("onRemoveError"),
                once = jasmine.createSpy("webworks.event.once");

            GLOBAL.window.webworks.event.once = once;

            contact.remove(onRemoveSuccess, onRemoveError);
            expect(onRemoveSuccess).not.toHaveBeenCalled();
            expect(onRemoveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });

        it("calls the error callback when onRemoveSuccess is omitted", function () {
            var contact = new Contact({"id": null}),
                onRemoveError = jasmine.createSpy("onRemoveError"),
                once = jasmine.createSpy("webworks.event.once");

            GLOBAL.window.webworks.event.once = once;

            contact.remove(null, onRemoveError);

            expect(onRemoveError).toHaveBeenCalledWith({"code": ContactError.INVALID_ARGUMENT_ERROR});
        });
    });
});

