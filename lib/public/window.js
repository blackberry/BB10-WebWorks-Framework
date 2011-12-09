// HACK will remove these 2 functions if can get window properly to work both in unit test and real code
// have to live with differentiating node from browser for now
function isEmpty(obj) {
    for (var i in obj) {
        return false;
    }

    return true;
}

function inNode() {
    return !require.main || isEmpty(require.main.exports);
}

module.exports = {
    "window": function () {
        return inNode() ? null : window;
    }
};
