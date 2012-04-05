var _self = {};

function getFieldValue(field) {
    var value = null;

    try {
        value = window.webworks.execSync("blackberry.identity", field, null);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function defineReadOnlyField(field) {
    Object.defineProperty(_self, field, {
        "value": getFieldValue(field),
        "writable": false
    });
}

defineReadOnlyField("uuid");

module.exports = _self;