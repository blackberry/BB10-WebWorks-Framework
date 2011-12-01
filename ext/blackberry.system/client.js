var success = function (data, response) {
        console.log('success callback: ' + data);
    },
    error = function (data, response) {
        console.log('failure callback: ' + data);
    };

module.exports = {
    model: function () {        
        webworks.exec(success, error, "blackberry.system", "model");
    }
};
