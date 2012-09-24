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
    _appEvents = require("./../../lib/events/applicationEvents"),
    _actionMap = {
        swipedown: {
            context: _appEvents,
            event: "swipedown",
            trigger: function () {
                _event.trigger("swipedown");
            }
        },
        pause: {
            context: _appEvents,
            event: "inactive",
            trigger: function () {
                _event.trigger("pause");
            }
        },
        resume: {
            context: _appEvents,
            event: "active",
            trigger: function () {
                _event.trigger("resume");
            }
        },
        keyboardOpening: {
            context: _appEvents,
            event: "keyboardOpening",
            trigger: function () {
                _event.trigger("keyboardOpening");
            }
        },
        keyboardOpened: {
            context: _appEvents,
            event: "keyboardOpened",
            trigger: function () {
                _event.trigger("keyboardOpened");
            }
        },
        keyboardClosing: {
            context: _appEvents,
            event: "keyboardClosing",
            trigger: function () {
                _event.trigger("keyboardClosing");
            }
        },
        keyboardClosed: {
            context: _appEvents,
            event: "keyboardClosed",
            trigger: function () {
                _event.trigger("keyboardClosed");
            }
        },
        keyboardPosition: {
            context: _appEvents,
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

    getReadOnlyFields : function (success, fail, args, env) {
        var ro = {
            author: _config.author,
            authorEmail: _config.authorEmail,
            authorURL: _config.authorURL,
            copyright: _config.copyright,
            description: _config.description,
            id: _config.id,
            license: _config.license,
            licenseURL: _config.licenseURL,
            name: _config.name,
            version: _config.version
        };
        success(ro);
    },

    exit: function () {
        window.qnx.webplatform.getApplication().exit();
    }
};
