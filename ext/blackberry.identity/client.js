var _self = {};

Object.defineProperty(_self, "uuid", {
    "value": window.webworks.execSync("blackberry.identity", "uuid", null),
    "writable": false
});

module.exports = _self;