var _self = {};

function performExec(featureId, property) {
    var result;
    webworks.exec(function (data, response) {
        result = data;
    }, function (data, response) {
        result = data;
    }, featureId, property, null, true);
    return result;
}

_self.__defineGetter__("model", function () {    
    return performExec("blackberry.system", "model");
});

module.exports = _self;