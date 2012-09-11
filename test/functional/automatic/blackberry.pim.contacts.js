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

var contacts,
    ContactName,
    ContactAddress,
    ContactField,
    ContactOrganization,
    ContactFindOptions,
    ContactError,
    ContactPhoto,
    clonedContact,
    foundContact;

function deleteContactWithMatchingLastName(lastName) {
    var findOptions = new ContactFindOptions([{
            fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
            fieldValue: lastName
        }]),
        numContactsRemoved = 0,
        numContactsFound = 0,
        successCb = function () {
            numContactsRemoved++;
        };

    contacts.find(["name"], function (contacts, index) {
        numContactsFound = contacts.length;
        contacts.forEach(function (c, index) {
            c.remove(successCb);
            waitsFor(function () {
                return numContactsRemoved === index + 1;
            }, "Contact not removed", 15000);
        });
    }, function (error) {
        console.log("Failed to clean up contacts with last name '" + lastName + "', error code=" + error.code);
    }, findOptions); 

    waitsFor(function () {
        return numContactsRemoved === numContactsFound;
    }, "Not all contacts removed", 15000);

    runs(function () {
        expect(numContactsRemoved).toBe(numContactsFound);
    });
}

function testReadOnly(object, property) {
    var oldValue = object[property];
    object[property] = "test different";
    expect(object[property]).toBe(oldValue);
}

beforeEach(function () {
    contacts = blackberry.pim.contacts;
    ContactName = contacts.ContactName;
    ContactAddress = contacts.ContactAddress;
    ContactField = contacts.ContactField;
    ContactOrganization = contacts.ContactOrganization;
    ContactFindOptions = contacts.ContactFindOptions;
    ContactError = contacts.ContactError;
    ContactPhoto = contacts.ContactPhoto;
});

