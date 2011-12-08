var _events = {};

module.exports = {
    addEventListener: function (name, trigger) {
        if (!_events.hasOwnProperty(name)) {
            _events[name] = trigger; // start listening
        }
    },

    removeEventListener: function (name, trigger) {
        if (_events.hasOwnProperty(name)) {
            delete _events[name]; // stop listening
        }
    },

    // HACK for testing events
    batteryLevelChanged: function () {
        if (_events["QNX_BATTERY_CHANGED_STUFF"]) {
            var eventData = {
                firedAt: new Date().toString(),
                magicNum: Math.floor(Math.random() * 11)
            };

            _events["QNX_BATTERY_CHANGED_STUFF"](eventData);
        }
    }
}