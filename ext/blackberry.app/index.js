function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var config = requireLocal("lib/config");

module.exports = {
    author: function (success, fail, args, env) {
        success(config.author);
    },

    authorEmail: function (success, fail, args, env) {
        success(config.authorEmail);
    },

    authorURL: function (success, fail, args, env) {
        success(config.authorURL);
    },

    copyright: function (success, fail, args, env) {
        success(config.copyright);
    },

    description: function (success, fail, args, env) {
        success(config.description);
    },

    id: function (success, fail, args, env) {
        success(config.id);
    },

    license: function (success, fail, args, env) {
        success(config.license);
    },

    licenseURL: function (success, fail, args, env) {
        success(config.licenseURL);
    },

    name: function (success, fail, args, env) {
        success(config.name);
    },

    version: function (success, fail, args, env) {
        success(config.version);
    }
};
