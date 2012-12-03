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

var pimContacts,
    _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    config = require("../../lib/config"),
    contactUtils = require("./contactUtils"),
    contactConsts = require("./contactConsts"),
    ContactError = require("./ContactError"),
    ContactPickerOptions = require("./ContactPickerOptions");

function checkPermission(success, eventId) {
    if (!_utils.hasPermission(config, "access_pimdomain_contacts")) {
        _event.trigger(eventId, {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": ContactError.PERMISSION_DENIED_ERROR
            }))
        });
        success();
        return false;
    }

    return true;
}

function onChildCardClosed(cb) {
    var application = window.qnx.webplatform.getApplication(),
        result = {},
        kindAttributeMap = contactConsts.getKindAttributeMap(),
        subKindAttributeMap = contactConsts.getSubKindAttributeMap(),
        callback = function (info) {
            application.invocation.removeEventListener("childCardClosed", callback);

            if (info.reason === "cancel") {
                cb(undefined, "cancel");
            } else if (info.reason === "contactSelected") {
                result.contactId = info.data;
                cb(result, "done");
            } else if (info.reason === "contactsSelected") {
                info.data = info.data.split("\n");

                info.data.forEach(function (line) {
                    if (line.match("^selectedContacts:json:")) {
                        result.contactIds = JSON.parse(line.slice(22));
                        result.contactIds = result.contactIds.map(function (contactId) {
                                                return JSON.stringify(contactId);
                                            });
                    }
                });

                cb(result, "done");
            } else if (info.reason === "attributeSelected") {
                info.data = info.data.split("\n");

                info.data.forEach(function (line) {
                    if (line.match("^attribute::")) {
                        result.value = line.slice(11);
                    } else if (line.match("^id:n:")) {
                        result.contactId = line.slice(5);
                    } else if (line.match("^kind:n:")) {
                        result.field = kindAttributeMap[parseInt(line.slice(7), 10)];
                    } else if (line.match("^subKind:n:")) {
                        result.type = subKindAttributeMap[parseInt(line.slice(10), 10)];
                    }
                });

                cb(result, "done");
            }
        };

    application.invocation.addEventListener("childCardClosed", callback);
}

module.exports = {
    find: function (success, fail, args) {
        var findOptions = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                findOptions[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission(success, findOptions["_eventId"])) {
            return;
        }

        if (!contactUtils.validateFindArguments(findOptions.options)) {
            _event.trigger(findOptions._eventId, {
                "result": escape(JSON.stringify({
                    "_success": false,
                    "code": ContactError.INVALID_ARGUMENT_ERROR
                }))
            });
            success();
            return;
        }

        pimContacts.getInstance().find(findOptions);

        success();
    },

    getContact: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_contacts")) {
            success(null);
            return;
        }

        var findOptions = {},
            results;

        findOptions.contactId = JSON.parse(decodeURIComponent(args.contactId));

        results = pimContacts.getInstance().getContact(findOptions);
        if (results._success) {
            if (results.contact && results.contact.id) {
                success(results.contact);
            } else {
                success(null);
            }
        } else {
            success(null);
        }
    },

    save: function (success, fail, args) {
        var attributes = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                attributes[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission(success, attributes["_eventId"])) {
            return;
        }

        pimContacts.getInstance().save(attributes);
        success();
    },

    remove: function (success, fail, args) {
        var attributes = { "contactId" : JSON.parse(decodeURIComponent(args.contactId)),
                           "_eventId" : JSON.parse(decodeURIComponent(args._eventId))};

        if (!checkPermission(success, attributes["_eventId"])) {
            return;
        }

        pimContacts.getInstance().remove(attributes);
        success();
    },

    invokeContactPicker: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            callback = function (args, reason) {
                _event.trigger("invokeContactPicker.eventId", args, reason);
            };

        if (!checkPermission(success, "invokeContactPicker.invokeEventId")) {
            return;
        }

        // Validate options
        if (!options || typeof(options.mode) === "undefined") {
            options = new ContactPickerOptions();
        }

        if (!contactUtils.validateContactsPickerOptions(options)) {
            return;
        }

        // start listening to childCardClosed event from navigator before invoking picker
        onChildCardClosed(callback);
        pimContacts.getInstance().invokePicker(options);
        success();
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.PimContacts = function ()
{   
    var self = this,
        hasInstance = false;

    self.find = function (args) {
        JNEXT.invoke(self.m_id, "find " + JSON.stringify(args));
        return "";
    };

    self.getContact = function (args) {
        return JSON.parse(JNEXT.invoke(self.m_id, "getContact " + JSON.stringify(args)));
    };

    self.save = function (args) {
        JNEXT.invoke(self.m_id, "save " + JSON.stringify(args));
        return "";
    };

    self.remove = function (args) {
        JNEXT.invoke(self.m_id, "remove " + JSON.stringify(args));
        return "";
    };

    self.invokePicker = function (options) {
        JNEXT.invoke(self.m_id, "invokePicker " + JSON.stringify(options));
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpimcontacts")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpimcontacts.PimContacts");
        
        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };
   
    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            args = {};
            
        if (strEventDesc === "result") {
            args.result = escape(strData.split(" ").slice(2).join(" "));
            _event.trigger(arData[1], args);
        }
    };
    
    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

pimContacts = new JNEXT.PimContacts();
