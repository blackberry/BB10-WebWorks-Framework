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
    ContactActivity,
    ContactPickerOptions,
    clonedContact,
    foundContact;

function deleteContactWithMatchingLastName(lastName) {
    var findOptions = {
            filter: [{
                fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                fieldValue: lastName
            }]
        },
        numContactsRemoved = 0,
        numContactsNotRemoved = 0,
        numContactsFound = -1,
        successCb = function () {
            numContactsRemoved++;
        },
        errorCb = function () {
            numContactsNotRemoved++;
        },
        curIndex;

    contacts.find(["name"], findOptions, function (contacts) {
        numContactsFound = contacts.length;
        contacts.forEach(function (c, index) {
            curIndex = index;
            c.remove(successCb, errorCb);
            waitsFor(function () {
                return numContactsRemoved + numContactsNotRemoved === curIndex + 1;
            }, "Contact not removed", 15000);
        });
    }, function (error) {
        console.log("Failed to clean up contacts with last name '" + lastName + "', error code=" + error.code);
    });

    waitsFor(function () {
        return numContactsFound !== -1 && (numContactsRemoved + numContactsNotRemoved === numContactsFound);
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
    ContactActivity = contacts.ContactActivity;
    ContactPickerOptions = contacts.ContactPickerOptions;
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
            expect(blackberry.pim.contacts.ContactPickerOptions).toBeDefined();
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

        it('blackberry.pim.contacts.ContactActivity constants should exist', function () {
            expect(ContactActivity.INCOMING).toBeDefined();
            expect(ContactActivity.OUTGOING).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactActivity constants should be read-only', function () {
            testReadOnly(ContactActivity, "INCOMING");
            testReadOnly(ContactActivity, "OUTGOING");
        });

        it('blackberry.pim.contacts.ContactPickerOptions constants should exist', function () {
            expect(ContactPickerOptions.MODE_SINGLE).toBeDefined();
            expect(ContactPickerOptions.MODE_MULTIPLE).toBeDefined();
            expect(ContactPickerOptions.MODE_ATTRIBUTE).toBeDefined();
        });

        it('blackberry.pim.contacts.ContactPickerOptions constants should be read-only', function () {
            testReadOnly(ContactPickerOptions.MODE_SINGLE, 0);
            testReadOnly(ContactPickerOptions.MODE_MULTIPLE, 1);
            testReadOnly(ContactPickerOptions.MODE_ATTRIBUTE, 2);
        });
    });

    describe("Child objects creation", function () {
        it('Can create blackberry.pim.contacts.ContactName object', function () {
            var name = {
                "formatted": "John F. Kennedy",
                "familyName": "Kennedy",
                "givenName": "John",
                "middleName": "Fitzgerald",
                "honorificPrefix": "Mr.",
                "honorificSuffix": "ABC",
                "phoneticFamilyName": "Kennedy",
                "phoneticGivenName": "John"
            };
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
            var addr = {
                "type": "work",
                "streetAddress": "200 University Ave W",
                "streetOther": "University of Waterloo",
                "locality": "Waterloo",
                "region": "Kitchener-Waterloo",
                "postalCode": "N2L 3G1",
                "country": "Canada"
            };
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
            var email = {
                    type: ContactField.HOME,
                    value: "abc@rim.com"
                };
            expect(email).toBeDefined();
            expect(email.type).toBe(ContactField.HOME);
            expect(email.value).toBe("abc@rim.com");
        });

        it('Can create blackberry.pim.contacts.ContactOrganization object', function () {
            var org = {
                "name": "Research In Motion",
                "department": "Research",
                "title": "Software Developer"
            };
            expect(org).toBeDefined();
            expect(org.name).toBe("Research In Motion");
            expect(org.department).toBe("Research");
            expect(org.title).toBe("Software Developer");
        });

        it('Can create blackberry.pim.contacts.ContactPhoto object', function () {
            var photo = {
                originalFilePath: blackberry.io.sharedFolder + "/pictures/001.jpg",
                pref: true
            };
            expect(photo.originalFilePath).toBe(blackberry.io.sharedFolder + "/pictures/001.jpg");
            expect(photo.pref).toBe(true);
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
                findOptions = {
                    filter: filter,
                    sort: sort,
                    limit: 5,
                    favorite: false
                };
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
                name = {
                    familyName: "Kennedy",
                    givenName: "John"
                },
                org = {
                    name: "Research In Motion"
                },
                workEmail = {
                    type: ContactField.WORK,
                    value: "jfk@rim.com"
                },
                homeEmail = {
                    type: ContactField.HOME,
                    value: "jfk@home.com"
                },
                blog = {
                    type: "blog",
                    value: "http://www.jfk.com"
                },
                homePhone = {
                    type: ContactField.HOME,
                    value: "342342333"
                },
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
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Alessandro");
                    called = true;
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

                new_contact.name = {};
                new_contact.name.givenName = first_name;
                new_contact.name.familyName = last_name;
                new_contact.name.middleName = "Middle";

                new_contact.phoneNumbers = [ { type: "home", value: "1234567890" },
                                             { type: "work", value: "0987654321" } ];

                new_contact.faxNumbers = [ { type: "home", value: "1111111111" },
                                           { type: "direct", value: "2222222222" } ];

                new_contact.emails = [ { type: "home", value: "abc@person.com" },
                                       { type: "work", value: "fgh@rim.com" } ];

                new_contact.ims = [ { type: "GoogleTalk", value: "gggggggg" },
                                    { type: "Aim", value: "aaaaa" } ];

                new_contact.urls = [ { type: "personal", value: "www.mywebsite.com" } ];

                new_contact.addresses = [ {"type": "home", "streetAddress": "123 Rainbow Rd", "locality": "Toronto", "region": "Ontario", "country": "Canada"},
                                          {"type": "work", "streetAddress": "4701 Tahoe Blvd", "streetOther": "Tahoe B", "locality": "Mississauga", "region": "Ontario", "country": "Canada", "postalCode": "L4W3B1"} ];

                new_contact.organizations = [ {"name": "RIM", "department": "BlackBerry WebWorks", "title": "Developer"},
                                              {"name": "IBM", "title": "Manager"},
                                              {"name": "The Cool Co.", "department": "Cooler", "title": "Mr. Cool"} ];

                new_contact.photos = [ {originalFilePath: blackberry.io.sharedFolder + "/camera/earth.gif", pref: false},
                                       {originalFilePath: blackberry.io.sharedFolder + "/camera/twitter.jpg", pref: true} ];

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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                error = false,
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);

                    if (contacts.length === 1) {
                        foundContact = contacts[0];
                        expect(contacts[0].name).toBeDefined();
                        expect(contacts[0].name.givenName).toBe("Alessandro");
                        expect(contacts[0].name.familyName).toBe("Smith");
                    }

                    called = true;
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, successCb, errorCb);
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
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();

                    if (foundContact) {
                        expect(contact.id).not.toEqual(foundContact.id);
                    }

                    expect(contact.id).not.toBe("");
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Alessandro");
                    expect(contact.name.familyName).toBe("Smith");
                    clonedContact = contact;
                    called = true;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                });

            if (foundContact) {
                clonedContact = foundContact.clone();
                clonedContact.save(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "success/error callback never called", 15000);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();
                });
            } else {
                console.log("foundContact not defined");
            }
        });

        it('Can edit and save the cloned contact', function () {
            var first_name,
                last_name,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function (contact) {
                    expect(contact).toBeDefined();
                    expect(contact.id).toBeDefined();
                    expect(contact.id).toBe(clonedContact.id);
                    expect(contact.name).toBeDefined();
                    expect(contact.name.givenName).toBe("Benjamin");
                    expect(contact.name.familyName).toBe("Smith");
                    expect(contact.emails).toBe(null);
                    called = true;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    called = true;
                });

            first_name = "Benjamin";
            last_name = "Smith";

            if (clonedContact) {
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
            } else {
                console.log("clonedContact not defined");
            }
        });

        it('Can find the contact that was just edited', function () {
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Benjamin"
                    }]
                },
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);

                    if (contacts.length === 1) {
                        clonedContact = contacts[0];
                        expect(contacts[0].name).toBeDefined();
                        expect(contacts[0].name.givenName).toBe("Benjamin");
                        expect(contacts[0].name.familyName).toBe("Smith");
                    }

                    called = true;
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            contacts.find(["name", "emails"], findOptions, successCb, errorCb);

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it('Ensures that only non-null values in Contact are updated', function () {
            if (clonedContact) {
                // emails field was set null previously
                expect(clonedContact.emails.length).toBe(2);
                expect(clonedContact.emails[0].type).toBe("home");
                expect(clonedContact.emails[0].value).toBe("abc@person.com");
                expect(clonedContact.emails[1].type).toBe("work");
                expect(clonedContact.emails[1].value).toBe("fgh@rim.com");
            } else {
                console.log("clonedContact not defined");
            }
        });

        it('Returns error when save() is called with an invalid id', function () {
            var badContact,
                called = false,
                successCb = jasmine.createSpy("onSaveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onSaveError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
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
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
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
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                called = false,
                successCb = jasmine.createSpy("onRemoveSuccess").andCallFake(function () {
                    called = true;
                }),
                errorCb = jasmine.createSpy("onRemoveError").andCallFake(function (errorObj) {
                    called = true;
                }),
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    if (contacts.length === 1) {
                        expect(contacts[0].id).toBeDefined();
                        expect(contacts[0].id).toBe(foundContact.id);
                    }

                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            if (clonedContact) {
                clonedContact.remove(successCb, errorCb);

                waitsFor(function () {
                    return called;
                }, "success/error callback never called", 15000);

                runs(function () {
                    expect(successCb).toHaveBeenCalled();
                    expect(errorCb).not.toHaveBeenCalled();

                    called = false;
                    contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
                });

                waitsFor(function () {
                    return called;
                }, "find success/error callback never called", 15000);

                runs(function () {
                    expect(findSuccessCb).toHaveBeenCalled();
                    expect(findErrorCb).not.toHaveBeenCalled();
                });
            } else {
                console.log("clonedContact not defined");
            }
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

            if (foundContact) {
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
            } else {
                console.log("foundContact not defined");
            }
        });

        it('Search results no longer contain removed contact', function () {
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(0);
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
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

    describe("blackberry.pim.contacts.getContact", function () {
        var contactToFind = null;
        afterEach(function () {
            deleteContactWithMatchingLastName("WebWorksTest");
        });

        it('can get the contact with specified contactId as a String', function () {
            var contactFound,
                name = {
                    "familyName": "WebWorksTest",
                    "givenName": "John"
                },
                workPhone = { type: ContactField.WORK, value: "123-456-789" },
                workEmail = { type: ContactField.WORK, value: "abc@blah.com" },
                contact = contacts.create({
                    "name": name,
                    "phoneNumbers": [workPhone],
                    "emails": [workEmail]
                }),
                successCreateContact = jasmine.createSpy().andCallFake(function (contact) {
                    contactToFind = contact;
                }),
                errorCreateContact = jasmine.createSpy();

            runs(function () {
                contact.save(successCreateContact, errorCreateContact);
            });

            waitsFor(function () {
                return !!contactToFind;
            }, "create new contact was failed", 15000);
            runs(function () {
                contactFound = contacts.getContact(contactToFind.id.toString());
                expect(contactFound.id).toBe(contactToFind.id);
                expect(contactFound.name).toEqual(contactToFind.name);
                expect(contactFound.phoneNumbers).toEqual([workPhone]);
                expect(contactFound.emails).toEqual([workEmail]);
            });
        });

        it('cannot get the contact with if the specified contactId is a Number', function () {
            var contactFound;

            runs(function () {
                expect(typeof parseInt(contactToFind.id, 10)).toEqual("number");
                contactFound = contacts.getContact(parseInt(contactToFind.id, 10));
                expect(contactFound).toBe(null);
            });
        });
    });

    describe("blackberry.pim.contacts.invokeContactPicker()", function () {
        it("open contact picker then close it", function () {
            var delay = 20000,
                reason,
                callback,
                called = false,
                onDone = jasmine.createSpy("onDone"),
                onCancel = jasmine.createSpy("onCancel"),
                onInvoke = jasmine.createSpy("onInvoke").andCallFake(function () {
                    called = true;
                }),
                onCardClosed = jasmine.createSpy("onCardClosed").andCallFake(function (request) {
                    blackberry.event.removeEventListener("onChildCardClosed", callback);
                    reason = request.reason;
                    called = true;
                });

            contacts.invokeContactPicker({ mode: ContactPickerOptions.MODE_SINGLE }, onDone, onCancel, onInvoke);

            waits(delay / 4);

            runs(function () {
                expect(onInvoke).toHaveBeenCalled();

                called = false;
                blackberry.event.addEventListener("onChildCardClosed", onCardClosed);
                blackberry.invoke.closeChildCard();

                waitsFor(function () {
                    return called;
                }, delay);

                runs(function () {
                    // Currently the response that comes onChildCardClosed is not informative or just emtpy.
                    expect(reason).toBe("closed");
                });
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
                deleteContactWithMatchingLastName("WebWorksTest");
            }
        });

        it('Find with missing ContactFindOptions invokes error callback', function () {
            var error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], null, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: 107,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["badFieldName", "emails"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }],
                    sort: [{
                        fieldName: 23423,
                        desc: false
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smith"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Alessandro"
                    }],
                    sort: [{
                        fieldName: ContactFindOptions.SORT_FIELD_FAMILY_NAME
                    }]
                },
                error = false,
                called = false,
                findSuccessCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    called = true;
                }),
                findErrorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    expect(errorObj.code).toBeDefined();
                    expect(errorObj.code).toBe(ContactError.INVALID_ARGUMENT_ERROR);
                    called = true;
                });

            try {
                contacts.find(["name", "emails"], findOptions, findSuccessCb, findErrorCb);
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
            var addr = {
                    "type": "work",
                    "streetAddress": "200 University Ave W",
                    "streetOther": "University of Waterloo",
                    "locality": "Waterloo",
                    "region": "Kitchener-Waterloo",
                    "postalCode": "N2L 3G1",
                    "country": "Canada"
                },
                favContact = contacts.create({
                    "name": {
                        "familyName": "Smitherman",
                        "givenName": "Clement"
                    },
                    "favorite": true,
                    "displayName": "csmitherman",
                    "nickname": "CS",
                    "addresses": [addr]
                }),
                nonFavContact = contacts.create({
                    "name": {
                        "familyName": "Smitherman",
                        "givenName": "Clarence"
                    },
                    "favorite": false
                }),
                findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        "fieldValue": "Cl"
                    }, {
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "Smitherman"
                    }],
                    limit: 5,
                    favorite: true
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).toBe(1);

                    if (contacts.length === 1) {
                        expect(contacts[0].name.givenName).toBe("Clement");
                        expect(contacts[0].name.familyName).toBe("Smitherman");
                        expect(contacts[0].favorite).toBe(true);
                    }

                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                favContact.save(function () {
                    nonFavContact.save(function () {
                        contacts.find(["name"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        fieldName: ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        fieldValue: "Smitherman"
                    }, {
                        fieldName: ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        fieldValue: "Clement"
                    }]
                },
                error = false,
                called = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);

                    if (contacts.length === 1) {
                        expect(contacts[0].displayName).toBeDefined();
                        expect(contacts[0].displayName).toBe("csmitherman");
                        expect(contacts[0].nickname).toBeDefined();
                        expect(contacts[0].nickname).toBe("CS");
                        expect(contacts[0].name).toBe(null);
                    }

                    called = true;
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (errorObj) {
                    called = true;
                });

            try {
                contacts.find(["displayName", "nickname"], findOptions, successCb, errorCb);
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
                    "name": {
                        "familyName": "Smitherman",
                        "givenName": "Daniel"
                    }
                }),
                dawn = contacts.create({
                    "name": {
                        "familyName": "Simpson",
                        "givenName": "Dawn"
                    }
                }),
                donna = contacts.create({
                    "name": {
                        "familyName": "Smitherman",
                        "givenName": "Donna"
                    }
                }),
                findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        "fieldValue": "D"
                    }, {
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "S"
                    }],
                    sort: [{
                        "fieldName": ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                        "desc": false
                    }, {
                        "fieldName": ContactFindOptions.SORT_FIELD_GIVEN_NAME,
                        "desc": true
                    }],
                    limit: 5
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).toBe(3);

                    if (contacts.length === 3) {
                        expect(contacts[0].name.givenName).toBe("Dawn");
                        expect(contacts[1].name.givenName).toBe("Donna");
                        expect(contacts[2].name.givenName).toBe("Daniel");
                    }

                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                daniel.save(function () {
                    donna.save(function () {
                        dawn.save(function () {
                            contacts.find(["name"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        "fieldValue": "D"
                    }, {
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "S"
                    }],
                    sort: [{
                        "fieldName": ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                        "desc": false
                    }, {
                        "fieldName": ContactFindOptions.SORT_FIELD_GIVEN_NAME,
                        "desc": true
                    }],
                    limit: 2
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).toBe(2);

                    if (contacts.length === 2) {
                        expect(contacts[0].name.givenName).toBe("Dawn");
                        expect(contacts[1].name.givenName).toBe("Donna");
                    }

                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name"], findOptions, findSuccessCb, findErrorCb);
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
            var findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "Smitherman"
                    }]
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).toBe(4);
                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name"], findOptions, findSuccessCb, findErrorCb);
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

        it("Empty find options return all contacts with no particular sort order", function () {
            var findOptions = {},
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).not.toBeLessThan(5); // in case there are other contacts not for test purpose
                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name", "addresses", "displayName", "nickname"], findOptions, findSuccessCb, findErrorCb);
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

        it("Omitting filters with sort fields specified will return all contacts in a particular sort order", function () {
            var findOptions = {
                    sort: [{
                        fieldName: ContactFindOptions.SORT_FIELD_FAMILY_NAME,
                        desc: false
                    }, {
                        fieldName: ContactFindOptions.SORT_FIELD_GIVEN_NAME,
                        desc: true
                    }]
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    var temp = [];

                    contacts.forEach(function (c) {
                        if (c.name && (c.name.familyName === "Smitherman" || c.name.familyName === "Simpson")) {
                            temp.push(c.name.givenName + " " + c.name.familyName);
                        }
                    });

                    expect(contacts.length).not.toBeLessThan(5); // in case there are other contacts not for test purpose

                    if (contacts.length === 5) {
                        expect(temp[0]).toBe("Dawn Simpson");
                        expect(temp[1]).toBe("Donna Smitherman");
                        expect(temp[2]).toBe("Daniel Smitherman");
                        expect(temp[3]).toBe("Clement Smitherman");
                        expect(temp[4]).toBe("Clarence Smitherman");
                    }

                    called = true;
                }),
                findErrorCb = jasmine.createSpy().andCallFake(function (error) {
                    called = true;
                });

            try {
                contacts.find(["name", "addresses", "displayName", "nickname"], findOptions, findSuccessCb, findErrorCb);
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

        it("Error callback is optional", function () {
            var findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "Smitherman"
                    }]
                },
                called = false,
                error = false,
                findSuccessCb = jasmine.createSpy().andCallFake(function (contacts) {
                    expect(contacts.length).toBe(4);
                    called = true;
                });

            try {
                contacts.find(["name"], findOptions, findSuccessCb);
            } catch (e) {
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                expect(error).toBe(false);
                expect(findSuccessCb).toHaveBeenCalled();
            });
        });

        it("Find populates news with an array of ContactNews when an organization is provided", function () {
            var contactObj,
                called = false,
                error = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    console.log(contacts);
                    expect(contacts.length).toBe(1);

                    if (contacts.length === 1) {
                        expect(contacts[0].name.givenName).toBe("John");
                        expect(contacts[0].name.familyName).toBe("WebWorksTest");
                        expect(contacts[0].news).not.toBe(null);
                        expect(contacts[0].news.length).toBeGreaterThan(0);
                    }

                    called = true;
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (error) {
                    called = true;
                }),
                findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": "WebWorksTest"
                    }]
                };

            contactObj = contacts.create({
                "name": { familyName: "WebWorksTest", givenName: "John" },
                "organizations": [ { name: "Research In Motion" } ]
            });

            try {
                contactObj.save(function () {
                    contacts.find(["name", "news"], findOptions, successCb, errorCb);
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
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        it("Signal the end of all find tests", function () {
            doneTestingFind = true;
        });
    });

    describe("blackberry.pim.contact.getContactAccounts", function () {
        it("returns at least one account", function () {
            var accounts;

            accounts = contacts.getContactAccounts();
            expect(accounts).toBeDefined();
            expect(accounts.length).toBeGreaterThan(0);

        });
    });
});
