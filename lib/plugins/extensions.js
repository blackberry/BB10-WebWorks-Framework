var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist();

module.exports = {
    get: function (request, succ, fail) {
        var featureIds = whitelist.getFeaturesForUrl(request.origin);
        succ(featureIds);
    },

    load: function (request, succ, fail, args, env) {
        var extension = request.params.ext,
            xhr;

        if (whitelist.isFeatureAllowed(request.origin, extension)) {
            try {
                xhr = new XMLHttpRequest();
                xhr.open("GET", "ext/" + extension + "/client.js", false);
                xhr.send();
                // send client JS content as plain text, not wrapped as a JSON object
                env.response.send(200, xhr.responseText);
            } catch (e) {
                console.log(e);
                fail(404, "Failed to load extension client");
            }
        } else {
            console.log("Feature denied by whitelist: " + extension);
            fail(403, "Feature denied by whitelist");
        }
    }
};
