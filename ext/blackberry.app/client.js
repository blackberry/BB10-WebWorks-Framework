var _self = {};

function defineReadOnlyField(field) {
    var value = window.webworks.execSync("blackberry.app", field, null);
    Object.defineProperty(_self, field, {"value": value, "writable": false});
}

defineReadOnlyField("author");

defineReadOnlyField("authorEmail");

defineReadOnlyField("authorURL");

defineReadOnlyField("copyright");

defineReadOnlyField("description");

defineReadOnlyField("id");

defineReadOnlyField("license");

defineReadOnlyField("licenseURL");

defineReadOnlyField("name");

defineReadOnlyField("version");

module.exports = _self;
