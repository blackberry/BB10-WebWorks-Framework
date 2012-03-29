var _self = {}, 
    _ID = "blackberry.event";

_self.addEventListener = function (eventType, cb) {
    window.webworks.event.on(_ID, eventType, cb);
};

_self.removeEventListener = function (eventType, cb) {
    window.webworks.event.remove(_ID, eventType, cb);
};


module.exports = _self;
