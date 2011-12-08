var _cb,
    ID = "blackberry.system.event";

module.exports = {
    onBatteryLevelChanged: function (cb) {
        if (cb) {
            webworks.event.on(ID, "batteryLevelChanged", cb);
        } else {
            webworks.event.remove(ID, "batteryLevelChanged", _cb);
        }

        _cb = cb;
    }
}