function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {},
    performExec = requireLocal('lib/utils').performExec; // uses lib/utils for require id, ../.. causes problems

_self.__defineGetter__("onExit", function () {
    return performExec("blackberry.app.event", "onExit");
});

module.exports = _self;