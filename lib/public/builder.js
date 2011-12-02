function prepareFeaturePath(filepath) {
    filepath = filepath.replace(/local:\/\//, "");
    return filepath.replace(/\.js$/, "");
}

function requireLocalResource(localUrl, id) {
    var requireId = id || prepareFeaturePath(localUrl);
        
    if (require.main.require === undefined) { // in browser
        window.require.load({
            id: requireId, 
            url: localUrl
        });
    } 
    else { //in node
        requireId = "../../" + requireId;
    }
    
    return require(requireId);    
}

function buildNamespace(currentNamespace, namespaceParts, featureProperties) {
    var featureId, 
        nextPart,
        utils = requireLocalResource("local://lib/utils.js");

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
        
        localUrl = "local://ext/" + featureId + "/client.js";        
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