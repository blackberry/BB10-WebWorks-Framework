var _self = {},
    performExec = require('../../lib/utils').performExec;

_self.__defineGetter__("model", function () {
    return performExec("blackberry.system", "model");
});

module.exports = _self;