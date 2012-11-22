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

var Attendee;

Attendee = function (properties) {
    this.contactId = properties && typeof properties.contactId !== "undefined" ? properties.contactId : 0;
    this.email = properties && typeof properties.email !== "undefined" ? properties.email : "";
    this.eventId = properties && typeof properties.eventId !== "undefined" ? properties.eventId : 0;
    this.name = properties && typeof properties.name !== "undefined" ? properties.name : "";
    this.owner = properties && typeof properties.owner !== "undefined" ? properties.owner : false;
    this.role = properties && typeof properties.role !== "undefined" ? properties.role : 1; // default to host
    this.type = properties && typeof properties.type !== "undefined" ? properties.type : 1; // default to chair
    this.status = properties && typeof properties.status !== "undefined" ? properties.status : 0; // default to unknown
};

Object.defineProperty(Attendee, "TYPE_HOST", {"value": 1, "enumerable": true});
Object.defineProperty(Attendee, "TYPE_PARTICIPANT", {"value": 2, "enumerable": true});

Object.defineProperty(Attendee, "ROLE_CHAIR", {"value": 1, "enumerable": true});
Object.defineProperty(Attendee, "ROLE_REQUIRED_PARTICIPANT", {"value": 2, "enumerable": true});
Object.defineProperty(Attendee, "ROLE_OPTIONAL_PARTICIPANT", {"value": 3, "enumerable": true});
Object.defineProperty(Attendee, "ROLE_NON_PARTICIPANT", {"value": 4, "enumerable": true});

Object.defineProperty(Attendee, "STATUS_UNKNOWN", {"value": 0, "enumerable": true});
Object.defineProperty(Attendee, "STATUS_TENTATIVE", {"value": 2, "enumerable": true});
Object.defineProperty(Attendee, "STATUS_ACCEPTED", {"value": 3, "enumerable": true});
Object.defineProperty(Attendee, "STATUS_DECLINED", {"value": 4, "enumerable": true});
Object.defineProperty(Attendee, "STATUS_NOT_RESPONDED", {"value": 5, "enumerable": true});

module.exports = Attendee;