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
var CalendarEvent,
    _ID = require("./manifest.json").namespace, // normally 2nd-level require does not work in client side, but manifest has already been required in client.js, so this is ok
    utils = require("./../../lib/utils"),
    calendarUtils = require("./calendarUtils"),
    CalendarError = require("./CalendarError"),
    CalendarRepeatRule = require("./CalendarRepeatRule"),
    CalendarFolder = require("./CalendarFolder");

/**
 * Contains information about a single calendar event.
 * @constructor
 * @param properties
 */
CalendarEvent = function (properties) {
    var privateId,
        privateParentId,
        privateFolder,
        privateHash;

    this.allDay = properties && typeof properties.allDay !== "undefined" ? properties.allDay : false;
    this.attendees = properties && typeof properties.attendees !== "undefined" ? properties.attendees : [];
    this.birthday = properties && typeof properties.birthday !== "undefined" ? properties.birthday : false;
    this.description = properties && typeof properties.description !== "undefined" ? properties.description : "";
    this.end = properties && typeof properties.end !== "undefined" ? (calendarUtils.isDate(properties.end) ? properties.end : new Date(parseInt(properties.end, 10))) : null;
    this.location = properties && typeof properties.location !== "undefined" ? properties.location : "";
    this.reminder = properties && typeof properties.reminder !== "undefined" ? properties.reminder : 15; // default reminder to 15 mins before start
    this.recurrence = properties && typeof properties.recurrence !== "undefined" ? properties.recurrence : null;
    this.sensitivity = properties && typeof properties.sensitivity !== "undefined" ? properties.sensitivity : null;
    this.status = properties && typeof properties.status !== "undefined" ? properties.status : 0;
    this.start = properties && typeof properties.start !== "undefined" ? (calendarUtils.isDate(properties.start) ? properties.start : new Date(parseInt(properties.start, 10))) : null;
    this.summary = properties && typeof properties.summary !== "undefined" ? properties.summary : "";
    this.timezone = properties && typeof properties.timezone !== "undefined" ? properties.timezone : "";
    this.transparency = properties && typeof properties.transparency !== "undefined" ? properties.transparency : 2; // default to busy if not set
    this.originalStartTime = properties && typeof properties.originalStartTime !== "undefined" ? (calendarUtils.isDate(properties.originalStartTime) ? properties.originalStartTime : new Date(parseInt(properties.originalStartTime, 10))) : null;
    this.url = properties && typeof properties.url !== "undefined" ? properties.url : "";

    privateId = properties && typeof properties.id !== "undefined" ? properties.id : null;
    privateParentId = properties && typeof properties.parentId !== "undefined" ? properties.parentId : null;
    privateFolder = properties && typeof properties.folder !== "undefined" ? new CalendarFolder(properties.folder) : null;
    privateHash = properties && typeof properties.hash !== "undefined" ? properties.hash : 0;

    Object.defineProperty(this, "id", { "value": privateId, "enumerable": true });
    Object.defineProperty(this, "parentId", { "value": privateParentId, "enumerable": true });
    Object.defineProperty(this, "folder", {"value": privateFolder, "enumerable": true });
    Object.defineProperty(this, "hash", { "value": privateHash, "enumerable": false });
};

CalendarEvent.prototype.save = function (onSaveSuccess, onSaveError) {
    var args = {},
        successCallback = onSaveSuccess,
        errorCallback = onSaveError,
        saveCallback,
        exceptionDatesStrings = [],
        that = this;

    // start and end must be specified, and must be Date objects
    if (!this.start || !this.end || !calendarUtils.isDate(this.start) || !calendarUtils.isDate(this.end)) {
        calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
        return;
    }

    // end time must not be before start time
    if (!calendarUtils.isBeforeOrEqual(this.start, this.end)) {
        calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
        return;
    }

    // originalStartTime must be Date
    if (this.originalStartTime && !calendarUtils.isDate(this.originalStartTime)) {
        calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
        return;
    }

    // frequency must be specified correctly for recurring event
    if (this.recurrence) {
        switch (this.recurrence.frequency) {
        case CalendarRepeatRule.FREQUENCY_DAILY:
        case CalendarRepeatRule.FREQUENCY_WEEKLY:
        case CalendarRepeatRule.FREQUENCY_MONTHLY:
        case CalendarRepeatRule.FREQUENCY_MONTHLY_AT_A_WEEK_DAY:
        case CalendarRepeatRule.FREQUENCY_YEARLY:
        case CalendarRepeatRule.FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH:
            break;
        default:
            calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
            return;
        }
    }

    Object.getOwnPropertyNames(this).forEach(function (key) {
        if (that[key] !== null) {
            if (calendarUtils.isObject(that[key])) {
                args[key] = {};

                Object.getOwnPropertyNames(that[key]).forEach(function (innerKey) {
                    if (that[key][innerKey] !== null) {
                        args[key][innerKey] = that[key][innerKey];
                    }
                });
            } else if (calendarUtils.isDate(that[key])) {
                try {
                    args[key] = calendarUtils.preprocessDate(that[key]);
                } catch (e) {
                    calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
                }
            } else {
                args[key] = that[key];
            }
        }
    });

    if (args.attendees) {
        Object.getOwnPropertyNames(args.attendees).forEach(function (key) {
            if (args.attendees[key].contactId && !window.isNaN(args.attendees[key].contactId)) {
                args.attendees[key].contactId = window.parseInt(args.attendees[key].contactId);
            }

            if (args.attendees[key].id && !window.isNaN(args.attendees[key].id)) {
                args.attendees[key].id = window.parseInt(args.attendees[key].id);
            }
        });
    }

    if (args.recurrence) {
        if (args.recurrence.exceptionDates) {
            args.recurrence.exceptionDates.forEach(function (d) {
                exceptionDatesStrings.push(calendarUtils.preprocessDate(d));
            });

            args.recurrence.exceptionDates = exceptionDatesStrings;
        }

        if (args.recurrence.expires) {
            args.recurrence.expires = calendarUtils.preprocessDate(args.recurrence.expires);
        }
    }

    if (this.id && !window.isNaN(this.id)) {
        args.id = window.parseInt(this.id);
    }

    if (this.folder && this.folder.accountId && !window.isNaN(this.folder.accountId)) {
        args.accountId = window.parseInt(this.folder.accountId);
    }

    if (this.folder && this.folder.id && !window.isNaN(this.folder.id)) {
        args.folderId = window.parseInt(this.folder.id);
    }

    if (this.parentId && !window.isNaN(this.parentId)) {
        args.parentId = window.parseInt(this.parentId);
    }

    args._eventId = utils.guid();

    saveCallback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            errorObj,
            newEvent;

        if (result._success) {
            if (successCallback) {
                newEvent = new CalendarEvent(calendarUtils.populateEvent(result.event));
                successCallback(newEvent);
            }
        } else {
            if (errorCallback) {
                errorObj = new CalendarError(result.code);
                errorCallback(errorObj);
            }
        }
    };

    window.webworks.event.once(_ID, args._eventId, saveCallback);
    return window.webworks.execAsync(_ID, "save", args);
};

