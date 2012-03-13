var _jnext = require("lib/jnext"), _pps = require("./pps"), _event = require("lib/event"), _actionMap = {
    nativeEvent: {
        context: document.getElementById('textarea'),
        event: "textInput",
        trigger: function(args) {
            _pps.processEvent(args);
        },
        webviewTrigger: function(name, args) {
            _event.trigger(name, args);
        }
    },
};

function callIfDefined(func, args) {
    if(func) {
        func(args);
    }
}

module.exports = {
    invoke: function(success, fall, args) {
        var path = "/pps/services", mode = 0;
        var ctrlObj = {
            'id': undefined,
            'obj': {
                'id': "",
                'dat': null,
                'msg': "invoke"
            }
        };

        switch(args.appType) {
            // Camera
            case 4:
                break;
            // Maps
            case 5:
                break;
            //Browser
            default:
            case 11:
                path += "/navigator/control?server";
                mode = 2;

                ctrlObj.obj.dat = (decodeURIComponent(decodeURIComponent(args.args))).url;
                ctrlObj.obj = encodeURIComponent(JSON.stringify(ctrlObj.obj));
                break;
            // Music
            case 13:
                break;
            //Photos
            case 14:
                break;
            //Videos
            case 15:
                break;
            // AppWorld
            case 16:
                break;
            //            default:
            //              break;
        }

        open(function(id) {
            ctrlObj.id = id
        }, new Function(), {
            'path': encodeURIComponent(path),
            'mode': mode
        });

        write(new Function(), new Function(), ctrlObj);
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

/**
 * Reads the pps object and returns either the entire object or the key/value pair (TODO)
 * @param success
 * @param fail
 * @param args
 */
function read(success, fail, args) {
    var invokeArgs = {}, rsp, rc;

    // read requires the string -> "id cmd"
    invokeArgs.id = args.id;
    invokeArgs.cmd = 'Read';
    rsp = _jnext.invoke(invokeArgs);
    rc = rsp.split(' ')[0];

    if(rc != 'Ok') {
        fail('error reading pps object');
    } else {
        success(JSON.parse(rsp.substring(rc.length + 1)));
    }
};

/**
 * Writes to the pps object
 * @param success
 * @param fail
 * @param args
 */
function write(success, fail, args) {
    var invokeArgs = {}, rsp;

    // write requres "id cmd objStr"
    invokeArgs.id = args.id;
    invokeArgs.cmd = 'Write';
    invokeArgs.params = decodeURIComponent(args.obj);
    rsp = _jnext.invoke(invokeArgs);

    if(rsp.split(" ")[0] != 'Ok') {
        fail('error writing to pps object');
    } else {
        success(rsp);
    }

};