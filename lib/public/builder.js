function prepareFeaturePath(filepath) {
    filepath = filepath.replace(/local:\/\//, "").replace(/\.js$/, "");
    return "../../" + filepath;
}

function requireLocalResource(localUrl) {
    if (require.resolve !== undefined) { // in node
        return require(prepareFeaturePath(localUrl));
    }

    return window.require(localUrl);
}

function buildNamespace(currentNamespace, namespaceParts, featureProperties) {
    var featureId,
        nextPart,
        utils = requireLocalResource("local://lib/utils");

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
        featureProperties = requireLocalResource(localUrl);

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