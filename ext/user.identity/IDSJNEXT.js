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


var ids,
    _event = require("../../lib/event");

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.IDS = function ()
{
    var self = this;

    self.idsGetVersion = function (trigger) {
        return JNEXT.invoke(self.m_id, "getVersion");
    };

	self.idsRegisterProvider = function (args) {
		return JNEXT.invoke(self.m_id, "registerProvider " + args);
	};

	self.idsSetOption = function (args) {
        var setOptionsOpts = { "option" : JSON.parse(decodeURIComponent(args.option)),
                            "value" : JSON.parse(decodeURIComponent(args.value)) };
		
	
		if (typeof(setOptionsOpts.option) === "string") {
			setOptionsOpts.option = parseInt(setOptionsOpts.option, 10);
		}


		if (typeof(setOptionsOpts.value) === "object") {
			setOptionsOpts.value = "";
		}

		return JNEXT.invoke(self.m_id, "setOption " + JSON.stringify(setOptionsOpts));
	};

	self.idsGetToken = function (args) {
		var getTokenArgs = { "_eventId" : JSON.parse(decodeURIComponent(args._eventId)),
							"provider" : JSON.parse(decodeURIComponent(args.provider)),
							"tokenType" : JSON.parse(decodeURIComponent(args.tokenType)),
							"appliesTo" : JSON.parse(decodeURIComponent(args.appliesTo)) };

		return JNEXT.invoke(self.m_id, "getToken " + JSON.stringify(getTokenArgs));
	};

	self.idsClearToken = function (args) {
        var clearTokenArgs = { "_eventId" : JSON.parse(decodeURIComponent(args._eventId)),
							"provider" : JSON.parse(decodeURIComponent(args.provider)),
							"tokenType" : JSON.parse(decodeURIComponent(args.tokenType)),
							"appliesTo" : JSON.parse(decodeURIComponent(args.appliesTo)) };

		return JNEXT.invoke(self.m_id, "clearToken " + JSON.stringify(clearTokenArgs));
	};

	self.idsGetProperties = function (args) {
        var getPropertiesArgs = { "_eventId" : JSON.parse(decodeURIComponent(args._eventId)),
								"provider" : JSON.parse(decodeURIComponent(args.provider)),
								"numProps" : 0,
								"userProperties" : JSON.parse(decodeURIComponent(args.userProperties)) },
			properties = getPropertiesArgs.userProperties;

		properties = properties.split(",");
		getPropertiesArgs.numProps = properties.length;
		
		return JNEXT.invoke(self.m_id, "getProperties " + JSON.stringify(getPropertiesArgs));
	};

    self.getId = function () {
        return self.m_id;
    };

	self.onEvent = function (strData) {
		var arData = strData.split(" "),
			strEventDesc = arData[0],
			strEventData = arData[1];

		strEventDesc = strEventDesc.replace(/["']{1}/gi, "");

		_event.trigger(strEventDesc, strEventData);
	};
	
	self.init = function () {
        if (!JNEXT.require("idsext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("idsext.IDSEXT");

        if (self.m_id === "") {
			return false;
        }

        JNEXT.registerEvents(self);
    };
	
    self.m_id = "";

    self.init();
};

ids = new JNEXT.IDS();

module.exports = {
	ids: ids
};