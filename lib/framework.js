var webview = require('../dependencies/BBX-Emulator/lib/webview');
var config = require("./config");

var _self = {
    // Entry Point for WebWorks Application
    start: function () {
        _self.startWebview(config.content);
    },

    startWebview: function (url) {
        webview.create(function () {
            if (url) {
                webview.setURL(url);
            }
            webview.setURL(config.content);
        });
    },

    stopWebview: function () {
        webview.destroy();
    }
};

module.exports = _self;
