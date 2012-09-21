/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var _self = {},
    _ID = require("./manifest.json").namespace;

_self.self = {};

_self.getVersion = function () {
	return window.webworks.execSync(_ID, "getVersion", null);
};

_self.registerProvider = function (provider) {
    var args = {
            "provider": provider || {}
        },
	obj = JSON.parse(window.webworks.execSync(_ID, "registerProvider", args));
	return obj;
};

_self.setOption = function (option, value) {
	var args = {
			"option": option,
			"value": value || {}
		},
	obj = JSON.parse(window.webworks.execSync(_ID, "setOption", args));
	return obj;
};



function createEventHandler(_eventId, callback) {
    if (!window.webworks.event.isOn(_eventId)) {
		window.webworks.event.once(_ID, _eventId, callback);
	}
}


_self.getToken = function (idsProvider, tokenType, appliesTo, successCallback, failureCallback) {
	var _eventId = "bbidGetTokenEventId",
		args = {
			"_eventId": _eventId,
			"provider": idsProvider,
			"tokenType": tokenType,
			"appliesTo": appliesTo || {}
        };

	createEventHandler(_eventId, function (args) {
		var resultJSON = JSON.parse(args);

		if (resultJSON.result) {
			failureCallback(resultJSON);
		} else {
			successCallback(resultJSON);
		}
	});


	window.webworks.execAsync(_ID, "getToken", args);
};

_self.clearToken = function (idsProvider, tokenType, appliesTo, successCallback, failureCallback) {
	var _eventId = "bbidClearTokenEventId",
		args = {
			"_eventId": _eventId,
			"provider": idsProvider,
			"tokenType": tokenType,
			"appliesTo": appliesTo || {}
        };

	createEventHandler(_eventId, function (args) {
		var resultJSON = JSON.parse(args);

		if (resultJSON.result) {
			failureCallback(resultJSON);
		} else {
			successCallback(resultJSON);
		}
	});
	
	window.webworks.execAsync(_ID, "clearToken", args);
};

_self.getProperties = function (idsProvider, userProperties, successCallback, failureCallback) {
	var _eventId = "bbidGetPropertiesEventId",
		args = {
			"_eventId": _eventId,
			"provider": idsProvider,
			"userProperties": userProperties || {}
        };

	createEventHandler(_eventId, function (args) {
		var resultJSON = JSON.parse(args);

		if (resultJSON.result) {
			failureCallback(resultJSON);
		} else {
			successCallback(resultJSON.userProperties);
		}
	});


	window.webworks.execAsync(_ID, "getProperties", args);
};

module.exports = _self;

