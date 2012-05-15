/*
 * Copyright 2010-2011 Research In Motion Limited.
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
 
var _self = {},
    _ID = "blackberry.ui.dialog";

function getUniqueEventId() {
    return parseInt(Math.floor((Math.random() * 1000000) + 1), 10);
}

_self.customAskAsync = function (message, buttons, callback, settings) {
    var eventId = getUniqueEventId(),
        args = { "eventId" : eventId, "message" : message, "buttons" : buttons, "callback" : callback };
    if (settings) {
        args.settings = settings;
    }

    window.webworks.event.once(_ID, eventId, callback);
    return window.webworks.execAsync(_ID, "customAskAsync", args);
};

_self.standardAskAsync = function (message, type, callback, settings) {
    var eventId = getUniqueEventId(),
        args = { "eventId" : eventId, "message" : message, "type" : type, "callback" : callback };
    if (settings) {
        args.settings = settings;
    }

    window.webworks.event.once(_ID, eventId, callback);
    return window.webworks.execAsync(_ID, "standardAskAsync", args);
};

window.webworks.defineReadOnlyField(_self, "SIZE_FULL", "full");
window.webworks.defineReadOnlyField(_self, "SIZE_LARGE", "large");
window.webworks.defineReadOnlyField(_self, "SIZE_MEDIUM", "medium");
window.webworks.defineReadOnlyField(_self, "SIZE_SMALL", "small");
window.webworks.defineReadOnlyField(_self, "SIZE_TALL", "tall");
window.webworks.defineReadOnlyField(_self, "BOTTOM", "bottomCenter");
window.webworks.defineReadOnlyField(_self, "CENTER", "middleCenter");
window.webworks.defineReadOnlyField(_self, "TOP", "topCenter");

window.webworks.defineReadOnlyField(_self, "D_OK", 0);
window.webworks.defineReadOnlyField(_self, "D_SAVE", 1);
window.webworks.defineReadOnlyField(_self, "D_DELETE", 2);
window.webworks.defineReadOnlyField(_self, "D_YES_NO", 3);
window.webworks.defineReadOnlyField(_self, "D_OK_CANCEL", 4);

module.exports = _self;
