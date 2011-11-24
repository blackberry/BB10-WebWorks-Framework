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

function _populateExtensionsObject(libraries, featureIds) {
    var newExtensionsObject = {
        id : "blackberry"
    };

    featureIds.forEach(function (featureId) {
        var ns = featureId.split("."),
            originalExtensionObject = libraries,
            newExtensionObject = newExtensionsObject,
            i,
            key;

        if (ns[0] === "blackberry") {
            for (i = 1; i < ns.length; i++) {
                if (i === 1) {
                    key = "objects";
                } else {
                    key = "children";
                }

                originalExtensionObject = originalExtensionObject[key][ns[i]];
                if (newExtensionObject[key] === undefined) {
                    newExtensionObject[key] = {};
                }
                if (newExtensionObject[key][ns[i]] === undefined) {
                    newExtensionObject[key][ns[i]] = {};
                }
                newExtensionObject = newExtensionObject[key][ns[i]];

                if (i === ns.length - 1) {
                    newExtensionObject["path"] = originalExtensionObject.clientPath;
                }
            }
        }
    });

    return newExtensionsObject;
}

function FeatureManager(libraries) {
    libraries = libraries || require("../config/libraries");
    this._libraries = libraries;
}

FeatureManager.prototype.getExtensionsObjectForFeatures = function (featureIds) {
    var extensionObjects = _populateExtensionsObject(this._libraries, featureIds);

    return extensionObjects;
};

exports.FeatureManager = FeatureManager;
