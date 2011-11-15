var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist;

var _self = {
    startWebview: function (url) {
        var whitelist = new Whitelist();
        webview.create(function () {
            // Whitelist
            webview.onRequest(function (request) {
                if (whitelist.isAccessAllowed(request.url)) {
                    request.allow();
                } else {
                    request.deny();
                }
            });
            // Start page
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
