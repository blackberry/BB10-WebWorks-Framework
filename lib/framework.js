var webview = require('../dependencies/BBX-Emulator/lib/webview'),
    Whitelist = require('./policy/whitelist').Whitelist,
    utils = require('./utils');

function _make(request) {
    var tokens = request.url.split("blackberry/")[1].split("/");

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : tokens[3]
            },
            body : {
                //HACK This should be extracted from the request
            }
        },
        response : {
            send : function (code, data) {
                if (typeof(data) === 'string') {
                    request.respond(code, data);
                } else {
                    request.respond(code, JSON.stringify(data));
                }
            }
        }
    };
}

function _onRequest(request) {
    var url = request.url,
        whitelist = new Whitelist(),
        server,
        m;

    if (url.match("^http://localhost:8472/blackberry/")) {
        server = require("server");
        m = _make(request);

        request.substitute();
        server.handle(m.request, m.response);
    } else {
        if (whitelist.isAccessAllowed(url)) {
            request.allow();
        } else {
            request.deny();
        }
    }
}

var _self = {
    startWebview: function (url) {
        webview.create(function () {
            webview.onRequest(function (request) {
                _onRequest(request);
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
