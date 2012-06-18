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

module.exports = {
    get: function (request, succ, fail) {
        var frameworkInfo = require("../webworks-info"),
            frameworkHash = frameworkInfo.hash,
            frameworkVersion = frameworkInfo.version,
            webworksJsHash,
            webworksJsVersion,
            featureIds,
            requestParams,
            errorMsg;
        
        //Extract webworksVersion from client webworks.js
        if (request.params["ext"] && request.params["ext"].indexOf("hash") !== -1) {
            requestParams = request.params["ext"].split("&");
            webworksJsHash = requestParams[0].split("=")[1];//extract value for hash
            webworksJsVersion = requestParams[1].split("=")[1];//extract value for version
        }
    
        //verify running webworks.js hash matches frameworks hash
        if (webworksJsHash && frameworkHash && webworksJsHash !== frameworkHash) {
            errorMsg = "The webworks.js javascript library (" + webworksJsVersion + ") being used is incompatible with the WebWorks runtime. " + 
                    "Please replace your webworks.js file with Framework/clientFiles/webworks-" + frameworkVersion + ".js";
            
            fail(-1, errorMsg, 412);
        } else {
            featureIds = whitelist.getFeaturesForUrl(request.origin);
            succ(featureIds);
        }
    },

    load: function (request, succ, fail, args, env) {
        var extension = request.params.ext,
            xhr;

        if (whitelist.isFeatureAllowed(request.origin, extension)) {
            try {
                xhr = new XMLHttpRequest();
                xhr.open("GET", "ext/" + extension + "/client.js", false);
                xhr.send();
                // send client JS content as plain text, not wrapped as a JSON object
                env.response.send(200, xhr.responseText);
            } catch (e) {
                console.log(e);
                fail(-1, "Failed to load extension client", 404);
            }
        } else {
            console.log("Feature denied by whitelist: " + extension);
            fail(-1, "Feature denied by whitelist", 403);
        }
    }
};
