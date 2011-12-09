var config = require("./../../lib/config");

module.exports = {    
    onExit: function (success, fail, args) {
        success("exiting");
    }
};
