/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _self = {},
    ID = require("./manifest.json").namespace,
    readOnlyValues;

_self.exit = function () {
    return window.webworks.execSync(ID, "exit");
};

function getReadOnlyFields() {
    if (!readOnlyValues) {
        readOnlyValues = window.webworks.execSync(ID, "getReadOnlyFields", null);
    }
}

function defineReadOnlyField(field) {
    var value;
    getReadOnlyFields();
    value = readOnlyValues ? readOnlyValues[field] : null;
    Object.defineProperty(_self, field, {"value": value, "writable": false});
}

function getLocalizedText(data) {
    var locale = navigator.language.toLowerCase();

    if (data[locale]) {
        return data[locale];
    } else if (data[locale.split("-")[0]]) {
        //Default to language specific locale [i.e. fr]
        return data[locale.split("-")[0]];
    } else {
        return data["default"];
    }
}

Object.defineProperty(_self, "orientation", {
    get: function () {
        var orientation;
        try {
            orientation = window.webworks.execSync(ID, "currentOrientation");
        } catch (e) {
            console.error(e);
        }
        return orientation;
    }
});

Object.defineProperty(_self, "name", {
    get: function () {
        getReadOnlyFields();
        return getLocalizedText(readOnlyValues["name"]);
    }
});

Object.defineProperty(_self, "description", {
    get: function () {
        getReadOnlyFields();
        return getLocalizedText(readOnlyValues["description"]);
    }
});

defineReadOnlyField("author");

defineReadOnlyField("authorEmail");

defineReadOnlyField("authorURL");

defineReadOnlyField("copyright");

defineReadOnlyField("id");

defineReadOnlyField("license");

defineReadOnlyField("licenseURL");

defineReadOnlyField("version");

function lockOrientation(orientation, receiveRotateEvents) {
    return window.webworks.execSync(ID, "lockOrientation", { orientation: orientation });
}

function unlockOrientation() {
    window.webworks.execSync(ID, "unlockOrientation");
}

function rotate(orientation) {
    window.webworks.execSync(ID, "rotate", {orientation: orientation});
}

// Orientation Properties
Object.defineProperty(_self, "lockOrientation", {"value": lockOrientation, "writable": false});
Object.defineProperty(_self, "unlockOrientation", {"value": unlockOrientation, "writable": false});
Object.defineProperty(_self, "rotate", {"value": rotate, "writable": false});

window.webworks.execSync(ID, "registerEvents", null);

module.exports = _self;
