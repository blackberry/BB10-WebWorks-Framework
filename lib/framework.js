var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist,
    FeatureManager = require('./policy/featureManager').FeatureManager,
    handler = require('./handler.js'),
    utils = require('./utils');

var _self = {
    startWebview: function (url) {
        var whitelist = new Whitelist();
        webview.create(function () {
            // Whitelist
            webview.onRequest(function (request) {
                // If the URL is to get the extensions/features list
                if (request.url === "http://localhost:8472/blackberry/extensions/get") {
                    handler.onListFeatures(request);
                    return;
                } else if (utils.startsWith(request.url, "http://localhost:8472/blackberry/exec/")) {
                    handler.onExecFeature(request);
                    return;
                }

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
