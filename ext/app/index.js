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
var _config = require("./../../lib/config"),
    _event = require("./../../lib/event"),
    _utils = require("./../../lib/utils"),
    _actionMap = {
        swipedown: {
            context: require("./appEvents"),
            event: "swipedown",
            trigger: function () {
                _event.trigger("swipedown");
            }
        },
        pause: {
            context: require("./appEvents"),
            event: "pause",
            trigger: function () {
                _event.trigger("pause");
            }
        },
        resume: {
            context: require("./appEvents"),
            event: "resume",
            trigger: function () {
                _event.trigger("resume");
            }
        },
        keyboardOpening: {
            context: require("./appEvents"),
            event: "keyboardOpening",
            trigger: function () {
                _event.trigger("keyboardOpening");
            }
        },
        keyboardOpened: {
            context: require("./appEvents"),
            event: "keyboardOpened",
            trigger: function () {
                _event.trigger("keyboardOpened");
            }
        },
        keyboardClosing: {
            context: require("./appEvents"),
            event: "keyboardClosing",
            trigger: function () {
                _event.trigger("keyboardClosing");
            }
        },
        keyboardClosed: {
            context: require("./appEvents"),
            event: "keyboardClosed",
            trigger: function () {
                _event.trigger("keyboardClosed");
            }
        },
        keyboardPosition: {
            context: require("./appEvents"),
            event: "keyboardPosition",
            trigger: function (yPosition) {
                var _yPosition = JSON.parse(yPosition);
                _event.trigger("keyboardPosition", _yPosition);
            }
        }
    };

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    author: function (success, fail, args, env) {
        success(_config.author);
    },

    authorEmail: function (success, fail, args, env) {
        success(_config.authorEmail);
    },

    authorURL: function (success, fail, args, env) {
        success(_config.authorURL);
    },

    copyright: function (success, fail, args, env) {
        success(_config.copyright);
    },

    description: function (success, fail, args, env) {
        success(_config.description);
    },

    id: function (success, fail, args, env) {
        success(_config.id);
    },

    license: function (success, fail, args, env) {
        success(_config.license);
    },

    licenseURL: function (success, fail, args, env) {
        success(_config.licenseURL);
    },

    name: function (success, fail, args, env) {
        success(_config.name);
    },

    version: function (success, fail, args, env) {
        success(_config.version);
    },

    exit: function () {
        window.qnx.webplatform.getApplication().exit();
    }
};
