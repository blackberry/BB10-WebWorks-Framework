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

var _utils = require("./../../lib/utils"),
    _event = require("./../../lib/event"),
    _appEvents = require("./../../lib/events/applicationEvents"),
    _actionMap = {
        entercover: {
            context: _appEvents,
            event: "windowCoverEnter",
            triggerEvent: "entercover",
            trigger: function () {
                _event.trigger("entercover");
            }
        },
        exitcover: {
            context: _appEvents,
            event: "windowCoverExit",
            triggerEvent: "exitcover",
            trigger: function () {
                _event.trigger("exitcover");
            }
        }
    };

function processCover(cover) {
    if (cover.cover.type === 'file') {
        cover.cover.path = _utils.translatePath(cover.cover.path).replace(/file:\/\//, '');
    }
    return cover;
}

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            console.log(e);
            fail(-1, "Unable to register events");
        }
    },

    resetCover: function (success, fail, args, env) {
        try {
            window.qnx.webplatform.getApplication().updateCover({"cover": "reset"});
            success();
        } catch (e) {
            console.log(e);
            fail(-1, "Unable to reset cover");
        }
    },

    coverSize: function (success, fail, args, env) {
        try {
            var coverSize = window.qnx.webplatform.getApplication().coverSize,
                result = (typeof coverSize === "string") ? JSON.parse(coverSize) : coverSize;
            success(result);
        } catch (e) {
            console.log(e);
            fail(-1, "Unable to get coverSize");
        }
    },

    updateCover: function (success, fail, args, env) {
        try {
            var processedCover = processCover(JSON.parse(decodeURIComponent(args.cover)));
            window.qnx.webplatform.getApplication().updateCover(processedCover);
            success();
        } catch (e) {
            console.log(e);
            fail(-1, "Unable to update cover");
        }
    }
};
