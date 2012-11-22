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
 
var _self = {},
    _ID = require("./manifest.json").namespace,
    Contact = require("./Contact"),
    ContactName = require("./ContactName"),
    ContactOrganization = require("./ContactOrganization"),
    ContactAddress = require("./ContactAddress"),
    ContactField = require("./ContactField"),
    ContactPhoto = require("./ContactPhoto"),
    ContactError = require("./ContactError"),
    ContactFindOptions = require("./ContactFindOptions"),
    ContactNews = require("./ContactNews"),
    ContactActivity = require("./ContactActivity"),
    contactUtils = require("./contactUtils"),
    utils = require("./../../lib/utils");

function invokeCallback(callback, args) {
    if (callback && typeof callback === "function") {
        callback(args);
    }
}

_self.find = function (contactFields, findOptions, onFindSuccess, onFindError) {
    var callback,
        tempContact,
        eventId;

    if (!contactFields || !contactFields.length || !onFindSuccess || typeof onFindSuccess !== "function") {
        contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
        return;
    } else {
        tempContact = new Contact();

        contactFields.forEach(function (field) {
            if (!tempContact.hasOwnProperty(field)) {
                contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
            }
        });
    }
    if (!contactUtils.validateFindArguments(findOptions)) {
        contactUtils.invokeErrorCallback(onFindError, ContactError.INVALID_ARGUMENT_ERROR);
        return;
    }

    callback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            contacts = result.contacts,
            realContacts = [];

        if (result._success) {
            if (contacts) {
                contacts.forEach(function (contact) {
                    contactUtils.populateContact(contact);
                    realContacts.push(new Contact(contact));
                });
            }
            onFindSuccess(realContacts);
        } else {
            invokeCallback(onFindError, new ContactError(result.code));
        }
    };

    eventId = utils.guid();

    window.webworks.event.once(_ID, eventId, callback);

    return window.webworks.execAsync(_ID, "find", {
        "_eventId": eventId,
        "fields": contactFields,
        "options": findOptions
    });
};

_self.create = function (properties) {
    var args = {},
        key;

    for (key in properties) {
        if (properties.hasOwnProperty(key)) {
            args[key] = properties[key];
        }
    }

    args.id = null;

    return new Contact(args);
};

_self.Contact = Contact;
_self.ContactField = ContactField;
_self.ContactAddress = ContactAddress;
_self.ContactName = ContactName;
_self.ContactOrganization = ContactOrganization;
_self.ContactPhoto = ContactPhoto;
_self.ContactError = ContactError;
_self.ContactFindOptions = ContactFindOptions;
_self.ContactNews = ContactNews;
_self.ContactActivity = ContactActivity;

module.exports = _self;
