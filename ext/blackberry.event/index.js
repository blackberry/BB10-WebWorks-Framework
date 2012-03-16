var _jnext = require("lib/jnext"), _event = require("lib/event"), _cb, _ID = "blackberry.event";

function callIfDefined(func, args) {
    if(func) {
        func(args);
    }
}

module.exports = {
    addEventListener: function(success, fall, args) {
        var path = "/pps/services/navigator/control?server", mode = 0, eventId;

        open(function(id) {
            eventId = id;
        }, new Function(), {
            'path': encodeURIComponent(path),
            'mode': mode
        });

        if(cb) {
            window.webworks.event.on(_ID, 'QNX_PPS_EVENT_' + eventId, cb);
        } else {
            window.webworks.event.remove(_ID, 'QNX_PPS_EVENT_' + eventId, _cb);
        }
        _cb = cb;

    },
    
    /** on
     * This method mirrors the webworks.event.on method.  The eventName, 'QNX_PPS_EVENT_<id>',
     * is registered with the extension's (pps.js) registration object.  Note, that the 
     * trigger is a call that will eventually execute the callback on the client side 
     * passing a stringified JSON object as a parameter. *head-is-spinning-then-esplodes*
     * 
     * @param args {object} 'eventName':<value> ie: 'QNX_PPS_EVENT_<id>'
     * @returns {http response} Either 'handler added' or 'name not valid'
     */
    on: function (success, fail, args) {
        console.log("on in index: name");
        
        // TODO string argument surrounded by %22, to be fixed
        var name = decodeURIComponent(args.eventName).replace(/\"/g, ""),
                action = _actionMap['nativeEvent'];
        
        console.log('on: name ' + name);
        
        if (name != "") {
            _pps.registerEvent(name, action.webviewTrigger);
            callIfDefined(success, name +" : handler added");
        } else {
            callIfDefined(fail, id + ": name not valid");
        }
    },

    /** remove
     * This method mirrors the webworks.event.remove method.
     *
     * @param args {object} This object has the eventName property. ie: 'QNX_PPS_EVENT_<id>'
     * @returns {http response} Either 'handler removed' or 'name not valid'
     */
    remove: function (success, fail, args) {
        console.log("remove of index");

        // TODO string argument surrounded by %22, to be fixed
        var name = decodeURIComponent(args.eventName).replace(/\"/g, "");

        if (name != "") {
            _pps.unregisterEvent(name);
            callIfDefined(success, name + " : handler removed");
        } else {
            callIfDefined(fail, name + ": name not valid");
        }
    }
}

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
}

function activate(success, fail, args) {
    console.log("Event activate");
    _event.on(_actionMap['nativeEvent']);
    callIfDefined(success, "event listener activated");
}

function deactivate(success, fail, args) {
    console.log("Event deactivate");
    _event.remove(_actionMap['nativeEvent']);
    callIfDefined(success, "event listener deactivated");
}