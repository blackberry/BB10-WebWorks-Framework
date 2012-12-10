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

var _self = {},
    _ID = require("./manifest.json").namespace,
    _cameraEventId = "invokeCamera.eventId",
    _cameraInvokeEventId = "invokeCamera.invokeEventId",
    _filePickerEventId = "invokeFilePicker.eventId",
    _filePickerInvokeEventId = "invokeFilePicker.invokeEventId",
    _icsEventId = "invokeIcsViewer.eventId",
    _icsInvokeEventId = "invokeIcsViewer.invokeEventId",
    _calendarPickerEventId = "invokeCalendarPicker.eventId",
    _calendarPickerInvokeEventId = "invokeCalendarPicker.invokeEventId",
    _calendarComposerEventId = "invokeCalendarComposer.eventId",
    _calendarComposerInvokeEventId = "invokeCalendarComposer.invokeEventId",
    _targetPickerEventId = "invokeTargetPicker.eventId",
    _emailComposerEventId = "invokeEmailComposer.eventId",
    _emailComposerInvokeEventId = "invokeEmailComposer.invokeEventId";

function doneCancelCallback(done, cancel) {
    return function (reason, data) {
        if (reason === "done") {
            if (done && typeof(done) === "function") {
                done(data);
            }
        } else if (reason === "cancel") {
            if (cancel && typeof(cancel) === "function") {
                cancel(data);
            }
        }
    };
}

_self.invokeMediaPlayer = function (options, done, cancel, invokeCallback) {
    var eventId = "invokeMediaPlayer.eventId",
        invokeEventId = "invokeMediaPlayer.invokeEventId",
        callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, eventId, callback);
            }
            invokeCallback();
        }; 

    if (!window.webworks.event.isOn(eventId)) {
        window.webworks.event.once(_ID, eventId, callback);
    }

    if (!window.webworks.event.isOn(invokeEventId)) {
        window.webworks.event.once(_ID, invokeEventId, invoked);
    }

    return window.webworks.execAsync(_ID, "invokeMediaPlayer", {options: options || {}});
};

