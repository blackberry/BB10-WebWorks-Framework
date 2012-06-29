/*
 * Copyright 2010-2012 Research In Motion Limited.
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

module.exports = {
    exec: function (request, succ, fail, args, env) {
        var extPath = "ext/" + request.params.ext + "/index",
            method = request.params.method,
            extension;
        
        if (frameworkModules.indexOf(extPath + ".js") !== -1) {
            extension = require("../../" + extPath);
            if (extension[method]) {
                if (whitelist.isFeatureAllowed(request.origin, request.params.ext)) {
                    extension[method](succ, fail, args, env);
                } else {
                    console.log("Feature denied by whitelist: " + extension);
                    fail(-1, "Feature denied by whitelist", 403);
                }
            } else {
                fail(-1, "Method for " + request.params.ext + " not found", 404);
            }
        } else {
            fail(-1, "Extension not found", 404);
        }
    }
};
