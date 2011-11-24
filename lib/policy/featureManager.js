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

function _populateExtensionObjects(libraries, featureIds) {
    var newLibrariesObject = {
        id : "blackberry"
    };

    featureIds.forEach(function (featureId) {
        var ns = featureId.split("."),
            originalLibraryObject = libraries,
            newLibraryObject = newLibrariesObject,
            i;

        if (ns[0] === "blackberry") {
            for (i = 1; i < ns.length; i++) {
                if (i === 1) {
                    originalLibraryObject = originalLibraryObject.objects[ns[i]];
                    if (newLibraryObject.objects === undefined) {
                        newLibraryObject.objects = {};
                    }
                    if (newLibraryObject.objects[ns[i]] === undefined) {
                        newLibraryObject.objects[ns[i]] = {};
                    }
                    newLibraryObject = newLibraryObject.objects[ns[i]];
                } else {
                    originalLibraryObject = originalLibraryObject.children[ns[i]];
                    if (newLibraryObject.children === undefined) {
                        newLibraryObject.children = {};
                    }
                    if (newLibraryObject.children[ns[i]] === undefined) {
                        newLibraryObject.children[ns[i]] = {};
                    }
                    newLibraryObject = newLibraryObject.children[ns[i]];
                }

                if (i === ns.length - 1) {
                    newLibraryObject["path"] = originalLibraryObject.clientPath;
                }
            }
        }
    });

    return newLibrariesObject;
}

function FeatureManager(libraries) {
    libraries = libraries || require("../config/libraries");
    this._libraries = libraries;
}

FeatureManager.prototype.getExtensionsObjectForFeatures = function (featureIds) {
    var extensionObjects = _populateExtensionObjects(this._libraries, featureIds);

    return extensionObjects;
};

exports.FeatureManager = FeatureManager;
