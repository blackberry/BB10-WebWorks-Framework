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

var pimCalendar,
    _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    config = require("../../lib/config"),
    calendarUtils = require("./calendarUtils"),
    CalendarError = require("./CalendarError");

function checkPermission(success, eventId) {
    if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
        _event.trigger(eventId, {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": CalendarError.PERMISSION_DENIED_ERROR
            }))
        });
        success();
        return false;
    }

    return true;
}

function getCurrentTimezone(success, eventId) {
    var timezone = null;

    try {
        timezone = window.qnx.webplatform.device.timezone;
    } catch (e) {
        _event.trigger(eventId, {
            "result": escape(JSON.stringify({
                "_success": false,
                "code": CalendarError.UNKNOWN_ERROR
            }))
        });
        success();
    }

    return timezone;
}

module.exports = {
    find: function (success, fail, args) {
        var parsedArgs = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                parsedArgs[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission(success, parsedArgs._eventId)) {
            return;
        }

        if (!calendarUtils.validateFindArguments(parsedArgs.options)) {
            _event.trigger(parsedArgs._eventId, {
                "result": escape(JSON.stringify({
                    "_success": false,
                    "code": CalendarError.INVALID_ARGUMENT_ERROR
                }))
            });
            success();
            return;
        }

        parsedArgs.options = parsedArgs.options || {};

        parsedArgs.options.sourceTimezone = getCurrentTimezone(parsedArgs._eventId, success);
        if (!parsedArgs.options.sourceTimezone) {
            return;
        }

        pimCalendar.getInstance().find(parsedArgs);

        success();
    },

    save: function (success, fail, args) {
        var attributes = {},
            key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                attributes[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        if (!checkPermission(success, attributes._eventId)) {
            return;
        }

        attributes.sourceTimezone = getCurrentTimezone(attributes._eventId, success);
        if (!attributes.sourceTimezone) {
            return;
        }

        if (attributes.timezone) {
            attributes.targetTimezone = attributes.timezone;
        } else {
            attributes.targetTimezone = "";
        }

        pimCalendar.getInstance().save(attributes);
        success();
    },

    remove: function (success, fail, args) {
        var attributes = {
            "accountId" : JSON.parse(decodeURIComponent(args.accountId)),
            "calEventId" : JSON.parse(decodeURIComponent(args.calEventId)),
            "_eventId" : JSON.parse(decodeURIComponent(args._eventId)),
            "removeAll" : JSON.parse(decodeURIComponent(args.removeAll))
        };

        if (!checkPermission(success, attributes._eventId)) {
            return;
        }

        if (args.hasOwnProperty("dateToRemove")) {
            attributes.dateToRemove = JSON.parse(decodeURIComponent(args.dateToRemove));
        }

        attributes.sourceTimezone = getCurrentTimezone(attributes._eventId, success);
        if (!attributes.sourceTimezone) {
            return;
        }

        pimCalendar.getInstance().remove(attributes);
        success();
    },

    getDefaultCalendarAccount: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            success(null);
            return;
        }

        success(pimCalendar.getInstance().getDefaultCalendarAccount());
    },

    getCalendarAccounts: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            success(null);
            return;
        }

        success(pimCalendar.getInstance().getCalendarAccounts());
    },

    getEvent: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            success(null);
            return;
        }

        var findOptions = {},
            results,
            event = null;

        findOptions.eventId = JSON.parse(decodeURIComponent(args.eventId));
        findOptions.accountId = JSON.parse(decodeURIComponent(args.accountId));

        results = pimCalendar.getInstance().getEvent(findOptions);

        if (results._success) {
            if (results.event && results.event.id) {
                event = results.event;
            }
        }

        success(event);
    },

    getCalendarFolders: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            success(null);
            return;
        }

        success(pimCalendar.getInstance().getCalendarFolders());
    },

    getDefaultCalendarFolder: function (success, fail, args) {
        if (!_utils.hasPermission(config, "access_pimdomain_calendars")) {
            success(null);
            return;
        }

        success(pimCalendar.getInstance().getDefaultCalendarFolder());
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.PimCalendar = function ()
{
    var self = this,
        hasInstance = false;

    self.find = function (args) {
        JNEXT.invoke(self.m_id, "find " + JSON.stringify(args));
        return "";
    };

    self.getEvent = function (args) {
        var value = JNEXT.invoke(self.m_id, "getEvent " + JSON.stringify(args));
        return JSON.parse(value);
    };

    self.save = function (args) {
        JNEXT.invoke(self.m_id, "save " + JSON.stringify(args));
        return "";
    };

    self.remove = function (args) {
        JNEXT.invoke(self.m_id, "remove " + JSON.stringify(args));
        return "";
    };

    self.getDefaultCalendarAccount = function () {
        var value = JNEXT.invoke(self.m_id, "getDefaultCalendarAccount");
        return JSON.parse(value);
    };

    self.getCalendarAccounts = function () {
        var value = JNEXT.invoke(self.m_id, "getCalendarAccounts");
        return JSON.parse(value);
    };

    self.getCalendarFolders = function (args) {
        var result = JNEXT.invoke(self.m_id, "getCalendarFolders");
        return JSON.parse(result);
    };

    self.getDefaultCalendarFolder = function (args) {
        var result = JNEXT.invoke(self.m_id, "getDefaultCalendarFolder");
        return JSON.parse(result);
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpimcalendar")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpimcalendar.PimCalendar");

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

pimCalendar = new JNEXT.PimCalendar();
