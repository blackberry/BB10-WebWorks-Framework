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
    ContactFindOptions;
 
describe("blackberry.pim.contacts", function () {
    beforeEach(function () {
        contacts = blackberry.pim.contacts;
        ContactFindOptions = contacts.ContactFindOptions;
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
                    expect(contacts[0].name.givenName).toBe(given);
                    expect(contacts[0].name.familyName).toBe(family);
                    expect(contacts[0].activities).not.toBe([]);
                    expect(contacts[0].activities.length).toBeGreaterThan(0);
                }),
                errorCb = jasmine.createSpy("onFindError").andCallFake(function (error) {
                    called = true;
                }),
                findOptions = new ContactFindOptions([{
                    "fieldName": ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                    "fieldValue": family
                }, {
                    "fieldName": ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                    "fieldValue": given
                }]);

            try {
                contacts.find(["name", "activities"], successCb, errorCb, findOptions);
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
    });
});
