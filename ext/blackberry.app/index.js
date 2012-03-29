var config = require("lib/config"); // uses lib/config for require id, ../.. causes problems

module.exports = {
    author: function (success, fail, args) {
        success(config.author);
    },

    name: function (success, fail, args) {
        success(config.name);
    },

    version: function (success, fail, args) {
        success(config.version);
    }
};
