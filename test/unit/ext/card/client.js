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

var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/card",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks;

describe("invoke.card client", function () {
    beforeEach(function () {
        mockedWebworks = {
            execSync: jasmine.createSpy("webworks.execSync"),
            execAsync: jasmine.createSpy("webworks.execAsync"),
            defineReadOnlyField: jasmine.createSpy(),
            event: {
                isOn: jasmine.createSpy("webworks.event.isOn"),
                once: jasmine.createSpy("webworks.event.once")
            }
        };

        GLOBAL.window = {
            webworks: mockedWebworks
        };
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        mockedWebworks = undefined;
        delete GLOBAL.window;
        client = null;
        delete require.cache[require.resolve(_apiDir + "/client")];
    });


    describe("invoke camera ", function () {
        var done,
            cancel,
            invokeCallback;
        beforeEach(function () {
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });
        it("should call execAsyn with correct mode", function () {
            client.invokeCamera("photo");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeCamera", {mode: "photo"});
            client.invokeCamera("video");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeCamera", {mode: "video"});
            client.invokeCamera("full");
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeCamera", {mode: "full"});
        });
        it("should register all the events", function () {
            client.invokeCamera("photo", done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);

            client.invokeCamera("video", done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);

            client.invokeCamera("full", done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);
        });
        it("should define photo|video|full", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_PHOTO", "photo");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_VIDEO", "video");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_FULL", "full");
        });
    });

    describe("invoke File Picker ", function () {
        var details,
            done,
            cancel,
            invokeCallback;
        beforeEach(function () {
            details = {
                mode: "Picker"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });
        it("should call execAsyn with correct mode", function () {
            details = { mode: "Picker" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeFilePicker", {options: details});

            details = { mode: "PickerMultiple" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeFilePicker", {options: details});

            details = { mode: "Saver" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeFilePicker", {options: details});

            details = { mode: "SaverMultiple" };
            client.invokeFilePicker(details);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeFilePicker", {options: details});
        });
        it("should register all the events", function () {
            details = { mode: "Picker" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);

            details = { mode: "PickerMultiple" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);

            details = { mode: "Saver" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);

            details = { mode: "SaverMultiple" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);
        });
        it("should define all file picker constants", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_PICKER", "Picker");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_SAVER", "Saver");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_PICKER_MULTIPLE", "PickerMultiple");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_MODE_SAVER_MULTIPLE", "SaverMultiple");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_LIST", "ListView");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_GRID", "GridView");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_VIEWER_MODE_DEFAULT", "Default");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_NAME", "Name");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_DATE", "Date");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_SUFFIX", "Suffix");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_BY_SIZE", "Size");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_ORDER_ASCENDING", "Ascending");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_SORT_ORDER_DESCENDING", "Descending");

            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_PICTURE", 'picture');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_DOCUMENT", 'document');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_MUSIC", 'music');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_VIDEO", 'video');
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "FILEPICKER_TYPE_OTHER", 'other');
        });
    });

    describe("invoke Media Player", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                contentTitle: "Test Title",
                contentUri: "file:///accounts/1000/shared/camera/VID_00000001.mp4",
                imageUri: "file:///accounts/1000/shared/camera/AUD_00000001.mp4"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call execAsync with correct details passed", function () {
            client.invokeMediaPlayer(details);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeMediaPlayer", {options: details});
        });

        it("should register all the events", function () {
            client.invokeMediaPlayer(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);
        });

    });

    describe("invoke ics viewer", function () {
        var done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call execAsync with uri and accountId", function () {
            client.invokeIcsViewer({uri: "file://path"});
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeIcsViewer", {options: {uri: "file://path"}});
            client.invokeIcsViewer({uri: "file://path", accountId: 1});
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeIcsViewer", {options: {uri: "file://path", accountId: 1}});
        });

        it("should register all the events", function () {
            client.invokeIcsViewer({uri: "file://path", accountId: 1}, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), done);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), cancel);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), invokeCallback);
        });
    });

});
