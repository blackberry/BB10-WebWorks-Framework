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

var CalendarFolder = function (properties) {
    this.accountId = properties && typeof properties.accountId !== "undefined" ? properties.accountId : "";
    this.color = properties && typeof properties.color !== "undefined" ? properties.color : "";
    this.id = properties && typeof properties.id !== "undefined" ? properties.id : "";
    this.name = properties && typeof properties.name !== "undefined" ? properties.name : "";
    this.ownerEmail = properties && typeof properties.ownerEmail !== "undefined" ? properties.ownerEmail : "";
    this.readonly = properties && typeof properties.readonly !== "undefined" ? properties.readonly : false;
    this.type = properties && typeof properties.type !== "undefined" ? properties.type : -1; // TODO
    this.visible = properties && typeof properties.visible !== "undefined" ? properties.visible : true;
    this.default = properties && typeof properties.default !== "undefined" ? properties.default : false;
    this.enterprise = properties && typeof properties.enterprise !== "undefined" ? properties.enterprise : false;
};

module.exports = CalendarFolder;
