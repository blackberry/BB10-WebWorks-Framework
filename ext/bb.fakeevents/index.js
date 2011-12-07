var device = require("../bb.events/device");

module.exports = {
    start: function(success, fail, args) {
        var interval = args && args.interval ? args.interval : 10000;
        success(setInterval(device.batteryLevelChanged, interval));
    },

    stop: function(success, fail, args) {
        if (args && args.intervalId !== undefined) {
            clearInterval(args.intervalId);
            success(args.intervalId);
        } else {
            fail("No intervalId specified");
        }
    }
};