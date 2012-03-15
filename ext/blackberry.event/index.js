var _jnext = require("lib/jnext"), _event = require("lib/event");

function callIfDefined(func, args) {
    if(func) {
        func(args);
    }
}

module.exports = {
    addEventListener: function(success, fall, args) {
        var path = "/pps/services/navigator/control?server", mode = 0;

        open(function(id) {
            ctrlObj.id = id
        }, new Function(), {
            'path': encodeURIComponent(path),
            'mode': mode
        });
    }
};

/**
 * Creates and opens the pps object. Returns the ID.
 * @param success
 * @param fail
 * @param args
 */
function open(success, fail, args) {
    var invokeArgs = {}, rsp;

    if(_jnext.require('pps')) {
        // open requires the string -> "id cmd path mode"
        invokeArgs.id = _jnext.createObject('pps.PPS')
        invokeArgs.cmd = 'Open';
        invokeArgs.params = decodeURIComponent(args.path);
        invokeArgs.params += " " + args.mode;
        rsp = _jnext.invoke(invokeArgs);

        if(rsp.split(" ")[0] != 'Ok') {
            fail(rsp.split(":")[1]);
        } else {
            success(rsp.split(" ")[1]);
        }
    } else {
        fail('error loading pps module');
    }
};
