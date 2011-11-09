var config = require("./config");
var framework = require("./framework");

var _self = {
    start: function () {
        framework.startWebview(config.content);

        //var webview = require("./lib/webView");

        //webview.setURL("http://foo.com");
        //webview.onRequest = function (request) {
            //request.allow();
            //request.deny();
            //request.respond(200, "this is the response");
        //}
    }
};

module.exports = _self;
