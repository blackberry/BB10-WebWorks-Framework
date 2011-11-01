module.exports = {
    win: function (success, fail, args) {
        success({a: 1, b: 2, c: 3});
    },
    loose: function (success, fail, args) {
        fail("boourns!");
    }
};
