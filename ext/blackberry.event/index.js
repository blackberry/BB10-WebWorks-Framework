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

function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _event = requireLocal("lib/event"), 
    _eventsMap = {
        batterystatus: {
            eventName: "batterystatus",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        }
    }, 
    _actionMap = {
        batterystatus: {
            context: requireLocal("lib/pps/ppsEvents"),
            event: _eventsMap.batterystatus,
            trigger: function (args) {
                _event.trigger("batterystatus", args);
            }
        }
    };

var ADD_EVENT_ERROR = "Error occured while adding event listener.",
    REMOVE_EVENT_ERROR = "Error occured while removing event listener.",
    ERROR_ID = -1;

module.exports = {
    on: function (success, fail, args) {
        try {
            var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), 
            action = _actionMap[eventName];
            _event.on(action);
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
    }
};
