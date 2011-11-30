function mixIn(source, target) {
    for (var prop in source) {
        if (Object.hasOwnProperty.call(source, prop)) {
            target[prop] = source[prop];
        }
    }
    return target;
}

function prepareFeaturePath(filepath) {
    filepath = filepath.replace(/local:\/\//, "");
    filepath = filepath.replace(/http:\/\/localhost\//, "");
    return filepath.replace(/\.js$/, "");
}

function buildNamespace(currentNamespace, namespaceParts, featureProperties) {
    var featureId, nextPart;

    if (namespaceParts.length === 1) {
        //base case, feature properties go here
        featureId = namespaceParts[0];
        if (currentNamespace[featureId] === undefined) {
            currentNamespace[featureId] = {};
        }

        currentNamespace = mixIn(featureProperties, currentNamespace[featureId]);
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
        i;
        
    for (i = 0; i < featureIdList.length; i++) {
        featureId = featureIdList[i];

        // featureID is the name of the folder in the ext directory
        if (require.main.require === undefined) {
            window.require.load({
                id: featureId,
                url: "http://localhost/ext/" + featureId + "/client.js"
            }); // sync
        }
        featureProperties = require(featureId);
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