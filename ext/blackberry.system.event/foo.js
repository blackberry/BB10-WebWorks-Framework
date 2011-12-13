var _registeredEvents = {},
    _fooEventStarted = false; // HACK for demo

module.exports = {
    foo: function () {
        if (_registeredEvents["BAR"]) {
            var eventData = {
                magicNum: Math.floor(Math.random() * 5)
            };

            _registeredEvents["BAR"](eventData);
        }
    },

    addEventListener: function (name, trigger) {
        if (!_registeredEvents.hasOwnProperty(name)) {
            _registeredEvents[name] = trigger; // start listening

            // HACK start event for demo
            if (!_fooEventStarted) {
                setInterval(this.foo, 5000);
            }
        }
    },

    removeEventListener: function (name) {
        if (_registeredEvents.hasOwnProperty(name)) {
            delete _registeredEvents[name]; // stop listening
        }
    }
};