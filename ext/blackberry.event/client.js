function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {}, performExec = requireLocal('lib/utils').performExec;

_self.addEventListener = function(eventType, cb) {
    performExec("blackberry.event", "addEventListener", {
        'eventType': appType,
        'cb': cb
    });
};

module.exports = _self;