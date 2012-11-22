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
var _apiDir = __dirname + "./../../../../ext/pim.calendar/",
    _libDir = __dirname + "./../../../../lib/",
    CalendarError = require(_apiDir + "CalendarError"),
    calendarUtils = require(_apiDir + "calendarUtils");

describe("pim.calendar/calendarUtils", function () {
    it("isDate can distinguish Date correctly", function () {
        expect(calendarUtils.isDate(new Date())).toBeTruthy();
        expect(calendarUtils.isDate({})).toBeFalsy();
    });

    it("isObject can distinguish Object correctly", function () {
        expect(calendarUtils.isObject({})).toBeTruthy();
        expect(calendarUtils.isObject(3)).toBeFalsy();
    });

    it("isBeforeOrEqual works correctly", function () {
        var date1 = new Date("Jan 1, 2012, 13:00"),
            date2 = new Date("Jan 1, 2012, 13:01"),
            date3 = new Date("Jan 1, 2012, 12:59"),
            date4 = new Date("Jan 1, 2012, 13:00");

        expect(calendarUtils.isBeforeOrEqual(date1, date2)).toBeTruthy();
        expect(calendarUtils.isBeforeOrEqual(date1, date3)).toBeFalsy();
        expect(calendarUtils.isBeforeOrEqual(date1, date4)).toBeTruthy();
    });

    it("validateFindArguments", function () {
        var option1 = {},
            option2 = {
                "detail": 123
            },
            option3 = {
                "filter": {
                    "substring": "abc"
                }
            };

        expect(calendarUtils.validateFindArguments(option1)).toBeTruthy();
        expect(calendarUtils.validateFindArguments(option2)).toBeFalsy();
        expect(calendarUtils.validateFindArguments(option3)).toBeTruthy();
    });
});
