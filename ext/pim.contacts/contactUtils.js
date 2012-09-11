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
 
var self,
    ContactName = require("./ContactName"),
    ContactOrganization = require("./ContactOrganization"),
    ContactAddress = require("./ContactAddress"),
    ContactField = require("./ContactField"),
    ContactPhoto = require("./ContactPhoto");

function populateFieldArray(contactProps, field, ClassName) {
    if (contactProps[field]) {
        var list = [],
            photo;
        contactProps[field].forEach(function (obj) {
            if (ClassName === ContactField) {
                list.push(new ClassName(obj.type, obj.value));
            } else if (ClassName === ContactPhoto) {
                photo = new ContactPhoto(obj.originalFilePath, obj.pref);
                photo.largeFilePath = obj.largeFilePath;
                photo.smallFilePath = obj.smallFilePath;
                list.push(photo);
            } else {
                list.push(new ClassName(obj));
            }
        });
        contactProps[field] = list;
    }
}

function populateDate(contactProps, field) {
    if (contactProps[field]) {
        contactProps[field] = new Date(contactProps[field]);
    }
}

self = module.exports = {
    populateContact: function (contact) {
        if (contact.name) {
            contact.name = new ContactName(contact.name);
        }

        populateFieldArray(contact, "addresses", ContactAddress);
        populateFieldArray(contact, "organizations", ContactOrganization);
        populateFieldArray(contact, "emails", ContactField);
        populateFieldArray(contact, "phoneNumbers", ContactField);
        populateFieldArray(contact, "faxNumbers", ContactField);
        populateFieldArray(contact, "pagerNumbers", ContactField);
        populateFieldArray(contact, "ims", ContactField);
        populateFieldArray(contact, "socialNetworks", ContactField);
        populateFieldArray(contact, "urls", ContactField);
        populateFieldArray(contact, "photos", ContactPhoto);
        // TODO categories

        populateDate(contact, "birthday");
        populateDate(contact, "anniversary");
    }
};

