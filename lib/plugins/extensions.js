var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist();

module.exports = {
    get: function (request, succ, fail) {
        var featureIds = whitelist.getFeaturesForUrl(request.origin);
        succ(featureIds);
    }
};
