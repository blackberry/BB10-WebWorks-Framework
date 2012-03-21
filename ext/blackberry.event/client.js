function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _self = {}, _ID = "blackberry.event", _cb;

_self.addEventListener = function(eventType, cb) {
    if(cb) {
        window.webworks.event.on(_ID, eventType, cb);
    } else {
        window.webworks.event.remove(_ID, eventType, cb);
    }
};

module.exports = _self;
