var _event = require("../../lib/event"),
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
