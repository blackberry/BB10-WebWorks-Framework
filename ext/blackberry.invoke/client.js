function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {}, performExec = requireLocal('lib/utils').performExec;
// uses lib/utils for require id, ../.. causes problems

_self.invoke = function(appType, args) {
    performExec("blackberry.invoke", "invoke", {
        'appType': appType,
        'args': args
    });
};
/*
 * Constructor for a new CameraArguments object.
 * readwrite  property  Number   view
 */
_self.invoke.CameraArguments = function() {
    this.view = 0;
};
/*
 * Define constants for CameraArguments
 */
_self.invoke.CameraArguments.__defineGetter__("VIEW_CAMERA", function() {
    return 0;
});
_self.invoke.CameraArguments.__defineGetter__("VIEW_RECORDER", function() {
    return 1;
});
/* Open Browser application on the BlackBerry PlayBook.
 * @param url The desired url to bring up in the browser.
 */
_self.invoke.BrowserArguments = function(url) {
    this.url = url;
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