describe("blackberry.pim.contacts", function () {
    describe("Object and constants definitions", function () {
        it('blackberry.pim.contacts should exist', function () {
            expect(blackberry.pim.contacts).toBeDefined();
        });

        it('blackberry.pim.contacts child objects should exist', function () {
            expect(blackberry.pim.contacts.ContactName).toBeDefined();
            expect(blackberry.pim.contacts.ContactOrganization).toBeDefined();
            expect(blackberry.pim.contacts.ContactAddress).toBeDefined();
            expect(blackberry.pim.contacts.ContactField).toBeDefined();
            expect(blackberry.pim.contacts.ContactPhoto).toBeDefined();
            expect(blackberry.pim.contacts.ContactError).toBeDefined();
            expect(blackberry.pim.contacts.ContactFindOptions).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactFindOptions constants should exist', function () {
            expect(ContactFindOptions.SEARCH_FIELD_GIVEN_NAME).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_FAMILY_NAME).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_ORGANIZATION_NAME).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_PHONE).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_EMAIL).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_BBMPIN).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_LINKEDIN).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_TWITTER).toBeDefined();
            expect(ContactFindOptions.SEARCH_FIELD_VIDEO_CHAT).toBeDefined();
            expect(ContactFindOptions.SORT_FIELD_GIVEN_NAME).toBeDefined();
            expect(ContactFindOptions.SORT_FIELD_FAMILY_NAME).toBeDefined();
            expect(ContactFindOptions.SORT_FIELD_ORGANIZATION_NAME).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactFindOptions constants should be read-only', function () {
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_GIVEN_NAME");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_FAMILY_NAME");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_ORGANIZATION_NAME");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_PHONE");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_EMAIL");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_BBMPIN");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_LINKEDIN");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_TWITTER");
            testReadOnly(ContactFindOptions, "SEARCH_FIELD_VIDEO_CHAT");
            testReadOnly(ContactFindOptions, "SORT_FIELD_GIVEN_NAME");
            testReadOnly(ContactFindOptions, "SORT_FIELD_FAMILY_NAME");
            testReadOnly(ContactFindOptions, "SORT_FIELD_ORGANIZATION_NAME");
        });

        it('blackberry.pim.contacts.ContactError constants should exist', function () {
            expect(ContactError.UNKNOWN_ERROR).toBeDefined();
            expect(ContactError.INVALID_ARGUMENT_ERROR).toBeDefined();
            expect(ContactError.TIMEOUT_ERROR).toBeDefined();
            expect(ContactError.PENDING_OPERATION_ERROR).toBeDefined();
            expect(ContactError.IO_ERROR).toBeDefined();
            expect(ContactError.NOT_SUPPORTED_ERROR).toBeDefined();
            expect(ContactError.PERMISSION_DENIED_ERROR).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactError constants should be read-only', function () {
            testReadOnly(ContactError, "UNKNOWN_ERROR");
            testReadOnly(ContactError, "INVALID_ARGUMENT_ERROR");
            testReadOnly(ContactError, "TIMEOUT_ERROR");
            testReadOnly(ContactError, "PENDING_OPERATION_ERROR");
            testReadOnly(ContactError, "IO_ERROR");
            testReadOnly(ContactError, "NOT_SUPPORTED_ERROR");
            testReadOnly(ContactError, "PERMISSION_DENIED_ERROR");
        });

        it('blackberry.pim.contacts.ContactField constants should exist', function () {
            expect(ContactField.HOME).toBeDefined();
            expect(ContactField.WORK).toBeDefined();
            expect(ContactField.OTHER).toBeDefined();
            expect(ContactField.MOBILE).toBeDefined();
            expect(ContactField.DIRECT).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactField constants should be read-only', function () {
            testReadOnly(ContactField, "HOME");
            testReadOnly(ContactField, "WORK");
            testReadOnly(ContactField, "OTHER");
            testReadOnly(ContactField, "MOBILE");
            testReadOnly(ContactField, "DIRECT");
        });

        it('blackberry.pim.contacts.ContactAddress constants should exist', function () {
            expect(ContactAddress.HOME).toBeDefined();
            expect(ContactAddress.WORK).toBeDefined();
            expect(ContactAddress.OTHER).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactAddress constants should be read-only', function () {
            testReadOnly(ContactAddress, "HOME");
            testReadOnly(ContactAddress, "WORK");
            testReadOnly(ContactAddress, "OTHER");
        });
    });

    describe("Child objects creation", function () {
        it('Can create blackberry.pim.contacts.ContactName object', function () {
            var name = new ContactName({
                "formatted": "John F. Kennedy",
                "familyName": "Kennedy",
                "givenName": "John",
                "middleName": "Fitzgerald",
                "honorificPrefix": "Mr.",
                "honorificSuffix": "ABC",
                "phoneticFamilyName": "Kennedy",
                "phoneticGivenName": "John"
            });
            expect(name).toBeDefined();
            expect(name.formatted).toBe("John F. Kennedy");
            expect(name.familyName).toBe("Kennedy");
            expect(name.givenName).toBe("John");
            expect(name.middleName).toBe("Fitzgerald");
            expect(name.honorificPrefix).toBe("Mr.");
            expect(name.honorificSuffix).toBe("ABC");
            expect(name.phoneticFamilyName).toBe("Kennedy");
            expect(name.givenName).toBe("John");

            name.familyName = "Kent";
            expect(name.familyName).toBe("Kent");
        });

        it('Can create blackberry.pim.contacts.ContactAddress object', function () {
            var addr = new ContactAddress({
                "type": "work",
                "streetAddress": "200 University Ave W",
                "streetOther": "University of Waterloo",
                "locality": "Waterloo",
                "region": "Kitchener-Waterloo",
                "postalCode": "N2L 3G1",
                "country": "Canada"
            });
            expect(addr).toBeDefined();
            expect(addr.type).toBe("work");
            expect(addr.streetAddress).toBe("200 University Ave W");
            expect(addr.streetOther).toBe("University of Waterloo");
            expect(addr.locality).toBe("Waterloo");
            expect(addr.region).toBe("Kitchener-Waterloo");
            expect(addr.postalCode).toBe("N2L 3G1");
            expect(addr.country).toBe("Canada");
        });

        it('Can create blackberry.pim.contacts.ContactField object', function () {
            var email = new ContactField(ContactField.HOME, "abc@rim.com");
            expect(email).toBeDefined();
            expect(email.type).toBe(ContactField.HOME);
            expect(email.value).toBe("abc@rim.com");
        });

        it('Can create blackberry.pim.contacts.ContactOrganization object', function () {
            var org = new ContactOrganization({
                "name": "Research In Motion",
                "department": "Research",
                "title": "Software Developer"
            });
            expect(org).toBeDefined();
            expect(org.name).toBe("Research In Motion");
            expect(org.department).toBe("Research");
            expect(org.title).toBe("Software Developer");
        });

        it('Can create blackberry.pim.contacts.ContactPhoto object', function () {
            var photo = new ContactPhoto("/accounts/1000/shared/pictures/001.jpg", true);
            expect(photo.originalFilePath).toBe("/accounts/1000/shared/pictures/001.jpg");
            expect(photo.pref).toBe(true);
            expect(photo.largeFilePath).toBe("");
            expect(photo.smallFilePath).toBe("");
        });

        it('Can create blackberry.pim.contacts.ContactFindOptions object', function () {
            var filter = [{
                    fieldName: ContactFindOptions.SEARCH_FIELD_EMAIL,
                    fieldValue: "rim.com"
                }],
                sort = [{
                    fieldName: ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                    desc: false
                }],
                findOptions = new ContactFindOptions(filter, sort, 5, false);
            expect(findOptions).toBeDefined();
            expect(findOptions.filter).toBe(filter);
            expect(findOptions.sort).toBe(sort);
            expect(findOptions.limit).toBe(5);
            expect(findOptions.favorite).toBe(false);
        });
    });

    describe("Create and clone contacts (without save)", function () {
        it('Can create Contact object using blackberry.pim.contacts.create()', function () {
            var contactObj,
                name = new ContactName({
                    familyName: "Kennedy",
                    givenName: "John"
                }),
                org = new ContactOrganization({
                    name: "Research In Motion"
                }),
                workEmail = new ContactField(ContactField.WORK, "jfk@rim.com"),
                homeEmail = new ContactField(ContactField.HOME, "jfk@home.com"),
                blog = new ContactField("blog", "http://www.jfk.com"),
                homePhone = new ContactField(ContactField.HOME, "342342333"),
                contactObj2;

            contactObj = contacts.create({
                "name": name,
                "organizations": [org],
                "emails": [workEmail, homeEmail],
                "urls": [blog],
                "phoneNumbers": [homePhone]
            });

            expect(contactObj).toBeDefined();
            expect(contactObj.name).toBe(name);
            expect(contactObj.emails).toContain(workEmail);
            expect(contactObj.emails).toContain(homeEmail);
            expect(contactObj.emails.length).toBe(2);
            expect(contactObj.organizations).toContain(org);
            expect(contactObj.organizations.length).toBe(1);
            expect(contactObj.urls).toContain(blog);
            expect(contactObj.urls.length).toBe(1);
            expect(contactObj.phoneNumbers).toContain(homePhone);
            expect(contactObj.phoneNumbers.length).toBe(1);
            expect(contactObj.birthday).toBe(null);

            expect(typeof contactObj.save).toBe("function");
            expect(typeof contactObj.remove).toBe("function");
            expect(typeof contactObj.clone).toBe("function");

            contactObj2 = contactObj.clone();

            expect(contactObj2.name).toBe(name);
            expect(contactObj2.emails).toContain(workEmail);
            expect(contactObj2.emails).toContain(homeEmail);
            expect(contactObj2.emails.length).toBe(2);
            expect(contactObj2.organizations).toContain(org);
            expect(contactObj2.organizations.length).toBe(1);
            expect(contactObj2.urls).toContain(blog);
            expect(contactObj2.urls.length).toBe(1);
            expect(contactObj2.phoneNumbers).toContain(homePhone);
            expect(contactObj2.phoneNumbers.length).toBe(1);
            expect(contactObj2.birthday).toBe(null);
        });

        it('Ensures that the id field of Contact is read-only', function () {
            var contactObj,
                oldId;

            contactObj = new blackberry.pim.contacts.Contact({"id" : "123", "displayName" : "John"});
            oldId = contactObj.id;
            contactObj.id = "InvalidId";

            expect(contactObj.id).toBe(oldId);
        });

        it('Cannot set the contact id when calling create()', function () {
            var properties = {},
                new_contact;

            properties.id = "abcde";
            properties.displayName = "Catherine Brown";

            new_contact = contacts.create(properties);
            expect(new_contact.id).toBeNull();
            expect(new_contact.displayName).toBe("Catherine Brown");
        });
    });

    describe("Create & save, clone & save, edit & save contacts", function () {
        it('Can create & save a contact to the device using Contact.save()', function () {
            var first_name,
                last_name,
                new_contact,
                error = false,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function (contact) {
                    called = true;
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Alessandro");
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                first_name = "Alessandro";
                last_name = "Smith";
                new_contact = contacts.create();

                new_contact.favorite = true;
                new_contact.birthday = new Date("January 1, 1980");
                new_contact.anniversary = new Date("December 25, 2000");
                new_contact.displayName = "A. Smith";
                new_contact.nickname = "Johnny";

                new_contact.name = new contacts.ContactName();
                new_contact.name.givenName = first_name;
                new_contact.name.familyName = last_name;
                new_contact.name.middleName = "Middle";

                new_contact.phoneNumbers = [ new contacts.ContactField("home", "1234567890", true),
                                             new contacts.ContactField("work", "0987654321", false) ];

                new_contact.faxNumbers = [ new contacts.ContactField("home", "1111111111", false),
                                           new contacts.ContactField("direct", "2222222222", true) ];

                new_contact.emails = [ new contacts.ContactField("home", "abc@person.com", false),
                                       new contacts.ContactField("work", "fgh@rim.com", true) ];

                new_contact.ims = [ new contacts.ContactField("GoogleTalk", "gggggggg", true),
                                    new contacts.ContactField("Aim", "aaaaa", false) ];

                new_contact.urls = [ new contacts.ContactField("personal", "www.mywebsite.com", true) ];

                new_contact.addresses = [ new contacts.ContactAddress({"type": "home", "streetAddress": "123 Rainbow Rd", "locality": "Toronto", "region": "Ontario", "country": "Canada"}),
                                          new contacts.ContactAddress({"type": "work", "streetAddress": "4701 Tahoe Blvd", "streetOther": "Tahoe B", "locality": "Mississauga", "region": "Ontario", "country": "Canada", "postalCode": "L4W3B1"}) ];

                new_contact.organizations = [ new contacts.ContactOrganization({"name": "RIM", "department": "BlackBerry WebWorks", "title": "Developer"}),
                                              new contacts.ContactOrganization({"name": "IBM", "title": "Manager"}),
                                              new contacts.ContactOrganization({"name": "The Cool Co.", "department": "Cooler", "title": "Mr. Cool"}) ];

                new_contact.photos = [ new contacts.ContactPhoto("/accounts/1000/shared/camera/earth.gif", false),
                                       new contacts.ContactPhoto("/accounts/1000/shared/camera/twitter.jpg", true) ];

                new_contact.note = "This is a test contact for the PIM WebWorks API";
                new_contact.videoChat = ["abc", "def"];
                new_contact.ringtone = "qwerty";

                new_contact.save(successCb, errorCb);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Can find the contact that has just been created', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                error = false,
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);
                    foundContact = contacts[0];
                    expect(contacts[0].name).toBeDefined();
                    expect(contacts[0].name.givenName).toBe("Alessandro");
                    expect(contacts[0].name.familyName).toBe("Smith");
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], successCb, errorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Can clone and save a contact', function () {
            var called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function (contact) {
                    called = true;
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();
                    expect(contact.id).not.toBe(foundContact.id);
                    expect(contact.id).not.toBe("");
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Alessandro");
                    expect(contact.name.familyName).toBe("Smith");
                    clonedContact = contact;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                });

            clonedContact = foundContact.clone();
            clonedContact.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Can edit and save the cloned contact', function () {
            var first_name,
                last_name,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function (contact) {
                    called = true;
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();
                    expect(contact.id).toBe(clonedContact.id);
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Benjamin");
                    expect(contact.name.familyName).toBe("Smith");
                    expect(contact.emails).toBe(null);
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                });

            first_name = "Benjamin";
            last_name = "Smith";
            clonedContact.name.givenName = first_name;
            clonedContact.name.familyName = last_name;
            clonedContact.emails = null;

            clonedContact.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Can find the contact that was just edited', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Benjamin"
                }], [], 1, false),
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);
                    clonedContact = contacts[0];
                    expect(contacts[0].name).toBeDefined();
                    expect(contacts[0].name.givenName).toBe("Benjamin");
                    expect(contacts[0].name.familyName).toBe("Smith");
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            contacts.find(["name", "emails"], successCb, errorCb, findOptions);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Ensures that only non-null values in Contact are updated', function () {
            // emails field was set null previously
            expect(clonedContact.emails.length).toBe(2);
            expect(clonedContact.emails[0].type).toBe("home");
            expect(clonedContact.emails[0].value).toBe("abc@person.com");
            expect(clonedContact.emails[1].type).toBe("work");
            expect(clonedContact.emails[1].value).toBe("fgh@rim.com");
        });

        it('Returns error when save() is called with an invalid id', function () {
            var badContact,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            badContact = new blackberry.pim.contacts.Contact({"id" : "abcde"});
            badContact.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });

        it('Returns error when save() is called with a non-existent Contact id', function () {
            var badContact,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            badContact = new blackberry.pim.contacts.Contact({"id" : "123456789"});
            badContact.save(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });
    });

    describe("Remove contacts", function () {
        it('Returns error when remove() is called on nonexistent contact', function () {
            var badContact,
                called = false,
                successCb = jasmine.createSpy("onRemoveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onRemoveError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            badContact = new blackberry.pim.contacts.Contact({"id" : "123456789"});
            badContact.remove(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalled();
            });
        });

        it('Can remove a clone without removing the original contact', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                called = false,
                successCb = jasmine.createSpy("onRemoveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onRemoveError").andCallFake(function (errorObj) {
                    called = true;
                }),
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                    expect(contacts[0].id).toBeDefined();
                    expect(contacts[0].id).toBe(foundContact.id);
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });


            clonedContact.remove(successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();

                called = false;
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            });

            waitsFor(function () {
                return called;
            }, "find success/error callback never called", 15000);

            runs(function () {
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });

        it('Can remove the contact from the device', function () {
            var error = false,
                called = false,
                removeSuccessCb = jasmine.createSpy("onRemoveSuccess").andCallFake(function () {
                    called = true;
                }),
                removeErrorCb = jasmine.createSpy("onRemoveError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                foundContact.remove(removeSuccessCb, removeErrorCb);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(removeSuccessCb).toHaveBeenCalled();
                expect(removeErrorCb).not.toHaveBeenCalled();
            });
        });

        it('Search results no longer contain removed contact', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(0);
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });
    });

    describe("Find contacts", function () {
        var doneTestingFind = false;

        // clean up all contacts with last name "Smitherman" and "Simpson" after PIM Contacts tests
        afterEach(function () {
            if (doneTestingFind) {
                deleteContactWithMatchingLastName("Smitherman");
                deleteContactWithMatchingLastName("Simpson");
            }
        });

        it('Find with missing ContactFindOptions invokes error callback', function () {
            var error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Find with invalid search field name invokes error callback', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: 107,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Find with missing search field value invokes error callback', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Find with invalid contact field name invokes error callback', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["badFieldName", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Find with invalid sort field name invokes error callback', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [{
                    fieldName: 23423,
                    desc: false
                }], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Find with missing desc property in sort spec invokes error callback', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smith"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Alessandro"
                }], [{
                    fieldName: ContactFindOptions.SORT_FIELD_FAMILY_NAME
                }], 1, false),
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                });

            try {
                contacts.find(["name", "emails"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).not.toHaveBeenCalled();
                expect(findErrorCb).toHaveBeenCalled();
            });
        });

        it('Setting favorite=true find favorite contacts only', function () {
            var favContact = contacts.create({
                    "name": new ContactName({
                        "familyName": "Smitherman",
                        "givenName": "Clement"
                    }),
                    "favorite": true,
                    "displayName": "csmitherman",
                    "nickname": "CS"
                }),
                nonFavContact = contacts.create({
                    "name": new ContactName({
                        "familyName": "Smitherman",
                        "givenName": "Clarence"
                    }),
                    "favorite": false
                }),
                findOptions = new ContactFindOptions([{
                    "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    "fieldValue": "Cl"
                }, {
                    "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    "fieldValue": "Smitherman"
                }],
                null,
                5,
                true),
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    called = true;
                    expect(contacts.length).toBe(1);
                    expect(contacts[0].name.givenName).toBe("Clement");
                    expect(contacts[0].name.familyName).toBe("Smitherman");
                    expect(contacts[0].favorite).toBe(true);
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                favContact.save(function () {
                    nonFavContact.save(function () {
                        contacts.find(["name"], findSuccessCb, findErrorCb, findOptions);
                    });
                });
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });

        it('Find populates displayName and nickname properly even if name is not included in the list of fields', function () {
            var findOptions = new ContactFindOptions([{
                    fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    fieldValue: "Smitherman"
                }, {
                    fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    fieldValue: "Clement"
                }], [], 1, false),
                error = false,
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);
                    expect(contacts[0].displayName).toBeDefined();
                    expect(contacts[0].displayName).toBe("csmitherman");
                    expect(contacts[0].nickname).toBeDefined();
                    expect(contacts[0].nickname).toBe("CS");
                    expect(contacts[0].name).toBe(null);
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["displayName", "nickname"], successCb, errorCb, findOptions);
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it("Sort descending should work in find", function () {
            var daniel = contacts.create({
                    "name": new ContactName({
                        "familyName": "Smitherman",
                        "givenName": "Daniel"
                    })
                }),
                dawn = contacts.create({
                    "name": new ContactName({
                        "familyName": "Simpson",
                        "givenName": "Dawn"
                    })
                }),
                donna = contacts.create({
                    "name": new ContactName({
                        "familyName": "Smitherman",
                        "givenName": "Donna"
                    })
                }),
                findOptions = new ContactFindOptions([{
                    "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    "fieldValue": "D"
                }, {
                    "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    "fieldValue": "S"
                }], [{
                    "fieldName": ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                    "desc": false
                }, {
                    "fieldName": ContactFindOptions.SORT_FIELD_GIVEN_NAME,
                    "desc": true
                }],
                5),
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    called = true;
                    expect(contacts.length).toBe(3);
                    expect(contacts[0].name.givenName).toBe("Dawn");
                    expect(contacts[1].name.givenName).toBe("Donna");
                    expect(contacts[2].name.givenName).toBe("Daniel");
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                daniel.save(function () {
                    donna.save(function () {
                        dawn.save(function () {
                            contacts.find(["name"], findSuccessCb, findErrorCb, findOptions);
                        });
                    });
                });
            } catch (e) {
                console.log("Error:  " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });

        it("Limit on search results restrict max number of search results", function () {
            var findOptions = new ContactFindOptions([{
                    "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    "fieldValue": "D"
                }, {
                    "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    "fieldValue": "S"
                }], [{
                    "fieldName": ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                    "desc": false
                }, {
                    "fieldName": ContactFindOptions.SORT_FIELD_GIVEN_NAME,
                    "desc": true
                }],
                2),
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    called = true;
                    expect(contacts.length).toBe(2);
                    expect(contacts[0].name.givenName).toBe("Dawn");
                    expect(contacts[1].name.givenName).toBe("Donna");
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });

        it("Omitting limit return all matching search results", function () {
            var findOptions = new ContactFindOptions([{
                    "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    "fieldValue": "Smitherman"
                }]),
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    called = true;
                    expect(contacts.length).toBe(4);
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name"], findSuccessCb, findErrorCb, findOptions);
            } catch (e) {
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
                expect(findErrorCb).not.toHaveBeenCalled();
            });
        });

        it("Signal the end of all find tests", function () {
            doneTestingFind = true;
        });
    });
});
