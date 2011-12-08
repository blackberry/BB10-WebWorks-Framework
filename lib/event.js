var _webview = require("../dependencies/BBX-Emulator/lib/webview");

module.exports = {
    trigger: function (name, args) {
        _webview.executeJavascript("webworks.event.trigger('" + name + "', '" + JSON.stringify(args) +"')");
    },

    on: function (action) {
        if (action) {
            action.context.addEventListener(action.event, action.trigger || trigger);
        }
    },

    remove: function (action) {
        if (action) {
            action.context.removeEventListener(action.event, action.trigger || _trigger);
        }
    }
};