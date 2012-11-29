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
    _cameraDoneEventId = "invokeCamera.doneEventId",
    _cameraCancelEventId = "invokeCamera.cancelEventId",
    _cameraInvokeEventId = "invokeCamera.invokeEventId",
    _filePickerDoneEventId = "invokeFilePicker.doneEventId",
    _filePickerCancelEventId = "invokeFilePicker.cancelEventId",
    _filePickerInvokeEventId = "invokeFilePicker.invokeEventId",
    _icsDoneEventId = "invokeIcsViewer.doneEventId",
    _icsCancelEventId = "invokeIcsViewer.cancelEventId",
    _icsInvokeEventId = "invokeIcsViewer.invokeEventId",
    _calendarPickerDoneEventId = "invokeCalendarPicker.doneEventId",
    _calendarPickerCancelEventId = "invokeCalendarPicker.cancelEventId",
    _calendarPickerInvokeEventId = "invokeCalendarPicker.invokeEventId",
    _calendarComposerDoneEventId = "invokeCalendarComposer.doneEventId",
    _calendarComposerCancelEventId = "invokeCalendarComposer.cancelEventId",
    _calendarComposerInvokeEventId = "invokeCalendarComposer.invokeEventId",
    _emailComposerDoneEventId = "invokeEmailComposer.doneEventId",
    _emailComposerCancelEventId = "invokeEmailComposer.cancelEventId",
    _emailComposerInvokeEventId = "invokeEmailComposer.invokeEventId";

_self.invokeMediaPlayer = function (options, done, cancel, invokeCallback) {
    var doneEventId = "invokeMediaPlayer.doneEventId",
        cancelEventId = "invokeMediaPlayer.cancelEventId",
        invokeEventId = "invokeMediaPlayer.invokeEventId";

    if (!window.webworks.event.isOn(doneEventId)) {
        window.webworks.event.once(_ID, doneEventId, done);
    }

    if (!window.webworks.event.isOn(cancelEventId)) {
        window.webworks.event.once(_ID, cancelEventId, cancel);
    }

    if (!window.webworks.event.isOn(invokeEventId)) {
        window.webworks.event.once(_ID, invokeEventId, invokeCallback);
    }

    return window.webworks.execAsync(_ID, "invokeMediaPlayer", {options: options || {}});
};

_self.invokeCamera = function (mode, done, cancel, invokeCallback) {
    if (!window.webworks.event.isOn(_cameraDoneEventId)) {
        window.webworks.event.once(_ID, _cameraDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_cameraCancelEventId)) {
        window.webworks.event.once(_ID, _cameraCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_cameraInvokeEventId)) {
        window.webworks.event.once(_ID, _cameraInvokeEventId, invokeCallback);
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
    if (!window.webworks.event.isOn(_filePickerDoneEventId)) {
        window.webworks.event.once(_ID, _filePickerDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_filePickerCancelEventId)) {
        window.webworks.event.once(_ID, _filePickerCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_filePickerInvokeEventId)) {
        window.webworks.event.once(_ID, _filePickerInvokeEventId, invokeCallback);
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
    if (!window.webworks.event.isOn(_icsDoneEventId)) {
        window.webworks.event.once(_ID, _icsDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_icsCancelEventId)) {
        window.webworks.event.once(_ID, _icsCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_icsInvokeEventId)) {
        window.webworks.event.once(_ID, _icsInvokeEventId, invokeCallback);
    }
    return window.webworks.execAsync(_ID, "invokeIcsViewer", {options: options || ""});
};

_self.invokeCalendarPicker = function (options, done, cancel, invokeCallback) {
   /*
   * options = {
   *    filepath: path to file where .vcs will be saved
   * }
   */
    if (!window.webworks.event.isOn(_calendarPickerDoneEventId)) {
        window.webworks.event.once(_ID, _calendarPickerDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_calendarPickerCancelEventId)) {
        window.webworks.event.once(_ID, _calendarPickerCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_calendarPickerInvokeEventId)) {
        window.webworks.event.once(_ID, _calendarPickerInvokeEventId, invokeCallback);
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
    if (!window.webworks.event.isOn(_calendarComposerDoneEventId)) {
        window.webworks.event.once(_ID, _calendarComposerDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_calendarComposerCancelEventId)) {
        window.webworks.event.once(_ID, _calendarComposerCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_calendarComposerInvokeEventId)) {
        window.webworks.event.once(_ID, _calendarComposerInvokeEventId, invokeCallback);
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
    if (!window.webworks.event.isOn(_emailComposerDoneEventId)) {
        window.webworks.event.once(_ID, _emailComposerDoneEventId, done);
    }
    if (!window.webworks.event.isOn(_emailComposerCancelEventId)) {
        window.webworks.event.once(_ID, _emailComposerCancelEventId, cancel);
    }
    if (!window.webworks.event.isOn(_emailComposerInvokeEventId)) {
        window.webworks.event.once(_ID, _emailComposerInvokeEventId, invokeCallback);
    }
    return window.webworks.execAsync(_ID, "invokeEmailComposer", {options: options || ""});
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