CalendarEvent.prototype.remove = function (onRemoveSuccess, onRemoveError, removeAll) {
    var args = {},
        successCallback = onRemoveSuccess,
        errorCallback = onRemoveError,
        removeCallback;

    // if any of these fields is missing, it means the object has not been saved
    // yet, thus calling remove() on it makes no sense
    if (!this.folder || !this.id) {
        calendarUtils.invokeErrorCallback(errorCallback, CalendarError.INVALID_ARGUMENT_ERROR);
        console.log("Error: Event has not been saved yet, thus cannot be removed");
        return;
    }

    args.accountId = window.parseInt(this.folder.accountId);
    args.calEventId = window.parseInt(this.id);
    args._eventId = utils.guid();

    // if event is not recurring, always remove all
    removeAll = !(this.recurrence && typeof removeAll === "boolean" && !removeAll);

    args.removeAll = removeAll;

    if (!removeAll) {
        // user only wants to remove the current instance, not the all occurrences
        args.dateToRemove = calendarUtils.preprocessDate(this.start);
    }

    removeCallback = function (args) {
        var result = JSON.parse(unescape(args.result)),
            errorObj;

        if (result._success) {
            if (successCallback) {
                successCallback();
            }
        } else {
            if (errorCallback) {
                errorObj = new CalendarError(result.code);
                errorCallback(errorObj);
            }
        }
    };

    // accountId is set only if the event is persisted in the device, if accountId is not set, there is nothing to do because the event has not been persisted;
    if (args.accountId) {
        window.webworks.event.once(_ID, args._eventId, removeCallback);
        return window.webworks.execAsync(_ID, "remove", args);
    } else {
        if (successCallback) {
            successCallback();
        }
    }
};

CalendarEvent.prototype.createExceptionEvent = function (originalStartTime) {
    var properties = {},
        key,
        exceptionEvent;

    for (key in this) {
        if (this.hasOwnProperty(key) && key !== "recurrence") {
            properties[key] = this[key];
        }
    }

    properties.id = null;
    properties.parentId = this.id;
    properties.originalStartTime = originalStartTime;

    exceptionEvent = new CalendarEvent(properties); // leaving out recurrence deliberately

    if (!this.recurrence) {
        this.recurrence = new CalendarRepeatRule();
    }

    if (!this.recurrence.exceptionDates) {
        this.recurrence.exceptionDates = [];
    }

    this.recurrence.exceptionDates.push(originalStartTime instanceof Date ? originalStartTime : new Date(originalStartTime));

    return exceptionEvent;
};

Object.defineProperty(CalendarEvent, "SENSITIVITY_NORMAL", {"value": 0, "enumerable": true});
Object.defineProperty(CalendarEvent, "SENSITIVITY_PERSONAL", {"value": 1, "enumerable": true});
Object.defineProperty(CalendarEvent, "SENSITIVITY_PRIVATE", {"value": 2, "enumerable": true});
Object.defineProperty(CalendarEvent, "SENSITIVITY_CONFIDENTIAL", {"value": 3, "enumerable": true});

Object.defineProperty(CalendarEvent, "TRANSPARENCY_FREE", {"value": 0, "enumerable": true});
Object.defineProperty(CalendarEvent, "TRANSPARENCY_TENTATIVE", {"value": 1, "enumerable": true});
Object.defineProperty(CalendarEvent, "TRANSPARENCY_BUSY", {"value": 2, "enumerable": true});
Object.defineProperty(CalendarEvent, "TRANSPARENCY_OUT_OF_OFFICE", {"value": 3, "enumerable": true});

module.exports = CalendarEvent;
