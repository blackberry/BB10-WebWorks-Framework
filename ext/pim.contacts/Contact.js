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
var Contact,
    ContactError = require("./ContactError"),
    ContactAccount = require("./ContactAccount"),
    _ID = require("./manifest.json").namespace, // normally 2nd-level require does not work in client side, but manifest has already been required in client.js, so this is ok
    contactUtils = require("./contactUtils"),
    utils = require("./../../lib/utils");

function validateSaveArguments(contact, onSuccess, onError) {
    var i,
        j,
        key,
        contactFields = ["phoneNumbers", "faxNumbers", "pagerNumbers", "emails", "ims", "categories", "urls", "socialNetworks"];

    if (!onSuccess || typeof(onSuccess) !== "function") {
        return false;
    }

    if (contact.id !== null && isNaN(contact.id)) {
        return false;
    }

    if (contact.favorite !== null && typeof(contact.favorite) !== "boolean") {
        return false;
    }

    if (contact.displayName !== null && typeof(contact.displayName) !== "string") {
        return false;
    }

    if (contact.nickname !== null && typeof(contact.nickname) !== "string") {
        return false;
    }

    if (contact.name !== null) {
        for (key in contact.name) {
            if (typeof(contact.name[key]) !== "string") {
                return false;
            }
        }
    }

    if (contact.ringtone !== null && typeof(contact.ringtone) !== "string") {
        return false;
    }

    if (contact.note !== null && typeof(contact.note) !== "string") {
        return false;
    }

    if (contact.addresses !== null) {
        if (Object.prototype.toString.call(contact.addresses) !== "[object Array]") {
            return false;
        }

        for (i = 0; i < contact.addresses.length; i++) {
            for (key in contact.addresses[i]) {
                if (typeof(contact.addresses[i][key]) !== "string") {
                    return false;
                }
            }
        }
    }

    if (contact.organizations !== null) {
        if (Object.prototype.toString.call(contact.organizations) !== "[object Array]") {
            return false;
        }

        for (i = 0; i < contact.organizations.length; i++) {
            for (key in contact.organizations[i]) {
                if (typeof(contact.organizations[i][key]) !== "string") {
                    return false;
                }
            }

            if (!contact.organizations[i].name) {
                return false;
            }
        }
    }

    if (contact.photos !== null) {
        if (Object.prototype.toString.call(contact.photos) !== "[object Array]") {
            return false;
        }

        for (i = 0; i < contact.photos.length; i++) {
            if (typeof(contact.photos[i].originalFilePath) !== "string") {
                return false;
            }

            if (typeof(contact.photos[i].pref) !== "boolean") {
                return false;
            }
        }
    }

    if (contact.videoChat !== null) {
        if (Object.prototype.toString.call(contact.videoChat) !== "[object Array]") {
            return false;
        }

        for (i = 0; i < contact.videoChat.length; i++) {
            if (typeof(contact.videoChat[i]) !== "string") {
                return false;
            }
        }
    }

    for (i = 0; i < contactFields.length; i++) {
        if (contact[contactFields[i]] !== null) {
            if (Object.prototype.toString.call(contact[contactFields[i]]) !== "[object Array]") {
                return false;
            }

            for (j = 0; j < contact[contactFields[i]].length; j++) {
                if (typeof(contact[contactFields[i]][j].type) !== "string") {
                    return false;
                }

                if (typeof(contact[contactFields[i]][j].value) !== "string") {
                    return false;
                }
            }
        }
    }

    return true;
}

function validateRemoveArguments(id, onSuccess, onError) {
    if (!onSuccess || typeof(onSuccess) !== "function") {
        return false;
    }

    if (id === null || id === "" || isNaN(id)) {
        return false;
    }

    return true;
}

/**
 * Contains information about a single contact.
 * @constructor
 * @param properties
 */
