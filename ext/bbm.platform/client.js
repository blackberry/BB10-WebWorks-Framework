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
    _displayPictureEventId = "bbm.self.displayPicture",
	_contactsWithAppEventId = "bbm.users.getContactsWithApp";

_self.self = {};
_self.users = {};

function getFieldValue(field) {
    var value;

    try {
        value = window.webworks.execSync(_ID, field);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function defineGetter(obj, field) {
    Object.defineProperty(obj, field.split("/")[1], {
        get: function () {
            return getFieldValue(field);
        }
    });
}

function createEventHandler(callback, eventId) {
    if (!window.webworks.event.isOn(eventId)) {
        window.webworks.event.once(_ID, eventId, callback);
    }
}

_self.register = function (options) {
    var args = { "options" : options };
    return window.webworks.execAsync(_ID, "register", args);
};

defineGetter(_self.self, "self/appVersion");
defineGetter(_self.self, "self/bbmsdkVersion");
defineGetter(_self.self, "self/displayName");
defineGetter(_self.self, "self/handle");
defineGetter(_self.self, "self/personalMessage");
defineGetter(_self.self, "self/ppid");
defineGetter(_self.self, "self/status");
defineGetter(_self.self, "self/statusMessage");

_self.self.getDisplayPicture = function (callback) {
    var args = { "eventId" : _displayPictureEventId };
    createEventHandler(callback, _displayPictureEventId);
    return window.webworks.execAsync(_ID, "self/getDisplayPicture", args);
};

_self.self.setStatus = function (status, statusMessage) {
    var args = { "status" : status, "statusMessage" : statusMessage };
    return window.webworks.execAsync(_ID, "self/setStatus", args);
};

_self.self.setPersonalMessage = function (personalMessage) {
    var args = { "personalMessage" : personalMessage };
    return window.webworks.execAsync(_ID, "self/setPersonalMessage", args);
};

_self.self.setDisplayPicture = function (displayPicture) {
    var args = { "displayPicture" : displayPicture };
    return window.webworks.execAsync(_ID, "self/setDisplayPicture", args);
};

_self.users.inviteToDownload = function () {
    return window.webworks.execAsync(_ID, "users/inviteToDownload");
};

_self.users.getContactsWithApp = function (callback) {
	console.log("client.js : _self.users.getContactsWithApp: " + callback);
    var args = { "eventId" : _contactsWithAppEventId };
    createEventHandler(callback, _contactsWithAppEventId);
    return window.webworks.execAsync(_ID, "users/getContactsWithApp", args);
};

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;

