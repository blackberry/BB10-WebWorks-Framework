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
    _eventExt = require("./../blackberry.event/index"),
    _actionMap = {
        swipedown: {
            context: require("./navEvents"),
            event: "swipedown",
            trigger: function () {
                _event.trigger("swipedown");
            }
        },
        pause: {
            context: require("./navEvents"),
            event: "pause",
            trigger: function () {
                _event.trigger("pause");
            }
        },
        resume: {
            context: require("./navEvents"),
            event: "resume",
            trigger: function () {
                _event.trigger("resume");
            }
        }
    };

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
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
