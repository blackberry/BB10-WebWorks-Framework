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
    // This object is used by action map and contains links between pps object fields monitored for change in that object helper methods
    // to analyze if the value is the one callback should be invoked and fields name and value format as would appear on return.
    // Set disableOnChange to true if not interested on change for a particular field but still interested to return its value.  
    _eventsMap = {
        batterycritical: {
            eventName: "batterycritical",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    lastValue: null,
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    },
                    skipTrigger: function (value) {
                        var threshold = 4,
                            result = (value > threshold) || (this.lastValue && this.lastValue <= threshold);

                        this.lastValue = value;

                        return result;
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                disableOnChange: true,
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        },
        batterylow: {
            eventName: "batterylow",
            eventDetailsArr: [{
                path: "/pps/services/power/battery?wait,delta",
                fieldNameArr: [{
                    eventName: "StateOfCharge",
                    paramName: "level",
                    lastValue: null,
                    formatValue: function (str) {
                        return parseInt(str, 10);
                    },
                    skipTrigger: function (value) {
                        var threshold = 14,
                            result = (value > threshold) || (this.lastValue && this.lastValue <= threshold);

                        this.lastValue = value;

                        return result;
                    }
                }]
            }, {
                path: "/pps/services/power/charger?wait,delta",
                disableOnChange: true,
                fieldNameArr: [{
                    eventName: "ChargingState",
                    paramName: "isPlugged",
                    formatValue: function (str) {
                        return (str === "NC" ? false : true);
                    }
                }]
            }],
            mode: 0
        },
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
        batterycritical: {
            context: requireLocal("lib/pps/ppsEvents"),
            event: _eventsMap.batterycritical,
            trigger: function (args) {
                _event.trigger("batterycritical", args);
            }
        },
        batterylow: {
            context: requireLocal("lib/pps/ppsEvents"),
            event: _eventsMap.batterylow,
            trigger: function (args) {
                _event.trigger("batterylow", args);
            }
        },
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
