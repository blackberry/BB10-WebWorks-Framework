function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    id = "../../" + id;
    return !!require.resolve ? require(id) : window.require(id);
}

var _self = {},
    performExec = requireLocal('lib/utils').performExec; // uses lib/utils for require id, ../.. causes problems

_self.__defineGetter__("model", function () {
    return performExec("blackberry.system", "model");
});

module.exports = _self;