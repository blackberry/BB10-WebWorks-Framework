var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist,
    libraries = require('./config/libraries'),
    FeatureManager = require('./policy/featureManager').FeatureManager;

var _self = {
    startWebview: function (url) {
        var whitelist = new Whitelist();
        webview.create(function () {
            // Whitelist
            webview.onRequest(function (request) {
                // If the URL is to get the extensions/features list
                if (request.url === "http://localhost:8472/blackberry/extensions/get") {
                    request.substitute();

                    // Hardcode it for now until we figured out how to pass origin information through onRequest
                    var origin = "WIDGET_LOCAL",
                        featureIds = whitelist.getFeaturesForUrl(origin),
                        featureManager = new FeatureManager(libraries),
                        extensionObjects = featureManager.getExtensionsObjectForFeatures(featureIds);

                    request.respond(200, JSON.stringify(extensionObjects));

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
