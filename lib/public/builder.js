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