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
    foo: function () {
        if (_events["BAR"]) {
            var eventData = {
                magicNum: Math.floor(Math.random() * 5)
            };

            _events["BAR"](eventData);
        }
    }
}