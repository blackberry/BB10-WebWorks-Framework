var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist(),
    utils = require("./../utils");

module.exports = {
    get: function (request, succ, fail) {
        var featureIds = whitelist.getFeaturesForUrl(utils.getOrigin(request));
        succ(featureIds);
    }
};
