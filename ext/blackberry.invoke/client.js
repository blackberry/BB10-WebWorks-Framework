function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {}, performExec = requireLocal('lib/utils').performExec;

_self.invoke = function(appType, args) {
    performExec("blackberry.invoke", "invoke", {
        'appType': appType,
        'args': args
    });
};

_self.BrowserArguments = function(url, transport) {
    this.url = url.split('://')[0].toLowerCase() + '://' + url.split('://')[1];

    if (transport) {
        this.transport = transport;
    }
};

/*
 * Define constants for appType
 */
_self.__defineGetter__("APP_CAMERA", function() {
    return 4;
});
_self.__defineGetter__("APP_MAPS", function() {
    return 5;
});
_self.__defineGetter__("APP_BROWSER", function() {
    return 11;
});
_self.__defineGetter__("APP_MUSIC", function() {
    return 13;
});
_self.__defineGetter__("APP_PHOTOS", function() {
    return 14;
});
_self.__defineGetter__("APP_VIDEOS", function() {
    return 15;
});
_self.__defineGetter__("APP_APPWORLD", function() {
    return 16;
});

module.exports = _self;