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
var CalendarRepeatRule = require("./CalendarRepeatRule"),
    CalendarFindOptions = require("./CalendarFindOptions"),
    CalendarError = require("./CalendarError");

function isDate(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
}

function preprocessDate(date) {
    return date.toISOString();
}

function validateFindArguments(findOptions) {
    var error = false;

    findOptions = findOptions || {};

    // if limit is invalid, set it to -1
    if (!error && (typeof findOptions.limit !== "number" || findOptions.limit <= 0)) {
        findOptions.limit = -1;
    }

    if (!error) {
        switch (findOptions.detail) {
        case CalendarFindOptions.DETAIL_MONTHLY:
        case CalendarFindOptions.DETAIL_WEEKLY:
        case CalendarFindOptions.DETAIL_FULL:
        case CalendarFindOptions.DETAIL_AGENDA:
            break;
        case undefined:
            // if detail is not specified, defaults to AGENDA
            findOptions.detail = CalendarFindOptions.DETAIL_AGENDA;
            break;
        default:
            // if detail is specified but invalid, treat as error
            error = true;
        }
    }

    if (!error && findOptions.sort && Array.isArray(findOptions.sort)) {
        findOptions.sort.forEach(function (s) {
            switch (s.fieldName) {
            case CalendarFindOptions.SORT_FIELD_SUMMARY:
            case CalendarFindOptions.SORT_FIELD_LOCATION:
            case CalendarFindOptions.SORT_FIELD_START:
            case CalendarFindOptions.SORT_FIELD_END:
                break;
            default:
                // if sort id not specified or invalid, defaults to SORT_FIELD_SUMMARY
                findOptions.sort = CalendarFindOptions.SORT_FIELD_SUMMARY;
            }

            if (s.desc === undefined || typeof s.desc !== "boolean") {
                s.desc = false;
            }
        });
    }

    // filter is optional
    if (!error && findOptions.filter) {
        // if start date is invalid, set it to null
        if (findOptions.filter.start && !isDate(new Date(findOptions.filter.start))) {
            findOptions.filter.start = null;
        }

        // if end date is invalid, set it to null
        if (findOptions.filter.end && !isDate(new Date(findOptions.filter.end))) {
            findOptions.filter.end = null;
        }

        // if substring is invalid, set it to null
        if (typeof findOptions.filter.substring !== "string") {
            findOptions.filter.substring = null;
        }

        if (!error && findOptions.filter.start && typeof findOptions.filter.start !== "string") {
            findOptions.filter.start = preprocessDate(findOptions.filter.start);
        }

        if (!error && findOptions.filter.end && typeof findOptions.filter.end !== "string") {
            findOptions.filter.end = preprocessDate(findOptions.filter.end);
        }

        if (!error && findOptions.filter.folders) {
            if (!Array.isArray(findOptions.filter.folders)) {
                error = true;
            } else {
                findOptions.filter.folders.forEach(function (folder) {
                    if (!folder || !folder.id || isNaN(parseInt(folder.id, 10)) || !folder.accountId || isNaN(folder.accountId, 10)) {
                        error = true;
                    }
                });
            }
        }
    }

    return !error;
}

module.exports = {
    isDate: isDate,
    isObject: function (obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
    },
    populateEvent: function (props) {
        if (props.recurrence) {
            props.recurrence = new CalendarRepeatRule(props.recurrence);
        }

        return props;
    },
    preprocessDate: preprocessDate,
    isBeforeOrEqual: function (date1, date2) {
        return (date1.getTime() <= date2.getTime());
    },
    invokeErrorCallback: function (errorCallback, code) {
        if (errorCallback) {
            errorCallback(new CalendarError(code));
        }
    },
    validateFindArguments: validateFindArguments
};