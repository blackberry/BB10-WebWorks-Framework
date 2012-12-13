/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var myContact,
    clonedContact;

function onSaveSuccess(saved) {
    textarea.clear();
    textarea.append("Saved success!");
    textarea.append("Contact ID: " + saved.id);
    textarea.append("Contact Given Name: " + saved.name.givenName);
    textarea.append("Contact Family Name: " + saved.name.familyName);

    if (saved.emails) {
        textarea.append("Contact email: " + saved.emails[0].value);
    } else {
        textarea.append("Contact has no email");
    }
}

function onSaveError(error) {
    textarea.clear();
    textarea.append("Saved error!");
    textarea.append("Error code: " + error.code);
}

function onRemoveSuccess() {
    textarea.clear();
    textarea.append("Remove success!");
}

function onRemoveError(error) {
    textarea.clear();
    textarea.append("Remove error!");
    textarea.append("Error code: " + error.code);
}

function createContact() {
    var c = blackberry.pim.contacts.create({
            "name": {
                "familyName": document.getElementById("lastName").value,
                "givenName": document.getElementById("firstName").value
            },
            "favorite": true,
            "displayName": "csmitherman",
            "phoneNumbers": [{
                type: blackberry.pim.contacts.ContactField.WORK,
                value: "1234567890"
            }]
        });
    c.save(function (saved) {
        onSaveSuccess(saved);
        myContact = saved;
    }, onSaveError);
}

function editContact() {
    if (myContact) {
        myContact.emails = [{
            type: blackberry.pim.contacts.ContactField.WORK,
            value: "hello@rim.com"
        }];

        myContact.save(function (saved) {
            onSaveSuccess(saved);
            myContact = saved;
        }, onSaveError);
    } else {
        alert("myContact not valid");
    }
}

function cloneContact() {
    if (myContact) {
        clonedContact = myContact.clone();
        clonedContact.save(function (saved) {
            onSaveSuccess(saved);
            clonedContact = saved;
        }, onSaveError);
    } else {
        alert("myContact not valid");
    }
}

function removeClonedContact() {
    if (clonedContact) {
        clonedContact.remove(onRemoveSuccess, onRemoveError);
    }
}

function removeContact() {
    if (myContact) {
        myContact.remove(onRemoveSuccess, onRemoveError);
    }
}

function getContact() {
    var contact = blackberry.pim.contacts.getContact(document.getElementById("contactId").value);

    textarea.clear();
    textarea.append("Got contact!");
    textarea.append("Contact ID: " + contact.id);
    textarea.append("Contact Given Name: " + contact.name.givenName);
    textarea.append("Contact Family Name: " + contact.name.familyName);

    if (contact.emails) {
        textarea.append("Contact email: " + contact.emails[0].value);
    } else {
        textarea.append("Contact has no email");
    }
}

function findContact() {
    var findOptions = {
            filter: [{
                fieldName: blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_FAMILY_NAME,
                fieldValue: document.getElementById("lastName").value
            }, {
                fieldName: blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_GIVEN_NAME,
                fieldValue: document.getElementById("firstName").value
            }]
        };

    blackberry.pim.contacts.find(["name", "emails"], findOptions, function (contacts, index) {
        var numContactsFound = contacts.length;

        textarea.clear();
        textarea.append("Found " + numContactsFound + " contacts!");

        contacts.forEach(function (c, index) {
            textarea.append("Contact #" + index);
            textarea.append("First Name: " + c.name.givenName);
            textarea.append("Last Name: " + c.name.familyName);
            textarea.append("Email: " + c.emails[0].value);
        });
    }, function (error) {
        textarea.clear();
        textarea.append("Error finding contacts! Code: " + error.code);
    });
}
