var _self = {}, 
    _ID = "blackberry.event",
    _libDir = __dirname + "./../../lib/",
    windowObj = require(_libDir + "public/window").window();

module.exports = {
    helloworld: function () {
        var success = function (data, response) {
            console.log('success callback: ' + data);
        },
        error = function (data, response) {
        };
        windowObj.webworks.exec(success, error, "blackberry.example.test", "helloworld");
    }
};
