/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var m_bFirstRequire = true,
	 m_arEvents = {};

function _isEnabled () {
	return objJSExt["sendCmd"] != undefined;
}

_self = {

	require: function (strLibrary) {
		if (_isEnabled()) {
			// Load a required JNEXT plugin
			var strCmd;
			var strVal;
			var arParams;

			if  (m_bFirstRequire) {
				strCmd = "userAgent " + navigator.userAgent;
				strVal = objJSExt.sendCmd( strCmd );
				arParams = strVal.split( " " );
				if ( arParams[ 0 ] != "Ok" ) {
					return false;
				}
				m_bFirstRequire = false;
			}

			strCmd = "Require " + strLibrary;
			strVal = objJSExt.sendCmd( strCmd );
			
			arParams = strVal.split( " " );
			if ( arParams[ 0 ] != "Ok" ) {
				return false;
			}

			return true;
		} else {
			return false;
		}
	},
	
	createObject: function (strObjName)
	{
		if (_isEnabled()) {
			var strVal;
			var arParams;
			
			// Create an instance of a native object
			var strVal = objJSExt.sendCmd( "CreateObject " + strObjName );
			arParams = strVal.split( " " );
			if ( arParams[ 0 ] != "Ok" ) {
				return "";
			}
			return arParams[ 1 ];
		} else {
			return "";
		}
	},
	
	invoke: function (args) {
		if (_isEnabled()) {

			// Invoke a method of a given instance of a native object
			var strCmd = "InvokeMethod " + args.id + " " + args.cmd;
			if ( typeof(args.params) != "undefined" ) {
				strCmd += " " + args.params;
			}
			return objJSExt.sendCmd( strCmd );
		} else {
			return "";
		}
	},
	
};

module.exports = _self;
