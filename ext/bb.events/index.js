var _webview = require("../../dependencies/BBX-Emulator/lib/webview"),
    _trigger = function (name, args) {
        _webview.executeJavascript("webworks.event.trigger('" + name + "', '" + JSON.stringify(args) +"')");
    },
    _actionMap = {
        batteryLevelChanged: {
            context: require("./device"),
            event: "QNX_BATTERY_CHANGED_STUFF",
            trigger: function (args) {
                _trigger("batteryLevelChanged", args);
            }
        }
    };

module.exports = {
    on: function(success, fail, args) {
        // TODO string argument surrounded by %22, to be fixed
        var name = args.eventName.replace(/[^a-zA-Z]+/g, ""),
            action = _actionMap[name];

        if (action) {
            action.context.addEventListener(action.event, action.trigger || _trigger);
        }
    },

    remove: function(success, fail, args) {
        var name = args.eventName.replace(/[^a-zA-Z]+/g, "");

        if (action) {
            action.context.removeEventListener(action.event, action.trigger || _trigger);
        }
    }
};