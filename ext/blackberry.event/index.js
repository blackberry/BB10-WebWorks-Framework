var _event = require("lib/event"), _ppsUtils = require("lib/pps/ppsUtils"), 
_actionMap = {
    pause: {
        context: "",
        event: "",
        trigger: function(args) {
            _pps.processEvent(args);
        },
        webviewTrigger: function(name, args) {
            _event.trigger(name, args);
        }
    },
    resume: {
        context: "",
        event: "BAR",
        trigger: function(args) {
            _event.trigger("foo", args);
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
        // TODO string argument surrounded by %22, to be fixed
        var eventName = decodeURIComponent(args.eventName).replace(/\"/g, ""), action = _actionMap[eventName];
        addEventListener(success, fail, eventName);
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

function addEventListener(success, fall, eventName) {
    var path = "/pps/services/power/battery", mode = 0;

    _ppsUtils.init();
    _ppsUtils.onChange = function(data) {
        console.log("Data from pps: " + data);
    }

    _ppsUtils.open(path, mode);
};