module.exports = {
    helloworld: function (success) {
        success("hello world!");
    },

    omg: function (success, fail) {
        fail("too bad");
    }
};
