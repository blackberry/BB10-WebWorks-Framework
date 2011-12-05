var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist(),
    utils = require("./../utils");

module.exports = {
    exec: function (request, succ, fail, args) {
        var extension = request.params.ext,
            method = request.params.method;

        if (whitelist.isFeatureAllowed(request.origin, extension)) {
            try {
                require('./../../ext/' + extension + '/index')[method](succ, fail, args);
            } catch (e) {
                console.log(e);
                fail(404, "Feature not found");
            }
        } else {
            console.log("Feature denied by whitelist: " + extension);
            fail(403, "Feature denied by whitelist");
        }
    }
};
