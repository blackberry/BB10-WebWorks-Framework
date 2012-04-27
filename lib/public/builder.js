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

function prepareFeaturePath(filepath) {
    filepath = filepath.replace(/local:\/\//, "").replace(/\.js$/, "");
    return "../../" + filepath;
}

function requireLocal(id) {
    return !!require.resolve ? require(id) : window.require(id);
}

function buildNamespace(currentNamespace, namespaceParts, featureProperties) {
    var featureId,
        nextPart,
        utils = requireLocal(prepareFeaturePath("local://lib/utils"));

    if (namespaceParts.length === 1) {
        //base case, feature properties go here
        featureId = namespaceParts[0];
        if (currentNamespace[featureId] === undefined) {
            currentNamespace[featureId] = {};
        }

        currentNamespace = utils.mixin(featureProperties, currentNamespace[featureId]);
        return currentNamespace;
    }
    else {
        nextPart = namespaceParts.shift();
        if (currentNamespace[nextPart] === undefined) {
            currentNamespace[nextPart] = {};
        }

        return buildNamespace(currentNamespace[nextPart], namespaceParts, featureProperties);
    }
}

function include(parent, featureIdList) {
    var featureId,
        featureProperties,
        localUrl,
        i;

    for (i = 0; i < featureIdList.length; i++) {
        featureId = featureIdList[i];

        localUrl = "local://ext/" + featureId + "/client";
        featureProperties = requireLocal(prepareFeaturePath(localUrl));

        buildNamespace(parent, featureId.split("."), featureProperties);
    }
}

var _self = {
    build: function (featureIdList) {
        return {
            into: function (target) {
                include(target, featureIdList);
            }
        };
    }
};

module.exports = _self;