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
    ContactPhoto = require("./ContactPhoto"),
    ContactNews = require("./ContactNews"),
    ContactActivity = require("./ContactActivity");

function populateFieldArray(contactProps, field, ClassName) {
    if (contactProps[field]) {
        var list = [],
            obj;

        contactProps[field].forEach(function (args) {
            if (ClassName === ContactField) {
                list.push(new ClassName(args.type, args.value));
            } else if (ClassName === ContactPhoto) {
                obj = new ContactPhoto(args.originalFilePath, args.pref);
                obj.largeFilePath = args.largeFilePath;
                obj.smallFilePath = args.smallFilePath;
                list.push(obj);
            } else if (ClassName === ContactNews) {
                obj = new ContactNews(args);
                list.push(obj);
            } else if (ClassName === ContactActivity) {
                obj = new ContactActivity(args);
                list.push(obj);
            } else {
                list.push(new ClassName(args));
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
        populateFieldArray(contact, "news", ContactNews);
        populateFieldArray(contact, "activities", ContactActivity);
        // TODO categories

        populateDate(contact, "birthday");
        populateDate(contact, "anniversary");
    }
};

