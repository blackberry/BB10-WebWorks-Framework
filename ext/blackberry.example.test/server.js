module.exports = {
    helloworld: function (success) {
        success("hello world!");
    },

    fail: function (success, fail) {
        fail("too bad");
    }
};