_self.invokeCamera = function (mode, done, cancel, invokeCallback) {
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _cameraEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_cameraEventId)) {
        window.webworks.event.once(_ID, _cameraEventId, callback);
    }
    if (!window.webworks.event.isOn(_cameraInvokeEventId)) {
        window.webworks.event.once(_ID, _cameraInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeCamera", {mode: mode || ""});
};

_self.invokeFilePicker = function (options, done, cancel, invokeCallback) {
   /*
   * options = {
   *    mode: Picker or Saver or PickerMultiple or SaverMultiple, //one of them
   *    type:["Picture","Document","Music","Video","Other"], // , separated types but we pass array
   *    defaultType: "Picture"|"Document"|"Music"|"Video"|"Other"
   *    title: "some string",
   *    defaultSaveFileNames: ["fileName1","fileName2"], // , separated but we pass array
   *    directory:["/path/folder1","/path/folder2"], //, separated but we pass array
   *    filter:[".jpg",".bmp"], // , separated but we pass array
   *    viewMode:ListView or GridView or Default, // one of them
   *    sortBy:Default or Name or Date or Suffix or Size, //one of them
   *    sortOrder:Default or Ascending or Descending // one of them
   *    imageCrop: true|false,
   *    allowOverwrite: true|false
   * }
   */
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _filePickerEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_filePickerEventId)) {
        window.webworks.event.once(_ID, _filePickerEventId, callback);
    }
    if (!window.webworks.event.isOn(_filePickerInvokeEventId)) {
        window.webworks.event.once(_ID, _filePickerInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeFilePicker", {options: options || ""});
};

_self.invokeIcsViewer = function (options, done, cancel, invokeCallback) {
    /*
    * options = {
    *     uri: path to the ICS file on device
    *     accountId: id of the calendar account to open the file in (optional)
    * }
    */
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _icsEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_icsEventId)) {
        window.webworks.event.once(_ID, _icsEventId, callback);
    }
    if (!window.webworks.event.isOn(_icsInvokeEventId)) {
        window.webworks.event.once(_ID, _icsInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeIcsViewer", {options: options || ""});
};


_self.invokeCalendarPicker = function (options, done, cancel, invokeCallback) {
   /*
   * options = {
   *    filepath: path to file where .vcs will be saved
   * }
   */
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _calendarPickerEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_calendarPickerEventId)) {
        window.webworks.event.once(_ID, _calendarPickerEventId, callback);
    }
    if (!window.webworks.event.isOn(_calendarPickerInvokeEventId)) {
        window.webworks.event.once(_ID, _calendarPickerInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeCalendarPicker", {options: options || ""});
};

_self.invokeCalendarComposer = function (options, done, cancel, invokeCallback) {
   /*
   * options = {
   *    accountId : account ID //used with syncId or folderId to identify a specific account
   *    syncId : sync ID
   *    folderId : folder ID
   *    subject : event subject
   *    body : event body
   *    startTime : event start time e.g: Wed Jun 13 09:39:56 2012
   *    duration : event duration
   *    participants : array of pariticipant email addresses
   * }
   */
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _calendarComposerEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_calendarComposerEventId)) {
        window.webworks.event.once(_ID, _calendarComposerEventId, callback);
    }
    if (!window.webworks.event.isOn(_calendarComposerInvokeEventId)) {
        window.webworks.event.once(_ID, _calendarComposerInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeCalendarComposer", {options: options || ""});
};

_self.invokeEmailComposer = function (options, done, cancel, invokeCallback) {
   /*
   * options = {
   *    from : accountId this message should be sent from
   *    subject : message subject
   *    body : plaintext message body
   *    calendarevent : calendar event ID
   *    to : array of recipient emails
   *    cc : array of emails
   *    attachment : array of attachment filepaths
   * }
   */
    var callback = doneCancelCallback(done, cancel),
        invoked = function (error) {
            if (error !== "") {
                window.webworks.event.remove(_ID, _emailComposerEventId, callback);
            }
            invokeCallback();
        }; 
    if (!window.webworks.event.isOn(_emailComposerEventId)) {
        window.webworks.event.once(_ID, _emailComposerEventId, callback);
    }
    if (!window.webworks.event.isOn(_emailComposerInvokeEventId)) {
        window.webworks.event.once(_ID, _emailComposerInvokeEventId, invoked);
    }
    return window.webworks.execAsync(_ID, "invokeEmailComposer", {options: options || ""});
};

_self.invokeTargetPicker = function (request, title, onSuccess, onError) {

    var callback = function (reason, data) {
        if (reason === "success") {
            if (onSuccess && typeof(onSuccess) === "function") {
                onSuccess(data);
            }
        } else if (reason === "error") {
            if (onError && typeof(onError) === "function") {
                onError(data);
            }
        }
    };

    if (!window.webworks.event.isOn(_targetPickerEventId)) {
        window.webworks.event.once(_ID, _targetPickerEventId, callback);
    }
    try {
        if (request.hasOwnProperty('data')) {
            request.data = window.btoa(request.data);
        }

        window.webworks.execSync(_ID, "invokeTargetPicker", {
            request: request,
            title: title,
            onSuccess: onSuccess,
            onError : onError,
        });
    } catch (e) {
        onError(e);
    }
};

//CAMERA PROPERTIES
window.webworks.defineReadOnlyField(_self, "CAMERA_MODE_PHOTO", 'photo');
window.webworks.defineReadOnlyField(_self, "CAMERA_MODE_VIDEO", 'video');
window.webworks.defineReadOnlyField(_self, "CAMERA_MODE_FULL", 'full');

//FILE PICKER PROPERTIES
window.webworks.defineReadOnlyField(_self, "FILEPICKER_MODE_PICKER", 'Picker');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_MODE_SAVER", 'Saver');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_MODE_PICKER_MULTIPLE", 'PickerMultiple');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_MODE_SAVER_MULTIPLE", 'SaverMultiple');

window.webworks.defineReadOnlyField(_self, "FILEPICKER_VIEWER_MODE_LIST", 'ListView');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_VIEWER_MODE_GRID", 'GridView');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_VIEWER_MODE_DEFAULT", 'Default');

window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_BY_NAME", 'Name');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_BY_DATE", 'Date');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_BY_SUFFIX", 'Suffix');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_BY_SIZE", 'Size');

window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_ORDER_ASCENDING", 'Ascending');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_SORT_ORDER_DESCENDING", 'Descending');

window.webworks.defineReadOnlyField(_self, "FILEPICKER_TYPE_PICTURE", 'picture');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_TYPE_DOCUMENT", 'document');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_TYPE_MUSIC", 'music');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_TYPE_VIDEO", 'video');
window.webworks.defineReadOnlyField(_self, "FILEPICKER_TYPE_OTHER", 'other');

module.exports = _self;
