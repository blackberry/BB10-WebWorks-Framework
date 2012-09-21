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
    contactUtils = require(_apiDir + "/contactUtils");

describe("pim.contacts contactUtils", function () {
    it("populates the child objects within Contact", function () {
        var contact = {
            "name": {"givenName": "John", "familyName": "Smith"},
            "emails": [
                {"type": "work", "value": "abc@rim.com"},
                {"type": "home", "value": "def@rim.com"}
            ],
            "addresses": [
                {"type": "other", "streetAddress": "123 Abc Rd.", "locality": "Town Def", "region": "Ghi County"}
            ],
            "photos": [
                {"originalFilePath": "icon.png", "pref": true}
            ],
            "organizations": [],
            "birthday": "January 1, 1970",
            "anniversary": "July 1, 2000"
        };

        contactUtils.populateContact(contact);

        expect(contact.name).toBeDefined();
        expect(contact.name.givenName).toBe("John");
        expect(contact.name.familyName).toBe("Smith");
        expect(contact.name.middleName).toBe("");
        expect(contact.name.honorificPrefix).toBe("");
        expect(contact.name.honorificSuffix).toBe("");
        expect(contact.name.phoneticGivenName).toBe("");
        expect(contact.name.phoneticFamilyName).toBe("");

        expect(contact.emails).toBeDefined();
        expect(contact.emails.length).toBe(2);
        expect(contact.emails[0].type).toBe("work");
        expect(contact.emails[0].value).toBe("abc@rim.com");
        expect(contact.emails[1].type).toBe("home");
        expect(contact.emails[1].value).toBe("def@rim.com");

        expect(contact.addresses).toBeDefined();
        expect(contact.addresses.length).toBe(1);
        expect(contact.addresses[0].type).toBe("other");
        expect(contact.addresses[0].streetAddress).toBe("123 Abc Rd.");
        expect(contact.addresses[0].streetOther).toBe("");
        expect(contact.addresses[0].locality).toBe("Town Def");
        expect(contact.addresses[0].region).toBe("Ghi County");
        expect(contact.addresses[0].postalCode).toBe("");
        expect(contact.addresses[0].country).toBe("");

        expect(contact.photos).toBeDefined();
        expect(contact.photos.length).toBe(1);
        expect(contact.photos[0].originalFilePath).toBe("icon.png");
        expect(contact.photos[0].pref).toBe(true);

        expect(contact.organizations).toBeDefined();
        expect(contact.organizations.length).toBe(0);

        expect(contact.birthday.toDateString()).toBe("Thu Jan 01 1970");
        expect(contact.anniversary.toDateString()).toBe("Sat Jul 01 2000");
    });
});

