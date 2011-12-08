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

module.exports = {
    on: function (success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            _event.on(action);
            success && success(name + ": handler added");
        } else {
            fail && fail(name + ": no action found");
        }
    },

    remove: function (success, fail, args) {
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            _event.remove(action);
            success && success(name + ": handler removed");
        } else {
            fail && fail(name + ": no action found");
        }
    }
};

