/*
 * Copyright 2011-2012 Research In Motion Limited.
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
var _event = require("../../lib/event");

module.exports = {
    invokeMediaPlayer: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (data) {
                _event.trigger("invokeMediaPlayer.doneEventId", data);
            },
            cancel = function (reason) {
                _event.trigger("invokeMediaPlayer.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeMediaPlayer.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.mediaplayerPreviewer.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeCamera: function (success, fail, args) {
        var mode = JSON.parse(decodeURIComponent(args["mode"])),
            done = function (path) {
                _event.trigger("invokeCamera.doneEventId", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeCamera.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeCamera.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.camera.open(mode, done, cancel, invokeCallback);
        success();
    },

    invokeFilePicker: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (path) {
                _event.trigger("invokeFilePicker.doneEventId", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeFilePicker.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeFilePicker.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.filePicker.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeIcsViewer: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (path) {
                _event.trigger("invokeIcsViewer.doneEventId", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeIcsViewer.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeIcsViewer.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.icsViewer.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeCalendarPicker: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (file) {
                _event.trigger("invokeCalendarPicker.doneEventId", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeCalendarPicker.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeCalendarPicker.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.calendar.picker.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeCalendarComposer: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (file) {
                _event.trigger("invokeCalendarComposer.doneEventId", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeCalendarComposer.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeCalendarComposer.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.calendar.composer.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeEmailComposer: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (file) {
                _event.trigger("invokeEmailComposer.doneEventId", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeEmailComposer.cancelEventId", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeEmailComposer.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.email.composer.open(options, done, cancel, invokeCallback);
        success();
    }
};

