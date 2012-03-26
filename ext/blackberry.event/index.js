var _event = require("lib/event"), _ppsUtils = require("lib/pps/ppsUtils"), _eventsMap = {
	    batterystatus: {
	    	eventName: "batterystatus",
	        eventDetailsArr: [{
	            path: "/pps/services/power/battery?wait,delta",
	            fieldNameArr: [{
	                eventName: "StateOfCharge",
	                paramName: "level",
	                formatValue: function(str) {
	                    return parseInt(str)
	                }
	            }]
	        }, {
	            path: "/pps/services/power/charger?wait,delta",
	            fieldNameArr: [{
	                eventName: "ChargingState",
	                paramName: "isPlugged",
	                formatValue: function(str) {
	                    return (str === "NC" ? false : true)
	                }
	            }]
	        }],
	        mode: 0
	    }
	}, 
	_actionMap = {
	    batterystatus: {
	        context: require("lib/pps/ppsEvents"),
	        event: _eventsMap.batterystatus,
	        trigger: function(args) {
	            _event.trigger("batterystatus", args);
	        }
	    }
	};

function callIfDefined(func, args) {
    if(func) {
        func(args);
    }
}

module.exports = {
    on: function(success, fail, args) {
        var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), action = _actionMap[eventName];
        _event.on(action);
    },
    remove: function(success, fail, args) {
        var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), action = _actionMap[eventName];
        _event.remove(action);
    }
}