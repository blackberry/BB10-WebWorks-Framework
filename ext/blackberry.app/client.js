function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {},
    performExec = requireLocal('lib/utils').performExec; // uses lib/utils for require id, ../.. causes problems

_self.__defineGetter__("author", function () {
    return performExec("blackberry.app", "author");
});

_self.__defineGetter__("authorEmail", function () {
    return performExec("blackberry.app", "authorEmail");
});

_self.__defineGetter__("authorURL", function () {
    return performExec("blackberry.app", "authorURL");
});

_self.__defineGetter__("copyright", function () {
    return performExec("blackberry.app", "copyright");
});

_self.__defineGetter__("description", function () {
    return performExec("blackberry.app", "description");
});

_self.__defineGetter__("id", function () {
    return performExec("blackberry.app", "id");
});

_self.__defineGetter__("license", function () {
    return performExec("blackberry.app", "license");
});

_self.__defineGetter__("licenseURL", function () {
    return performExec("blackberry.app", "licenseURL");
});

_self.__defineGetter__("name", function () {
    return performExec("blackberry.app", "name");
});

_self.__defineGetter__("version", function () {
    return performExec("blackberry.app", "version");
});

module.exports = _self;
