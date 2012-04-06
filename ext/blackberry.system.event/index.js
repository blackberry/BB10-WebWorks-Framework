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

var _event = require("lib/event"),  // uses lib/event for require id, ../.. causes problems
    _actionMap = {
        batteryLevelChanged: {
            context: require("./device"),
            event: "QNX_BATTERY_CHANGED_STUFF",
            trigger: function (args) {
                _event.trigger("batteryLevelChanged", args);
            }
        },
        foo : {
            context: require("./foo"),
            event: "BAR",
            trigger: function (args) {
                _event.trigger("foo", args);
            }
        }
    };

function callIfDefined(func, args) {
    if (func) {
        func(args);
    }
}

module.exports = {
    on: function (success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            _event.on(action);
            callIfDefined(success, name + ": handler added");
        } else {
            callIfDefined(fail, name + ": no action found");
        }
    },

    remove: function (success, fail, args) {
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            _event.remove(action);
            callIfDefined(success, name + ": handler removed");
        } else {
            callIfDefined(fail, name + ": no action found");
        }
    }
};
