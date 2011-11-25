var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist,
    libraries = require('./config/libraries'),
    FeatureManager = require('./policy/featureManager').FeatureManager,
    utils = require('./utils');

var _self = {
    startWebview: function (url) {
        var whitelist = new Whitelist();
        webview.create(function () {
            // Whitelist
            webview.onRequest(function (request) {
                console.log("on request, url=" + request.url);
                // Hardcode it for now until we figured out how to pass origin information through onRequest
                var origin = "local:///index.html",
                    featureManager = new FeatureManager(libraries);

                // If the URL is to get the extensions/features list
                if (request.url === "http://localhost:8472/blackberry/extensions/get") {
                    request.substitute();

                    var featureIds = whitelist.getFeaturesForUrl(origin),
                        extensionObjects = featureManager.getExtensionsObjectForFeatures(featureIds);

                    request.respond(200, JSON.stringify(extensionObjects));

                    return;
                } else if (utils.startsWith(request.url, "http://localhost:8472/blackberry/exec/")) {
                    request.substitute();

                    var path = utils.parseUri(request.url).path,
                        matcher = /^\/blackberry\/exec\/(.*)\/.*/.exec(path),
                        featureId = matcher[1],
                        action = utils.parseUri(request.url).file,
                        feature,
                        success = function (result) {
                            request.respond(200, JSON.stringify({
                                code: 1,
                                data: result
                            }));
                        },
                        error = function (err) {
                            request.respond(200, JSON.stringify({
                                code: 1,
                                data: null,
                                msg: err
                            }));
                        };

                    if (whitelist.isFeatureAllowed(origin, featureId)) {
                        feature = require("./../ext/" + featureId + "/server.js");
                        feature[action](success, error);
                    } else {
                        console.log("Feature denied by whitelist: " + featureId);
                        request.respond(403, "Forbidden");
                    }
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
