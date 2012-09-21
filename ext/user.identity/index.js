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

var ids = require("./IDSJNEXT").ids;

module.exports = {
    getVersion: function (success, fail, args, env) {
        success(ids.idsGetVersion());
    },

    registerProvider: function (success, fail, args, env) {
		var key;
        for (key in args) {
			if (key === "provider") {
				success(ids.idsRegisterProvider(JSON.parse(decodeURIComponent(args[key]))));
			}
        }
    },
    
    setOption: function (success, fail, args, env) {
		success(ids.idsSetOption(args));
    },
    
	getToken: function (success, fail, args, env) {
		success(ids.idsGetToken(args));
	},
	clearToken: function (success, fail, args, env) {
		success(ids.idsClearToken(args));
	},
	getProperties: function (success, fail, args, env) {
		success(ids.idsGetProperties(args));
	}
};

