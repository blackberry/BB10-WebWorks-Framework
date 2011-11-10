var webview = require('../dependencies/BBX-Emulator/lib/webview'),    
    Whitelist = require('./policy/whitelist').Whitelist;

var _self = {
    startWebview: function (url) {
        webview.create(function () {         
            // Whitelist
            webview.onRequest(function (request) {       
                var whitelist = new Whitelist();                
                if (whitelist.isAccessAllowed(request.url)) {
                    request.allow();
                } else {
                    console.log('Denying access to ' + request.url); 
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
