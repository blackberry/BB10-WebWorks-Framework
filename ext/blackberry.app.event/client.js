var _self = {};

_self.__defineGetter__("onExit", function () {
    return window.webworks.execSync("blackberry.app.event", "onExit");
});

module.exports = _self;