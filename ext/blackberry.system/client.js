var _self = {},
    ID = "blackberry.system";

_self.hasPermission = function (module) {
    return window.webworks.execSync(ID, "hasPermission", {"module": module});
};

_self.hasCapability = function (capability) {
    return window.webworks.execSync(ID, "hasCapability", {"capability": capability});
};

_self.__defineGetter__("ALLOW", function () {
    return 0;
});

_self.__defineGetter__("DENY", function () {
    return 1;
});

_self.__defineGetter__("model", function () {
    return window.webworks.execSync(ID, "model");
});

module.exports = _self;