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

var TransitionConstants = require('./TransitionConstants.js'),
	Globals = require('./Globals.js'),
	CustomData = require('./CustomData.js'),
	_configData,
	_self;

_configData = {};

// Copy the default values
for (var key in Globals) {
	_configData[key] = Globals[key];
}

// Update the custom data
for (var key in CustomData) {
	_configData[key] = CustomData[key];
}

_self = _configData;

module.exports = _self;