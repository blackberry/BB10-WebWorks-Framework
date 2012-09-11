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

var _event = require("../../lib/event"),
    _actionMap = {};

var ADD_EVENT_ERROR = "Error occured while adding event listener.",
    REMOVE_EVENT_ERROR = "Error occured while removing event listener.",
    ERROR_ID = -1;

module.exports = {
    add: function (success, fail, args) {
        try {
            var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), 
                action = _actionMap[eventName];

            _event.add(action);

            if (success) {
                success();
            }
        }
        catch (e) {
            if (fail) {
                fail(ERROR_ID, ADD_EVENT_ERROR);
            }
        }
    },
    remove: function (success, fail, args) {
        try {
            var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), 
            action = _actionMap[eventName];
            _event.remove(action);
            if (success) {
                success();
            }
        }
        catch (e) {
            if (fail) {
                fail(ERROR_ID, REMOVE_EVENT_ERROR);
            }
        }
    },
    isEventRegistered: function (eventName) {
        return !!_actionMap[eventName];
    },
    registerEvents: function (map) {
        if (!map) {
            throw "map is null or undefined";
        }

        Object.getOwnPropertyNames(map).forEach(function (eventName) {
            if (eventName && map[eventName]) {
                var action = map[eventName];

                if (action.context && typeof action.context.addEventListener === "function" && typeof action.context.removeEventListener === "function") {
                    _actionMap[eventName] = action;
                } else {
                    throw "action '" + eventName + "' does not have valid context";
                }
            } else {
                throw "map contains invalid action: '" + eventName + "'";
            }
        });
    }
};
