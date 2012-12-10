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
var _event = require("../../lib/event"),
    overlayWebView;

qnx.webplatform.getController().addEventListener('overlayWebView.initialized', function (webviewObj) {
    overlayWebView = webviewObj;
});

module.exports = {
    invokeMediaPlayer: function (success, fail, args) {
        var options = JSON.parse(decodeURIComponent(args["options"])),
            done = function (data) {
                _event.trigger("invokeMediaPlayer.eventId", "done", data);
            },
            cancel = function (reason) {
                _event.trigger("invokeMediaPlayer.eventId", "cancel", reason);
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
                _event.trigger("invokeCamera.eventId", "done", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeCamera.eventId", "cancel", reason);
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
                _event.trigger("invokeFilePicker.eventId", "done", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeFilePicker.eventId", "cancel", reason);
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
                _event.trigger("invokeIcsViewer.eventId", "done", path);
            },
            cancel = function (reason) {
                _event.trigger("invokeIcsViewer.eventId", "cancel", reason);
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
                _event.trigger("invokeCalendarPicker.eventId", "done", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeCalendarPicker.eventId", "cancel", reason);
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
                _event.trigger("invokeCalendarComposer.eventId", "done", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeCalendarComposer.eventId", "cancel", reason);
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
                _event.trigger("invokeEmailComposer.eventId", "done", file);
            },
            cancel = function (reason) {
                _event.trigger("invokeEmailComposer.eventId", "cancel", reason);
            },
            invokeCallback = function (error) {
                _event.trigger("invokeEmailComposer.invokeEventId", error);
            };

        window.qnx.webplatform.getApplication().cards.email.composer.open(options, done, cancel, invokeCallback);
        success();
    },

    invokeTargetPicker: function (success, fail, args) {
        var title = JSON.parse(decodeURIComponent(args.title)),
            request = JSON.parse(decodeURIComponent(args.request)),
            invocation = qnx.webplatform.getApplication().invocation,
            onError,
            onSuccess;

        onError = function (error) {
            _event.trigger("invokeTargetPicker.eventId", "error", error);
        };

        onSuccess = function (result) {
            _event.trigger("invokeTargetPicker.eventId", "success", result);
        };

        // Pulled from the query code, we should probably keep a consistent API
        // allows the developers to define APPLICATION, VIEWER etc in an array
        if (request["target_type"] && Array.isArray(request["target_type"])) {

            request["target_type"] = request["target_type"].filter(function (element) {
                var result = false;
                switch (element)
                {
                case "APPLICATION":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_APPLICATION;
                    break;
                case "CARD":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_CARD;
                    break;
                case "VIEWER":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_VIEWER;
                    break;
                case "SERVICE":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_SERVICE;
                    break;

                default:
                    result = true;
                    break;
                }
                return result;
            });

            delete request["target_type"];
        }

        if (request.hasOwnProperty('metadata')) {
            //Let's stringify it for them
            request.metadata = JSON.stringify(request.metadata);
        }

        overlayWebView.invocationlist.show(request, title, onSuccess, onError);
        success();
    }
};

