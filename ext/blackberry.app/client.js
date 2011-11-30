var success = function (data, response) {
        console.log('success callback: ' + data);
    },
    error = function (data, response) {
        console.log('failure callback: ' + data);
    };

module.exports = {
    name: function () {        
        return window.webworks.exec(success, error, "blackberry.app", "name");
    },
    version: function () {
        return window.webworks.exec(success, error, "blackberry.app", "version");
    }
};
