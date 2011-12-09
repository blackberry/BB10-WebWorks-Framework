var _self = {},
    performExec = require('../../lib/utils').performExec;

_self.__defineGetter__("name", function () {
    return performExec("blackberry.app", "name");
});

_self.__defineGetter__("author", function () {
    return performExec("blackberry.app", "author");
});

_self.__defineGetter__("version", function () {
    return performExec("blackberry.app", "version");
});

module.exports = _self;