var webview = require('../dependencies/BBX-Emulator/lib/webview');

var _self = {
    startWebview: function (url, done) {
        webview.create(function () {
            if (url) {
                webview.setURL(url);
            }
            if (done) {
                done();
            }
        });
    },
    stopWebview: function () {
        webview.destroy();
    }
};

//_self.startWebview('http://www.google.com');
module.exports = _self;
