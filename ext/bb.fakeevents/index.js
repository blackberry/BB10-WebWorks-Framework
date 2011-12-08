var device = require("../blackberry.system.event/device"),
    foo = require("../blackberry.system.event/foo");

module.exports = {
    start: function (success, fail, args) {
        var interval = args && args.interval ? args.interval : 10000,
            isFoo = args && args.foo === "true";

        if (isFoo) {
            success(setInterval(foo.foo, interval));
        } else {
            success(setInterval(device.batteryLevelChanged, interval));
        }
    },

    stop: function (success, fail, args) {
        if (args && args.intervalId !== undefined) {
            clearInterval(args.intervalId);
            success(args.intervalId);
        } else {
            fail("No intervalId specified");
        }
    }
};

