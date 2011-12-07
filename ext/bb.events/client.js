var _cb;

module.exports = {
    onBatteryLevelChanged: function (cb) {
        if (cb) {
            webworks.event.on("batteryLevelChanged", cb);
        } else {
            webworks.event.remove("batteryLevelChanged", _cb);
        }

        _cb = cb;
    }
}