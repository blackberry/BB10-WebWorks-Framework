/*
 * Copyright 2011 Research In Motion Limited.
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

var Whitelist = require("./policy/whitelist").Whitelist,
    FeatureManager = require("./policy/featureManager").FeatureManager,
    utils = require("./utils");

function _getOrigin(request) {
    // Hardcode it for now until we figured out how to pass origin information through onRequest
    return "local:///index.html";
}

var _self = {
    onListFeatures: function (request) {
        request.substitute();

        var featureIds = new Whitelist().getFeaturesForUrl(_getOrigin(request)),
            extensionObjects = new FeatureManager().getExtensionsObjectForFeatures(featureIds);

        request.respond(200, JSON.stringify(extensionObjects));
    },

    onExecFeature: function (request) {
        request.substitute();

        var path = utils.parseUri(request.url).path,
            matcher = /^\/blackberry\/exec\/(.*)\/.*/.exec(path),
            featureId = matcher[1],
            action = utils.parseUri(request.url).file,
            feature,
            success = function (result) {
                request.respond(200, JSON.stringify({
                    code: 1,
                    data: result
                }));
            },
            error = function (err) {
                request.respond(200, JSON.stringify({
                    code: 1,
                    data: null,
                    msg: err
                }));
            };

        if (new Whitelist().isFeatureAllowed(_getOrigin(request), featureId)) {
            feature = require(new FeatureManager().getServerPathForFeature(featureId));
            feature[action](success, error);
        } else {
            console.log("Feature denied by whitelist: " + featureId);
            request.respond(403, "Forbidden");
        }
    }
};

module.exports = _self;