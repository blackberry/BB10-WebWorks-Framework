function requireLocal(id) {
    if (require.resolve) { // node
        return require(id);
    } else { // browser
        return window.require(id.replace(/\.\//, ""));
    }
}

var _cb,
    _fooHandlers = [],
    windowObj = requireLocal("./window"),
    ID = "blackberry.system.event";

module.exports = {
    // take single callback
    onBatteryLevelChanged: function (cb) {
        var window = windowObj.window();

        if (cb) {
            window.webworks.event.on(ID, "batteryLevelChanged", cb);
        } else {
            window.webworks.event.remove(ID, "batteryLevelChanged", _cb);
        }

        _cb = cb;
    },

    // take multiple callbacks
    foo: function (cb, remove) {
        var window = windowObj.window(),
            found;

        if (cb) {
            if (!remove) {
                _fooHandlers.push(cb);
                window.webworks.event.on(ID, "foo", cb);
            } else {
                found = _fooHandlers.reduce(function (prev, current, index) {
                    if (prev >= 0) {
                        return prev;
                    } else if (current === cb) {
                        return index;
                    }

                    return -1;
                }, -1);

                if (found >= 0) {
                    delete _fooHandlers[found];
                    window.webworks.event.remove(ID, "foo", cb);
                }
            }
        }
    }
};
