// HACK will remove these 2 functions if can get window properly to work both in unit test and real code
// have to live with differentiating node from browser for now
module.exports = {
    "window": function () {
        return !!require.resolve ? null : window;
    }
};