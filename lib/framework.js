var webview = require('../dependencies/BBX-Emulator/lib/webview');

var _self = {
    startWebview: function () {
        webview.create();
    },
    stopWebview: function () {
        webview.destroy();
    },
    setURL: function (url) {
        webview.setURL(url);
    }
};

module.exports = _self;
