var _registeredEvents = {};

module.exports = {

	/** processEvent
	 * This method is triggered on the 'textInput' event.
	 * The args.data is a string in the following format:
	 * '<pps object id> <event description> <data>'
	 * where the event description is either 'Error' or 'OnChange',
	 * and data is a stringified JSON object.
	 * 
	 * @param args {object} This object contains the data from the event.
	 */
	processEvent: function (args) {
		// TODO should the eventStr also be unique for each webview?
		var arParams = args.data.split(' ');
		
		var id = arParams[0],
		desc = arParams[1],
		evtStr = 'QNX_PPS_EVENT_' + id,
		
		// The data may contain any character. Use substring instead of split. 
		jsonData = args.data.substring( id.length + desc.length + 2 );
		console.log('jsonData ' + jsonData);

		switch (desc) {
			case 'Error':
			{
				console.log('Error in PPS event');
				break;
			}
			case 'OnChange':
			{
				if (jsonData != 'null') {
					var data = JSON.parse(jsonData);

					if (_registeredEvents[evtStr]) {
						
						/* There are 3 parts to the JSON data object. 
						 * 1. 'change' : <boolean>
						 * 2. <keys changed> : <boolean>
						 * 3. data: <json pps object data>
						 */ 
						_registeredEvents[evtStr](evtStr, data);
					} else {
						console.log('no event registered');
					}
				}
			}
		}
	},
	
	/** registerEvent
	 * Adds the name (QNX_PPS_EVENT_<id>) and trigger (_webworks.executeJavascript( name, stringified_data_from_event))
	 *
	 * @param name {string}
	 * @param trigger {function}
	 */
	registerEvent: function (name, trigger) {
		if (!_registeredEvents.hasOwnProperty(name)) {
			_registeredEvents[name] = trigger; // start listening
		}
	},

	/** unregisterEvent
	 * Remove the object from the registeredEvents object
	 *
	 * @param name {name}
	 */
	unregisterEvent: function (name) {
		if (_registeredEvents.hasOwnProperty(name)) {
			delete _registeredEvents[name]; // stop listening
		}
	}

};

