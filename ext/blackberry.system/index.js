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
        console.log(env);
        console.log(args.module);
        // TODO string argument surrounded by %22
        // preserve dot for feature id
        var module = args.module.replace(/[^a-zA-Z.]+/g, "");
        console.log("request origin: " + env.request.origin);
        console.log("module: " + module);
        success(whitelist.isFeatureAllowed(env.request.origin, module));
    }
};