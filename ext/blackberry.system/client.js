function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {},
    ID = "blackberry.system",
    performExec = requireLocal('lib/utils').performExec; // uses lib/utils for require id, ../.. causes problems

_self.hasPermission = function (module) {
    var result;

    try {
        result = performExec(ID, "hasPermission", {"module": module});
        console.log("system hasPermission: " + result);
        return result;
    } catch (e) {
        // handle error
    }
};

_self.__defineGetter__("ALLOW", function () {
    return 0;
});

_self.__defineGetter__("DENY", function () {
    return 1;
});

_self.__defineGetter__("model", function () {
    return performExec(ID, "model");
});

module.exports = _self;