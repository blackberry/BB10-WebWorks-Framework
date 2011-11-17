var webview = require('../dependencies/BBX-Emulator/lib/webview');
var config = require("./config");

var _self = {
    // Entry Point for WebWorks Application
    start: function () {
        webview.create(function () {
            webview.setURL(config.content);
        });
    },
    stopWebview: function () {
        webview.destroy();
    }
};

module.exports = _self;
