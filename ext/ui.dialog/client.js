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
    _ID = require("./manifest.json").namespace,
    _eventId = "ui.dialogEventId";

function createEventHandler(callback) {
    if (!window.webworks.event.isOn(_eventId)) {
        window.webworks.event.once(_ID, _eventId, callback);
    }
}

_self.customAskAsync = function (message, buttons, callback, settings) {
    var args = { "eventId" : _eventId, "message" : message, "buttons" : buttons, "callback" : callback};
    if (settings) {
        args.settings = settings;
    }

    createEventHandler(callback);
    return window.webworks.execAsync(_ID, "customAskAsync", args);
};

_self.standardAskAsync = function (message, type, callback, settings) {
    var  args = { "eventId" : _eventId, "message" : message, "type" : type, "callback" : callback };
    if (settings) {
        args.settings = settings;
    }

    createEventHandler(callback);
    return window.webworks.execAsync(_ID, "standardAskAsync", args);
};

window.webworks.defineReadOnlyField(_self, "D_OK", 0);
window.webworks.defineReadOnlyField(_self, "D_SAVE", 1);
window.webworks.defineReadOnlyField(_self, "D_DELETE", 2);
window.webworks.defineReadOnlyField(_self, "D_YES_NO", 3);
window.webworks.defineReadOnlyField(_self, "D_OK_CANCEL", 4);
window.webworks.defineReadOnlyField(_self, "D_PROMPT", 5);

module.exports = _self;
