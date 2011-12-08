var _cb,
    _fooHandlers = [],
    ID = "blackberry.system.event";

module.exports = {
    onBatteryLevelChanged: function (cb) {
        if (cb) {
            webworks.event.on(ID, "batteryLevelChanged", cb);
        } else {
            webworks.event.remove(ID, "batteryLevelChanged", _cb);
        }

        _cb = cb;
    },

    // take multiple callbacks
    foo: function (cb, remove) {
        if (cb) {
            if (!remove) {
                _fooHandlers.push(cb);
                webworks.event.on(ID, "foo", cb);
            } else {
                var found = _fooHandlers.reduce(function (prev, current, index) {
                    if (prev >= 0) {
                        return prev;
                    } else if (current === cb) {
                        return index;
                    }

                    return -1;
                }, -1);

                if (found >= 0) {
                    delete _fooHandlers[found];
                    webworks.event.remove(ID, "foo", cb);
                }
            }
        }
    }
}

