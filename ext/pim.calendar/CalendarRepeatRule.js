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

/**
 * Contains information about how a calendar event repeats.
 * @constructor
 * @param properties
 */
var CalendarRepeatRule = function (properties) {
    var key;

    this.frequency = properties && typeof properties.frequency !== "undefined" ? properties.frequency : null;
    this.interval = properties && typeof properties.interval !== "undefined" ? properties.interval : 1;
    this.expires = properties && typeof properties.expires !== "undefined" ? (properties.expires instanceof Date ? properties.expires : new Date(parseInt(properties.expires, 10))) : null;
    this.numberOfOccurrences = properties && typeof properties.numberOfOccurrences !== "undefined" ? properties.numberOfOccurrences : null;

    this.dayInMonth = properties && typeof properties.dayInMonth !== "undefined" ? properties.dayInMonth : null;
    this.dayInWeek = properties && typeof properties.dayInWeek !== "undefined" ? properties.dayInWeek : null;
    this.weekInMonth = properties && typeof properties.weekInMonth !== "undefined" ? properties.weekInMonth : null;
    this.monthInYear = properties && typeof properties.monthInYear !== "undefined" ? properties.monthInYear : null;

    this.exceptionDates = [];
    if (properties && properties.exceptionDates) {
        for (key in properties.exceptionDates) {
            if (properties.exceptionDates[key] instanceof Date) {
                this.exceptionDates.push(properties.exceptionDates[key]);
            } else {
                this.exceptionDates.push(new Date(parseInt(properties.exceptionDates[key], 10)));
            }
        }
    }
};

Object.defineProperty(CalendarRepeatRule, "SUNDAY", {"value": 1, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "MONDAY", {"value": 2, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "TUESDAY", {"value": 4, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "WEDNESDAY", {"value": 8, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "THURSDAY", {"value": 16, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FRIDAY", {"value": 32, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "SATURDAY", {"value": 64, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "LAST_DAY_IN_MONTH", {"value": 127, "enumerable": true});

Object.defineProperty(CalendarRepeatRule, "FREQUENCY_DAILY", {"value": 0, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FREQUENCY_WEEKLY", {"value": 1, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FREQUENCY_MONTHLY", {"value": 2, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FREQUENCY_MONTHLY_AT_A_WEEK_DAY", {"value": 3, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FREQUENCY_YEARLY", {"value": 5, "enumerable": true});
Object.defineProperty(CalendarRepeatRule, "FREQUENCY_YEARLY_AT_A_WEEK_DAY_OF_MONTH", {"value": 6, "enumerable": true});

module.exports = CalendarRepeatRule;

