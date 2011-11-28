module.exports = {
    helloworld: function () {
        var result;

        webworks.exec(function (data) {
            result = data;
        }, 
        null, 
        "backberry.example.test", 
        "helloworld", 
        {
            sync: true
        });

        return result;
    },

    omg: function (success, fail) {
        webworks.exec(success, fail, "blackberry.example.test", "omg");
    }
};
