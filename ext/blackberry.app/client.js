var _self = {};

_self.__defineGetter__("author", function () {
    return window.webworks.execSync("blackberry.app", "author", null);
});

_self.__defineGetter__("authorEmail", function () {
    return window.webworks.execSync("blackberry.app", "authorEmail", null);
});

_self.__defineGetter__("authorURL", function () {
    return window.webworks.execSync("blackberry.app", "authorURL", null);
});

_self.__defineGetter__("copyright", function () {
    return window.webworks.execSync("blackberry.app", "copyright", null);
});

_self.__defineGetter__("description", function () {
    return window.webworks.execSync("blackberry.app", "description", null);
});

_self.__defineGetter__("id", function () {
    return window.webworks.execSync("blackberry.app", "id", null);
});

_self.__defineGetter__("license", function () {
    return window.webworks.execSync("blackberry.app", "license", null);
});

_self.__defineGetter__("licenseURL", function () {
    return window.webworks.execSync("blackberry.app", "licenseURL", null);
});

_self.__defineGetter__("name", function () {
    return window.webworks.execSync("blackberry.app", "name", null);
});

_self.__defineGetter__("version", function () {
    return window.webworks.execSync("blackberry.app", "version", null);
});

module.exports = _self;
