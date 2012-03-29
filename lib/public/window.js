// HACK have to live with differentiating node from browser for now
module.exports = {
    "window": function () {
        return !!require.resolve ? null : window;
    }
};