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
var ContactPickerOptions = function (properties) {
    this.mode = properties && typeof properties.mode !== "undefined" ? properties.mode : 0; // defaults to single
    this.title = properties && typeof properties.title !== "undefined" ? properties.title : "";
    this.confirmButtonLabel = properties && typeof properties.confirmButtonLabel !== "undefined" ? properties.confirmButtonLabel : "";
    this.fields = properties && typeof properties.fields !== "undefined" ? properties.fields : [];
};

Object.defineProperty(ContactPickerOptions, "MODE_SINGLE", { "value": 0 });
Object.defineProperty(ContactPickerOptions, "MODE_MULTIPLE", { "value": 1 });
Object.defineProperty(ContactPickerOptions, "MODE_ATTRIBUTE", { "value": 2 });

module.exports = ContactPickerOptions;

