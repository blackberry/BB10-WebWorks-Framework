var success = function (data, response) {
        console.log('success callback: ' + data);
    },
    error = function (data, response) {
        console.log('failure callback: ' + data);
    };

module.exports = {
    name: function () {        
        webworks.exec(success, error, "blackberry.app", "name");
    },
    version: function () {
        webworks.exec(success, error, "blackberry.app", "version");
    }
};
