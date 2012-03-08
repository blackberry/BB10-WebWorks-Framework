function requireLocal(id) {
    if (require.resolve) { // node
        return require(id);
    } else { // browser
        return window.require(id.replace(/\.\//, ""));
    }
}

var _cb,
		windowObj = requireLocal("./window"),
		performExec = requireLocal('lib/utils').performExec,
		ID = "blackberry.invoke",
		_self = {
			
			/** onEvent 
			 * This method starts the chain of calls to register the event 
			 * associated with the PPS object. First, on the client webworks side, the name
			 * will be registered with the _handlers object.  Second, also within webworks, 
			 * the name will be passed to the blackberry.invoke extension for registration.  
			 * ie. blackberry.invoke.onEvent -> webworks.event.on --http GET--> blackberry.invoke.on
			 * 
			 * This resulting webworks GET URI will return either '<name> registered' or
			 * '<name> invalid'
			 *
			 * Note: Calling this method without an object will unregister the event.
			 * TODO: Separate the unregister functionality.
			 *
			 * @param cb {function pointer} The function to call on detection of registered event
			 * @param eventId {numeric string} The id of the pps object. (returned from open)
			 */
			onEvent: function (cb, eventId) {
				var window = windowObj.window();
				console.log('onEvent: QNX_PPS_EVENT_' + eventId);
				
				if (cb) {
					window.webworks.event.on(ID, 'QNX_PPS_EVENT_' + eventId, cb);
				} else {
					window.webworks.event.remove(ID, 'QNX_PPS_EVENT_' + eventId, _cb);
				}

				_cb = cb;
			},
			
		};

/** activate
 * This method calls the extension's activate method.
 * After a few more layers, this effectively registers a DOM event listener. 
 */
_self.__defineGetter__("activate", function() {
	console.log('activate the listener');
	return performExec("blackberry.invoke", "activate");
});

/** deactivate
 * This method calls the extensions's deactivate method
 * This effectively removes the event listener.
 */
_self.__defineGetter__("deactivate", function() {
	console.log('deactivate the listener');
	return performExec("blackberry.invoke", "deactivate");
});

module.exports = _self;
