/*
 * Copyright 2011-2012 Research In Motion Limited.
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
    ContactFindOptions,
    ContactPhoto;

describe("blackberry.pim.contacts", function () {
    beforeEach(function () {
        contacts = blackberry.pim.contacts;
        ContactFindOptions = contacts.ContactFindOptions;
        ContactPhoto = contacts.ContactPhoto;
    });

    describe("Find populates Contact properties", function () {
        it("should populate activities", function () {
            window.confirm("Please supply the name of a contact which has entries under their activities tab from the Contacts App. Activities entries can be call logs or emails between yourself and the contact.");

            var given = prompt("Enter contact's given name:", "John"),
                family = prompt("Enter contact's family name:", "Doe"),
                called = false,
                error = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    console.log(contacts);
                    called = true;
                    expect(contacts).toBeDefined();
                    expect(contacts.hasOwnProperty("length")).toBeTruthy();
                    expect(contacts.length).not.toBe(0);
                    expect(contacts[0].name.givenName).toBe(given);
                    expect(contacts[0].name.familyName).toBe(family);
                    expect(contacts[0].activities).not.toBe([]);
                    expect(contacts[0].activities.length).toBeGreaterThan(0);
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (error) {
                    called = true;
                }),
                findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": family
                    }, {
                        "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        "fieldValue": given
                    }]
                };

            try {
                contacts.find(["name", "activities"], findOptions, successCb, errorCb);
            } catch (e) {
                console.log("Error: " + e);
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
    });

    describe("Setting contact picture works", function () {
        it("should be able to set a picture from shared camera folder as contact picture", function () {
            window.confirm("Please supply the name of a contact which does not have a picture in the Contact App. Please ensure your shared/camera folder has an image named IMG_00000001.jpg");

            var given = prompt("Enter contact's given name:", "John"),
                family = prompt("Enter contact's family name:", "Doe"),
                called = false,
                error = false,
                successCb = jasmine.createSpy("onFindSuccess").andCallFake(function (contacts) {
                    console.log(contacts);
                    called = true;
                    expect(contacts.length).toBeDefined();
                    expect(contacts.length).not.toBe(0);

                    var pic = 
                        { 
                            originalFilePath: blackberry.io.sharedFolder + "/camera/IMG_00000001.jpg",
                            pref: true
                        },
                        saveCalled = false,
                        picSet = false,
                        saveSuccessCb = jasmine.createSpy().andCallFake(function (saved) {
                            saveCalled = true;
                            console.log(saved);
                            picSet = window.confirm("Press OK if contact app now shows the contact with the pic.");
                            expect(picSet).toBeTruthy();
                        }),
                        saveErrorCb = jasmine.createSpy().andCallFake(function (error) {
                            saveCalled = true;
                            console.log("error");
                            console.log(error);
                        });
                    contacts[0].photos = [pic];
                    contacts[0].save(saveSuccessCb, saveErrorCb);
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (error) {
                    console.log("Contact find error");
                    called = true;
                }),
                findOptions = {
                    filter: [{
                        "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                        "fieldValue": family
                    }, {
                        "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                        "fieldValue": given
                    }]
                };

            try {
                contacts.find(["name", "activities"], findOptions, successCb, errorCb);
            } catch (e) {
                console.log("Error: " + e);
                error = true;
            }

            waitsFor(function () {
                return called;
            }, "success/error callback never called", 15000);

            runs(function () {
                console.log("before asserts");
                expect(error).toBe(false);
                expect(successCb).toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });
    });

    describe("Contact picker works", function () {
        it("can call cancel callback if user cancels", function () {
            window.alert("Click Cancel button when contact picker opens.");

            var called = false,
                onDone = jasmine.createSpy("done4"),
                onCancel = jasmine.createSpy("cancel4").andCallFake(function () {
                    called = true;
                }),
                onInvoke = jasmine.createSpy("invoke4").andCallFake(function (error) {
                    expect(error).not.toBeDefined();
                });

            contacts.invokeContactPicker({
                mode: contacts.ContactPickerOptions.MODE_SINGLE
            }, onDone, onCancel, onInvoke);

            waitsFor(function () {
                return called;
            }, "callback never called", 25000);

            runs(function () {
                expect(onDone).not.toHaveBeenCalled();
                expect(onCancel).toHaveBeenCalled();
                expect(onInvoke).toHaveBeenCalled();
            });
        });

        it("can invoke contact picker with mode=single", function () {
            window.alert("Click on a contact when the contact picker opens.");

            var called = false,
                onDone = jasmine.createSpy("done1").andCallFake(function (data) {
                    expect(data.contactId).toBeDefined();
                    expect(data.contactId).toEqual(jasmine.any(String));
                    called = true;
                }),
                onCancel = jasmine.createSpy("cancel1"),
                onInvoke = jasmine.createSpy("invoke1").andCallFake(function (error) {
                    expect(error).not.toBeDefined();
                });

            contacts.invokeContactPicker({
                mode: contacts.ContactPickerOptions.MODE_SINGLE
            }, onDone, onCancel, onInvoke);

            waitsFor(function () {
                return called;
            }, "callback never called", 15000);

            runs(function () {
                expect(onDone).toHaveBeenCalled();
                expect(onCancel).not.toHaveBeenCalled();
                expect(onInvoke).toHaveBeenCalled();
            });
        });

        it("can invoke contact picker with mode=multiple", function () {
            window.alert("Click on more than two contact when the contact picker opens, then click Done.");

            var called = false,
                onDone = jasmine.createSpy("done2").andCallFake(function (data) {
                    expect(data.contactIds).toBeDefined();
                    expect(Array.isArray(data.contactIds)).toEqual(true);
                    expect(data.contactIds.length).toEqual(2);
                    called = true;
                }),
                onCancel = jasmine.createSpy("cancel2"),
                onInvoke = jasmine.createSpy("invoke2").andCallFake(function (error) {
                    expect(error).not.toBeDefined();
                });

            contacts.invokeContactPicker({
                mode: contacts.ContactPickerOptions.MODE_MULTIPLE
            }, onDone, onCancel, onInvoke);

            waitsFor(function () {
                return called;
            }, "callback never called", 15000);

            runs(function () {
                expect(onDone).toHaveBeenCalled();
                expect(onCancel).not.toHaveBeenCalled();
                expect(onInvoke).toHaveBeenCalled();
            });
        });

        it("can invoke contact picker with mode=attribute", function () {
            window.alert("Click on a contact when contact picker opens, then click on the mobile phone of the contact.");

            var called = false,
                onDone = jasmine.createSpy("done3").andCallFake(function (data) {
                    expect(data.contactId).toBeDefined();
                    expect(data.contactId).toEqual(jasmine.any(String));
                    expect(data.value).toBeDefined();
                    expect(data.value).toEqual(jasmine.any(String));
                    expect(data.type).toBeDefined();
                    expect(data.type).toEqual("mobile");
                    expect(data.field).toBeDefined();
                    expect(data.field).toEqual("phoneNumbers");
                    called = true;
                }),
                onCancel = jasmine.createSpy("cancel3"),
                onInvoke = jasmine.createSpy("invoke3").andCallFake(function (error) {
                    expect(error).not.toBeDefined();
                });

            contacts.invokeContactPicker({
                mode: contacts.ContactPickerOptions.MODE_ATTRIBUTE,
                fields: ["phoneNumbers"]
            }, onDone, onCancel, onInvoke);

            waitsFor(function () {
                return called;
            }, "callback never called", 15000);

            runs(function () {
                expect(onDone).toHaveBeenCalled();
                expect(onCancel).not.toHaveBeenCalled();
                expect(onInvoke).toHaveBeenCalled();
            });
        });
    });
});
