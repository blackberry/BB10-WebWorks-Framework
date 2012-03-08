var _jnext = require("lib/jnext"),
		_pps = require("./pps"),
		_event = require("lib/event"),
		_actionMap = {
			nativeEvent: {
				context: document.getElementById('textarea'),
				event: "textInput",
				trigger: function (args) {
					_pps.processEvent(args);
				},
				webviewTrigger: function(name, args) {
					_event.trigger(name,args);
				}
			},
		};

function callIfDefined(func, args) {
	if (func) {
		func(args);
	}
}

module.exports = {

	/**
	 * Creates and opens the pps object. Returns the ID.
	 * @param success 
	 * @param fail 
	 * @param args 
	 */
	open: function (success, fail, args) {
		var invokeArgs = {},
			 rsp;
		
		if (_jnext.require('pps')) {
			// open requires the string -> "id cmd path mode"
			invokeArgs.id = _jnext.createObject('pps.PPS')
			invokeArgs.cmd = 'Open';
			invokeArgs.params = decodeURIComponent(args.path);
			invokeArgs.params += " " + args.mode;
			
			rsp = _jnext.invoke(invokeArgs);
			console.log('open: ' + rsp.split(" ") + ' str: ' + rsp);
			
			if(rsp.split(" ")[0] != 'Ok') {
				fail (rsp.split(":")[1]);
			} else {
				success(rsp.split(" ")[1]);
			}
		} else {
			fail('error loading pps module');
		}
	},

	/**
	 * Reads the pps object and returns either the entire object or the key/value pair (TODO)
	 * @param success 
	 * @param fail 
	 * @param args 
	 */
	read: function (success, fail, args) {
		var invokeArgs = {},
				rsp,
				rc;
		
		// read requires the string -> "id cmd"
		invokeArgs.id = args.id;
		invokeArgs.cmd = 'Read';
		
		rsp = _jnext.invoke(invokeArgs);
		rc = rsp.split(' ')[0];
		console.log('read: ' + rsp);
		
		if (rc != 'Ok') {
			fail('error reading pps object');
		} else {
			success(JSON.parse(rsp.substring( rc.length + 1 )));
		}
	},
	
	/**
	 * Writes to the pps object 
	 * @param success 
	 * @param fail 
	 * @param args 
	 */
	write: function (success, fail, args) {
		var invokeArgs = {},
			 rsp;

		// write requres "id cmd objStr"
		invokeArgs.id = args.id;
		invokeArgs.cmd = 'Write';
		invokeArgs.params = decodeURIComponent(args.obj);
		console.log('write params: ' + invokeArgs.params);

		rsp = _jnext.invoke(invokeArgs);
		console.log('write: ' + rsp);

		if (rsp.split(" ")[0] != 'Ok') {
			fail('error writing to pps object');
		} else {
			success(rsp);
		}
		
	},

	/*
	 * Closes the pps object
	 * TODO: unregister the handler!
	 *
	 * @param success 
	 * @param fail 
	 * @param args 
	 */
	close: function (success, fail, args) {
		var invokeArgs = {},
			 rsp;
		
		// close requires "id cmd"	
		invokeArgs.id = args.id;
		invokeArgs.cmd = 'Close';
		rsp = _jnext.invoke(invokeArgs);
		
		// dispose requires "id cmd"
		invokeArgs.cmd = 'Dispose';
		rsp = _jnext.invoke(invokeArgs);
		console.log('close: ' + rsp);

		if (rsp.split(" ")[0] != 'Ok') {
			fail('error closing pps object');
		} else {
			success(rsp);
		}
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
		// TODO string argument surrounded by %22, to be fixed
		var name = decodeURIComponent(args.eventName).replace(/\"/g, "");

		if (name != "") {
			_pps.unregisterEvent(name);
			callIfDefined(success, name + " : handler removed");
		} else {
			callIfDefined(fail, name + ": name not valid");
		}
	},

	/** activate
	 * This method calls the extension's activate method.
	 * This effectively registers a DOM event listener. 
	 */
	activate: function (success, fail, args) {
		_event.on(_actionMap['nativeEvent']);
		callIfDefined(success, "event listener activated");
	},

	/** deactivate
	 * This method calls the extension's activate method.
	 * This effectively removes a DOM event listener. 
	 */
	deactivate: function (success, fail, args) {
		_event.remove(_actionMap['nativeEvent']);
		callIfDefined(success, "event listener deactivated");
	},
	
};