Contact = function (properties) {
    var privateId,
        privateNews,
        privateActivities,
        privateSourceAccounts = [];

    this.displayName = properties && properties.displayName ? properties.displayName : null;
    this.name = properties && properties.name ? properties.name : null; // ContactName
    this.nickname = properties && properties.nickname ? properties.nickname : null;
    this.phoneNumbers = properties && properties.phoneNumbers ? properties.phoneNumbers : null; // ContactField[]
    this.faxNumbers = properties && properties.faxNumbers ? properties.faxNumbers : null; // ContactField[]
    this.pagerNumbers = properties && properties.pagerNumbers ? properties.pagerNumbers : null; // ContactField[]
    this.emails = properties && properties.emails ? properties.emails : null; // ContactField[]
    this.addresses = properties && properties.addresses ? properties.addresses : null; // ContactAddress[]
    this.ims = properties && properties.ims ? properties.ims : null; // ContactField[]
    this.organizations = properties && properties.organizations ? properties.organizations : null; // ContactOrganization[]
    this.birthday = properties && properties.birthday ? properties.birthday : null;
    this.anniversary = properties && properties.anniversary ? properties.anniversary : null;
    this.note = properties && properties.note ? properties.note : null;
    this.photos = properties && properties.photos ? properties.photos : null; // ContactPhoto[]
    this.categories = properties && properties.categories ? properties.categories : null; // ContactField[]
    this.urls = properties && properties.urls ? properties.urls : null; // ContactField[]
    this.videoChat = properties && properties.videoChat ? properties.videoChat : null; // String[]
    this.socialNetworks = properties && properties.socialNetworks ? properties.socialNetworks : null; // ContactField[]
    this.ringtone = properties && properties.ringtone ? properties.ringtone : null;
    this.favorite = properties && properties.favorite ? properties.favorite : false;

    privateId = properties && properties.id ? properties.id : null;
    Object.defineProperty(this, "id", { "value": privateId });

    privateNews = properties && properties.news ? properties.news : null; // ContactNews[]
    Object.defineProperty(this, "news", { "value": privateNews });

    privateActivities = properties && properties.activities ? properties.activities : null; // ContactActivity[]
    Object.defineProperty(this, "activities", { "value": privateActivities });

    privateSourceAccounts = properties && properties.sourceAccounts ?  properties.sourceAccounts : [];
    Object.defineProperty(this, "sourceAccounts", { "value": privateSourceAccounts});
};

Contact.prototype.save = function (onSaveSuccess, onSaveError) {
    var args = {},
        key,
        successCallback = onSaveSuccess,
        errorCallback = onSaveError,
        saveCallback;

    for (key in this) {
        if (this.hasOwnProperty(key) && this[key] !== null) {
            args[key] = this[key];
        }
    }

    if (!validateSaveArguments(this, successCallback, errorCallback)) {
        if (errorCallback && typeof(errorCallback) === "function") {
            errorCallback(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        }

        return;
    }

    if (args.birthday && args.birthday.toDateString) {
        args.birthday = args.birthday.toDateString();
    }

    if (args.anniversary && args.anniversary.toDateString) {
        args.anniversary = args.anniversary.toDateString();
    }

    if (this.id === null) {
        args.id = this.id;
    } else {
        args.id = window.parseInt(this.id);
    }

    args._eventId = utils.guid();

    saveCallback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            newContact,
            errorObj;

        if (result._success) {
            if (successCallback) {
                result.id = result.id.toString();
                contactUtils.populateContact(result);

                newContact = new Contact(result);
                successCallback(newContact);
            }
        } else {
            if (errorCallback && typeof(errorCallback) === "function") {
                errorObj = new ContactError(result.code);
                errorCallback(errorObj);
            }
        }
    };

    window.webworks.event.once(_ID, args._eventId, saveCallback);
    return window.webworks.execAsync(_ID, "save", args);
};

Contact.prototype.remove = function (onRemoveSuccess, onRemoveError) {
    var args = {},
        successCallback = onRemoveSuccess,
        errorCallback = onRemoveError,
        removeCallback;

    if (!validateRemoveArguments(this.id, successCallback, errorCallback)) {
        if (errorCallback && typeof(errorCallback) === "function") {
            errorCallback(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        }

        return;
    }

    args.contactId = window.parseInt(this.id);
    args._eventId = utils.guid();

    removeCallback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            errorObj;

        if (result._success) {
            if (successCallback) {
                successCallback();
            }
        } else {
            if (errorCallback && typeof(errorCallback) === "function") {
                errorObj = new ContactError(result.code);
                errorCallback(errorObj);
            }
        }
    };

    window.webworks.event.once(_ID, args._eventId, removeCallback);
    return window.webworks.execAsync(_ID, "remove", args);
};

Contact.prototype.clone = function () {
    var contact = new Contact({"id" : -1 * this.id}),
        key;

    for (key in this) {
        if (this.hasOwnProperty(key)) {
            contact[key] = this[key];
        }
    }

    return contact;
};

module.exports = Contact;
