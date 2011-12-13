var _registeredEvents = {},
    _batteryEventStarted = false; // HACK for demo

module.exports = {
    // Gets executed when battery level changed, native code needs to call this
    batteryLevelChanged: function () {
        if (_registeredEvents["QNX_BATTERY_CHANGED_STUFF"]) {

            // Need some way to get event data
            var eventData = {
                firedAt: new Date().toString(),
                magicNum: Math.floor(Math.random() * 11)
            };

            _registeredEvents["QNX_BATTERY_CHANGED_STUFF"](eventData);
        }
    },

    addEventListener: function (name, trigger) {
        if (!_registeredEvents.hasOwnProperty(name)) {
            _registeredEvents[name] = trigger; // start listening

            // HACK start event for demo
            if (!_batteryEventStarted) {
                setInterval(this.batteryLevelChanged, 10000);
                _batteryEventStarted = true;
            }
        }
    },

    removeEventListener: function (name, trigger) {
        if (_registeredEvents.hasOwnProperty(name)) {
            delete _registeredEvents[name]; // stop listening
        }
    }
};