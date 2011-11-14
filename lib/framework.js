var webview = require('../dependencies/BBX-Emulator/lib/webview');
var config = require("./config");

var _self = {
    // Entry Point for WebWorks Application
    start: function () {
        this.startWebview(config.content);

        //webview.onRequest = function (request) {
            //request.allow();
            //request.deny();
            //request.respond(200, "this is the response");
        //}
    },
    
    startWebview: function (url) {
        webview.create(function () {
            if (url) {
                webview.setURL(url);
            }
        });
    },
    stopWebview: function () {
        webview.destroy();
    }
};

module.exports = _self;
