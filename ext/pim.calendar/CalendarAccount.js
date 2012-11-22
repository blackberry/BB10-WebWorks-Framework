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
var CalendarAccount,
    CalendarFolder = require("./CalendarFolder");

CalendarAccount = function (args) {
    this.id = args && typeof args.id !== "undefined" ? args.id : "";
    this.name = args && typeof args.name !== "undefined" ? args.name : "";
    this.enterprise = args && args.enterprise && args.enterprise === 1 ? true : false;

    if (args && args.folders && Array.isArray(args.folders)) {
        var folders = [];
        args.folders.forEach(function (folder) {
            folders.push(new CalendarFolder(folder));
        });

        this.folders = folders;
    }
};

module.exports = CalendarAccount;
