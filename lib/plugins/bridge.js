var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist();

function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}	
	
module.exports = {
    exec: function (request, succ, fail, args, env) {
        var extension = request.params.ext,
            method = request.params.method;

        if (whitelist.isFeatureAllowed(request.origin, extension)) {
            try {
                requireLocal('ext/' + extension + '/index')[method](succ, fail, args, env); // need to use require id, ../.. causes problems
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
