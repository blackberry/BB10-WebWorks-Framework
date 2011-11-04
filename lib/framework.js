var webview = require('../dependencies/BBX-Emulator/lib/webview');

var _self = {
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
