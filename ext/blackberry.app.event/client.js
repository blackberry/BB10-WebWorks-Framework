var _self = {},
    performExec = require('../../lib/utils').performExec;

_self.__defineGetter__("onExit", function () {
    return performExec("blackberry.app.event", "onExit");
});

module.exports = _self;