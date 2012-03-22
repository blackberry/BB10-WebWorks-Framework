var _event = require("lib/event"), _ppsUtils = require("lib/pps/ppsUtils"), 
_actionMap = {
    batterystatus: {
        context: require("lib/pps/ppsEvents"),
        event: "batterystatus",
        trigger: function(args) {
            _event.trigger("batterystatus", args);
        }
    }
/*    ,
    batterylow: {
        context: "",
        event: "batterylow",
        trigger: function(args) {
            _event.trigger("foo", args);
        }
    },
    batterycritical: {
        context: "",
        event: "batterycritical",
        trigger: function(args) {
            _event.trigger("foo", args);
        }
    }
*/    
};

function callIfDefined(func, args) {
    if(func) {
        func(args);
    }
}

module.exports = {
    on: function(success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), action = _actionMap[eventName];
        _event.on(action);
        /*
         if(name != "") {
         _ppsUtils.registerEvent(eventName, action.webviewTrigger);
         callIfDefined(success, eventName + " : handler added");
         } else {
         callIfDefined(fail, id + ": name not valid");
         }
         */
    },
    
    remove: function(success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var name = decodeURIComponent(args.eventName).replace(/\"/g, "");

        if(name != "") {
            _pps.unregisterEvent(name);
            callIfDefined(success, name + " : handler removed");
        } else {
            callIfDefined(fail, name + ": name not valid");
        }
    }
}
