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

var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist();

function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}	
	
module.exports = {
    exec: function (request, succ, fail, args, env) {
        var extension = request.params.ext,
            method = request.params.method;

        if (whitelist.isFeatureAllowed(request.origin, extension)) {
            try {
                requireLocal('ext/' + extension + '/index')[method](succ, fail, args, env); // need to use require id, ../.. causes problems
            } catch (e) {
                console.log(e);
                fail(-1, "Feature not found", 404);
            }
        } else {
            console.log("Feature denied by whitelist: " + extension);
            fail(-1, "Feature denied by whitelist", 403);
        }
    }
};
