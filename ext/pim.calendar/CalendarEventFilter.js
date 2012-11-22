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

var CalenderEventFilter = function (properties) {
    this.substring = properties && typeof properties.substring !== "undefined" ? properties.substring : "";
    this.folders = properties && typeof properties.folders !== "undefined" ? properties.folders : null;
    this.start = properties && typeof properties.start !== "undefined" ? properties.start : null;
    this.end = properties && typeof properties.end !== "undefined" ? properties.end : null;
    this.expandRecurring = properties && typeof properties.expandRecurring !== "undefined" ? properties.expandRecurring : false;
};

module.exports = CalenderEventFilter;
