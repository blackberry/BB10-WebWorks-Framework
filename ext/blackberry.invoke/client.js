var _self = {}, 
    _ID = "blackberry.invoke";

_self.invoke = function (appType, args) {
    return window.webworks.execAsync(_ID, "invoke", {
        'appType': appType,
        'args': args
    });
};

_self.BrowserArguments = function (url) {
    this.url = url;
};

/*
 * Define constants for appType
 */
_self.__defineGetter__("APP_CAMERA", function () {
    return 4;
});
_self.__defineGetter__("APP_MAPS", function () {
    return 5;
});
_self.__defineGetter__("APP_BROWSER", function () {
    return 11;
});
_self.__defineGetter__("APP_MUSIC", function () {
    return 13;
});
_self.__defineGetter__("APP_PHOTOS", function () {
    return 14;
});
_self.__defineGetter__("APP_VIDEOS", function () {
    return 15;
});
_self.__defineGetter__("APP_APPWORLD", function () {
    return 16;
});

module.exports = _self;