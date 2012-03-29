function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {},
    performExec = requireLocal('lib/utils').performExec; // uses lib/utils for require id, ../.. causes problems

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