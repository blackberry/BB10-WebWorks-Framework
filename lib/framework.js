var webview = require('../dependencies/BBX-Emulator/lib/webview');

_self = {
    startWebview: function (url) {
        webview.create(url);
    },
    stopWebview: function () {
        webview.destroy();
    }
};

module.exports = _self;
