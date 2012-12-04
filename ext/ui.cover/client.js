/*
 * Copyright 2012 Research In Motion Limited.
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

var _ID = require("./manifest.json").namespace,
    _self = {},
    badges = true,
    cover = {
        cover: {
            type: 'snapshot',
            capture: {}
        },
    },
    textLabels = [];

_self.setContent = function (type, options) {
    switch (type) {
    case _self.TYPE_IMAGE:
        if (cover.cover.capture) {
            delete cover.cover.capture;
        }
        cover.cover.type = type;
        cover.cover.path = options.path;
        break;
    case _self.TYPE_SNAPSHOT:
        if (cover.cover.path) {
            delete cover.cover.path;
        }
        cover.cover.type = type;
        cover.cover.capture = options;
        break;
    default:
        break;
    }
};

_self.setTransition = function (transition) {
    cover["transition"] = transition;
};

_self.resetCover = function () {
    delete cover["text"];
    delete cover["transition"];
    delete cover["badges"];
    _self.labels = [];
    _self.showBadges = true;
    window.webworks.execSync(_ID, "resetCover");
};

_self.updateCover = function () {
    cover["text"] = _self.labels;
    cover["badges"] = _self.showBadges;
    window.webworks.execSync(_ID, "updateCover", {"cover": cover});
};

Object.defineProperty(_self, "coverSize", {
    get: function () {
        return window.webworks.execSync(_ID, "coverSize");
    }
});

Object.defineProperty(_self, "labels", {
    get: function () {
        return textLabels;
    },
    set: function (newLabels) {
        textLabels = newLabels;
    }
});

Object.defineProperty(_self, "showBadges", {
    get: function () {
        return badges;
    },
    set: function (value) {
        badges = value;
    }
});

Object.defineProperty(_self, "TYPE_IMAGE", {"value": "file", "writable": false});
Object.defineProperty(_self, "TYPE_SNAPSHOT", {"value": "snapshot", "writable": false});
Object.defineProperty(_self, "TRANSITION_FADE", {"value": "fade", "writable": false});
Object.defineProperty(_self, "TRANSITION_NONE", {"value": "none", "writable": false});
Object.defineProperty(_self, "TRANSITION_DEFAULT", {"value": "default", "writable": false});
Object.defineProperty(_self, "TRANSITION_SLIDE", {"value": "slide", "writable": false});

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;
