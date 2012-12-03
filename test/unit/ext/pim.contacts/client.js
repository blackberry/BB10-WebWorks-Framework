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
    client = require(_apiDir + "/client"),
    ContactFindOptions = client.ContactFindOptions,
    ContactAddress = client.ContactAddress,
    ContactError = client.ContactError,
    ContactField = client.ContactField,
    ContactName = client.ContactName,
    ContactOrganization = client.ContactOrganization,
    ContactPhoto = client.ContactPhoto,
    ContactPickerOptions = client.ContactPickerOptions,
    mockedWebworks = {
        execAsync: jasmine.createSpy("webworks.execAsync"),
        execSync: jasmine.createSpy("webworks.execSync"),
        event: {
            isOn: jasmine.createSpy("webworks.event.isOn"),
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

describe("pim.contacts client", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("find", function () {
        it("execAsync and once should have been called for pim.contacts.find() if correct arguments are passed", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], // filter
                limit: 5 // limit
            }, successCb, errorCb);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "find", jasmine.any(Object));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
            expect(successCb).toHaveBeenCalledWith([]);
            expect(errorCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if contactFields is missing or empty", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find([], {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], // filter
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if filter field name is missing", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldValue: "John"
                }], // filter
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if filter field name is invalid", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldName: 2343,
                    fieldValue: "John"
                }], // filter
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if filter field value is missing", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME
                }], // filter
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if limit is not a number", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], new ContactFindOptions(
                [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], // filter
                null, // sort
                "abc" // limit
            ), successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if sort field name is missing", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], // filter
                sort: [{
                    desc: true
                }], // sort
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });

        it("error callback is invoked for pim.contacts.find() if sort desc property is missing", function () {
            var successCb = jasmine.createSpy(),
                errorCb = jasmine.createSpy();

            client.find(["name"], {
                filter: [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "John"
                }], // filter
                sort: [{
                    fieldName: ContactFindOptions.SORT_FIELD_GIVEN_NAME
                }], // sort
                limit: 5 // limit
            }, successCb, errorCb);

            expect(errorCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            expect(successCb).not.toHaveBeenCalled();
        });
    });

    describe("Testing getContact", function () {
        it("has method getContact", function () {
            expect(client.getContact).toBeDefined();
        });

        it("returns the contact with specific contactId", function () {
            var contact = client.getContact();
            expect(contact).toBeDefined();
        });
    });

    describe("create", function () {
        it("pim.contacts.create() returns a Contact object with all specified properties set", function () {
            var contact = client.create({
                name: {
                    familyName: "Smith",
                    givenName: "John",
                    middleName: "Francis"
                },
                addresses: [
                    {
                        streetAddress: "200 University Ave W",
                        locality: "Waterloo",
                        country: "Canada",
                        postalCode: "N2L3G1"
                    }
                ],
                note: "This is a test",
                emails: [
                    { type: ContactField.HOME, value: "jsmith@blah.com" },
                    { type: ContactField.WORK, value: "jsmith@work.com" }
                ],
                organizations: [
                    {
                        name: "RIM",
                        department: "R&D",
                        title: "Software Developer"
                    }
                ],
                favorite: true,
                photos: [
                    { originalFilePath: "path/to/pic", pref: true },
                    { originalFilePath: "path/to/anotherpic", pref: false }
                ],
                random: "hahaha"
            });

            expect(contact.name.familyName).toBe("Smith");
            expect(contact.name.givenName).toBe("John");
            expect(contact.name.middleName).toBe("Francis");
            expect(contact.note).toBe("This is a test");
            expect(contact.emails.length).toBe(2);
            expect(contact.emails[0].type).toBe(ContactField.HOME);
            expect(contact.emails[0].value).toBe("jsmith@blah.com");
            expect(contact.emails[1].type).toBe(ContactField.WORK);
            expect(contact.emails[1].value).toBe("jsmith@work.com");
            expect(contact.favorite).toBe(true);
            expect(contact.addresses.length).toBe(1);
            expect(contact.addresses[0].streetAddress).toBe("200 University Ave W");
            expect(contact.addresses[0].locality).toBe("Waterloo");
            expect(contact.addresses[0].country).toBe("Canada");
            expect(contact.addresses[0].postalCode).toBe("N2L3G1");
            expect(contact.organizations.length).toBe(1);
            expect(contact.organizations[0].name).toBe("RIM");
            expect(contact.organizations[0].department).toBe("R&D");
            expect(contact.organizations[0].title).toBe("Software Developer");
            expect(contact.photos.length).toBe(2);
            expect(contact.photos[0].pref).toBe(true);
            expect(contact.photos[0].originalFilePath).toBe("path/to/pic");
            expect(contact.photos[1].pref).toBe(false);
            expect(contact.photos[1].originalFilePath).toBe("path/to/anotherpic");
            expect(contact.random).not.toBeDefined();
        });
    });

    describe("invokeContactPicker", function () {
        it("invokeContactPicker calls onInvoke with error for invalid picker mode", function () {
            var doneCb = jasmine.createSpy(),
                cancelCb = jasmine.createSpy(),
                invokeCb = jasmine.createSpy();

            mockedWebworks.event.once = jasmine.createSpy("webworks.event.once");

            client.invokeContactPicker({
                mode: "ridiculous!"
            }, doneCb, cancelCb, invokeCb);

            expect(doneCb).not.toHaveBeenCalled();
            expect(cancelCb).not.toHaveBeenCalled();
            expect(invokeCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        });

        it("invokeContactPicker calls onInvoke with error for mode=Attribute but filters are missing", function () {
            var doneCb = jasmine.createSpy(),
                cancelCb = jasmine.createSpy(),
                invokeCb = jasmine.createSpy();

            mockedWebworks.event.once = jasmine.createSpy("webworks.event.once");

            client.invokeContactPicker({
                mode: ContactPickerOptions.MODE_ATTRIBUTE
            }, doneCb, cancelCb, invokeCb);

            expect(doneCb).not.toHaveBeenCalled();
            expect(cancelCb).not.toHaveBeenCalled();
            expect(invokeCb).toHaveBeenCalledWith(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        });

        it("invokeContactPicker should register client callbacks", function () {
            var doneCb = jasmine.createSpy(),
                cancelCb = jasmine.createSpy(),
                invokeCb = jasmine.createSpy();

            mockedWebworks.execAsync = jasmine.createSpy("webworks.execAsync").andCallFake(function () {
                doneCb({
                    contactId: "123"
                });
            });

            client.invokeContactPicker({
                mode: ContactPickerOptions.MODE_SINGLE
            }, doneCb, cancelCb, invokeCb);

            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeContactPicker", jasmine.any(Object));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
            expect(doneCb).toHaveBeenCalledWith({
                contactId: "123"
            });
            expect(cancelCb).not.toHaveBeenCalled();
        });
    });
});
