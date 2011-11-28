var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist,
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
                } else if (utils.startsWith(request.url, "http://localhost:8472/blackberry/bridge/exec/")) {
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

var make = function (request) {
        var tokens = request.url.split("blackberry/")[1].split("/");

        return {
            request: {
                params: {
                    service: tokens[0],
                    action: tokens[1],
                    ext: tokens[2],
                    method: tokens[3]
                },
                body: {
                    //HACK This should be extracted from the request
                }
            },
            response: {
                send: function (code, data) {
                    request.respond(code, JSON.stringify(data));
                }
            }
        }

    },
    onRequest = function (request) {
        var url = request.url,
            server;

        if (url.match("^http://localhost:8472/blackberry/")) {
            var server = require("server"),
                m = make(request);

            request.substitute();
            server.handle(m.request, m.response);
        }
        else if (whitelist.isAccessAllowed(request.url)) {
            request.allow();
        }

        request.deny();
    };

module.exports = _self;
