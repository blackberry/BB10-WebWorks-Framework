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

_self.__defineGetter__("name", function () {    
    return performExec("blackberry.app", "name");
});

_self.__defineGetter__("author", function () {
    return performExec("blackberry.app", "author");
});

_self.__defineGetter__("version", function () {
    return performExec("blackberry.app", "version");
});

module.exports = _self;