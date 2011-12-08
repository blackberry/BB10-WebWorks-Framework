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
    on: function(success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            action.context.addEventListener(action.event, action.trigger || trigger);
            _event.on(action);
        }
    },

    remove: function(succes, fail, args) {
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            action.context.removeEventListener(action.event, action.trigger || _trigger);
            _event.remove(action);
        }
    }
};

