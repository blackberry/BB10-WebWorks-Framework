module.exports = {
    helloworld: function () {
        var success = function (data, response) {
            console.log('success callback: ' + data);
        },
        error = function (data, response) {
        };
        return window.webworks.exec(success, error, "blackberry.example.test", "helloworld");
    }
};
