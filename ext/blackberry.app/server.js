var config = require("./../../lib/config");

module.exports = {
    get: function (success, fail, args) {
        success({
            "author": config.author,
            "name": config.name
        });
    },

    author: function (success, fail, args) {
        success({
            "author": config.author,
        });
    },

    name: function (success, fail, args) {
        success({
            "name": config.name
        });
    }
};
