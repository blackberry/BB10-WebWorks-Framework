function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var Whitelist = requireLocal("lib/policy/whitelist").Whitelist,
    whitelist = new Whitelist();

module.exports = {
    model: function (success, fail, args) {
        success("BB10");
    },

    hasPermission: function (success, fail, args, env) {
        // TODO string argument surrounded by %22
        // preserve dot for feature id
        var module = args.module.replace(/[^a-zA-Z.]+/g, ""),
            allowed = whitelist.isFeatureAllowed(env.request.origin, module);

        // ALLOW - 0, DENY - 1
        success(allowed ? 0 : 1);
    }
};