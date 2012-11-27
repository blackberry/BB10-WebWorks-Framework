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
    _orientation,
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

function angleToOrientation(angle) {
    var orientation;

    switch (angle) {
    case 0:
        orientation = 'portrait-primary';
        break;
    case 90:
        orientation = 'landscape-secondary';
        break;
    case 180:
        orientation = 'portrait-secondary';
        break;
    case -90:
    case 270:
        orientation = 'landscape-primary';
        break;
    default:
        orientation = "unknown";
        break;
    }

    return orientation;
}

function edgeToOrientation(edge) {
    switch (edge) {
    case "left_up":
        return "landscape-primary";
    case "top_up":
        return "portrait-primary";
    case "bottom_up":
        return "portrait-secondary";
    case "right_up":
        return "landscape-secondary";
    default:
        return "unknown";
    }
}

function translateToDeviceOrientation(orientation, fail) {
    // Convert HTML5 orientation syntax into device syntax
    switch (orientation) {
    case 'portrait':
    case 'portrait-primary':
        return 'top_up';

    case 'landscape':
    case 'landscape-primary':
        return 'left_up';

    case 'portrait-secondary':
        return 'bottom_up';

    case 'landscape-secondary':
        return 'right_up';

    default:
        // Invalid orientation type
        fail(-1, "invalid orientation type");
        return;
    }
}

function rotateTrigger(width, height, angle) {
    _orientation = angleToOrientation(angle);
    _event.trigger("orientationchange", angleToOrientation(angle));
}

function rotateWhenLockedTrigger(edge) {
    _orientation = edgeToOrientation(edge);
    _event.trigger("orientationchange", edgeToOrientation(edge));
}

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);

            // Seperate these two events from the action map since we want to handle both of these
            // using the same listener
            _appEvents.addEventListener("rotate", rotateTrigger);
            _appEvents.addEventListener("rotateWhenLocked", rotateWhenLockedTrigger);

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

    lockOrientation : function (success, fail, args, env) {
        var orientation = JSON.parse(decodeURIComponent(args.orientation)),
            rotateTo = translateToDeviceOrientation(orientation);

        // Force rotate to the given orientation then lock it
        qnx.webplatform.getApplication().rotate(rotateTo);
        qnx.webplatform.getApplication().lockRotation(true);
        success(true);
    },

    unlockOrientation : function (success, fail, args, env) {
        qnx.webplatform.getApplication().unlockRotation();
        success();
    },

    rotate : function (success, fail, args, env) {
        var orientation = translateToDeviceOrientation(JSON.parse(decodeURIComponent(args.orientation)), fail);
        qnx.webplatform.getApplication().rotate(orientation);
        success();
    },

    currentOrientation : function (success, fail, args, env) {
        var orientation = _orientation || angleToOrientation(window.orientation);
        success(orientation);
    },

    minimize: function (success) {
        qnx.webplatform.getApplication().minimizeWindow();
        success();
    },

    exit: function (success) {
        window.qnx.webplatform.getApplication().exit();
        success();
    }
};
