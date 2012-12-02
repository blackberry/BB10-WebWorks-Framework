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
    events,
    mockedWebworks;

describe("invoke.card client", function () {
    beforeEach(function () {
        events = {};
        mockedWebworks = {
            execSync: jasmine.createSpy("webworks.execSync"),
            execAsync: jasmine.createSpy("webworks.execAsync"),
            defineReadOnlyField: jasmine.createSpy(),
            event: {
                isOn: jasmine.createSpy("webworks.event.isOn"), 
                once: jasmine.createSpy("webworks.event.once").andCallFake(function (id, key, func) {
                    events[key] = func;
                }),
                remove: jasmine.createSpy("webworks.event.remove")
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
        events = null;
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
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.invokeEventId", jasmine.any(Function));
            mockedWebworks.event.once.reset();

            client.invokeCamera("video", done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.invokeEventId", jasmine.any(Function));
            mockedWebworks.event.once.reset();

            client.invokeCamera("full", done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCamera.invokeEventId", jasmine.any(Function));
        });
        it("should define photo|video|full", function () {
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_PHOTO", "photo");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_VIDEO", "video");
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(client, "CAMERA_MODE_FULL", "full");
        });
        it("should remove event listener on invoke error", function () {
            client.invokeCamera("error", done, cancel, invokeCallback);
            events["invokeCamera.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeCamera.eventId", jasmine.any(Function));
        });
        it("should not remove event listener on invoke success", function () {
            client.invokeCamera("error", done, cancel, invokeCallback);
            events["invokeCamera.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
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
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.invokeEventId", jasmine.any(Function));
            mockedWebworks.event.once.reset();

            details = { mode: "PickerMultiple" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.invokeEventId", jasmine.any(Function));
            mockedWebworks.event.once.reset();

            details = { mode: "Saver" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.invokeEventId", jasmine.any(Function));
            mockedWebworks.event.once.reset();

            details = { mode: "SaverMultiple" };
            client.invokeFilePicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeFilePicker.invokeEventId", jasmine.any(Function));
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
        it("should remove event listener on invoke error", function () {
            client.invokeFilePicker({}, done, cancel, invokeCallback);
            events["invokeFilePicker.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeFilePicker.eventId", jasmine.any(Function));
        });
        it("should not remove event listener on invoke success", function () {
            client.invokeFilePicker({}, done, cancel, invokeCallback);
            events["invokeFilePicker.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
        });
    });

    describe("invoke target picker", function () {

        it("should have an invokeTargerPicker method", function () {
            expect(client.invokeTargetPicker).toBeDefined();
        });
        it("should properly invoke the target picker", function () {
            var request = {
                    uri : "http://testuri.com",
                    action : 'bb.action.SHARE',
                    target_type : ['CARD', 'APPLICATION']
                },
                onSuccess,
                onError,
                title = 'Test';

            client.invokeTargetPicker(request, title, onSuccess, onError);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeTargetPicker.eventId", jasmine.any(Function));
        });

    });

    describe("invoke calendarPicker", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                filepath : "/path/to/save/the/file/to.vcs"
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call execAsync with the correct options", function () {
            client.invokeCalendarPicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeCalendarPicker", {options: details});
        });

        it("should register all necessary events", function () {
            client.invokeCalendarPicker(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCalendarPicker.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCalendarPicker.invokeEventId", jasmine.any(Function));
        });

        it("should remove event listener on invoke error", function () {
            client.invokeCalendarPicker("error", done, cancel, invokeCallback);
            events["invokeCalendarPicker.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeCalendarPicker.eventId", jasmine.any(Function));
        });

        it("should not remove event listener on invoke success", function () {
            client.invokeCalendarPicker("error", done, cancel, invokeCallback);
            events["invokeCalendarPicker.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
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
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeMediaPlayer.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeMediaPlayer.invokeEventId", jasmine.any(Function));
        });
        it("should remove event listener on invoke error", function () {
            client.invokeMediaPlayer("error", done, cancel, invokeCallback);
            events["invokeMediaPlayer.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeMediaPlayer.eventId", jasmine.any(Function));
        });
        it("should not remove event listener on invoke success", function () {
            client.invokeMediaPlayer("error", done, cancel, invokeCallback);
            events["invokeMediaPlayer.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
        });
    });

    describe("invoke calendarComposer", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                subject: "Some event",
                body: "something about this event",
                location: "here and there",
                startTime: "Wed Jun 21 11:00:01 3412",
                endTime: "Mon Jun 22 11:00:01 3423",
                attendees: ["a@a.com", "b@b.com"]
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call execAsync with the correct options", function () {
            client.invokeCalendarComposer(details, done, cancel, invokeCallback);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeCalendarComposer", {options: details});
        });

        it("should register all necessary events", function () {
            client.invokeCalendarComposer(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCalendarComposer.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeCalendarComposer.invokeEventId", jasmine.any(Function));
        });

        it("should remove event listener on invoke error", function () {
            client.invokeCalendarComposer("error", done, cancel, invokeCallback);
            events["invokeCalendarComposer.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeCalendarComposer.eventId", jasmine.any(Function));
        });

        it("should not remove event listener on invoke success", function () {
            client.invokeCalendarComposer("error", done, cancel, invokeCallback);
            events["invokeCalendarComposer.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
        });
    });

    describe("invoke emailComposer", function () {
        var details,
            done,
            cancel,
            invokeCallback;

        beforeEach(function () {
            details = {
                to: "mission-control@nasa.gov",
                cc: "obama@whitehouse.org",
                subject: "[STATUS] Manned Mission to Mars",
                body: "It worked...",
                attachment : ["/pictures/mission/astronauts-playing-hockey-on-mars.png"]
            };
            done = jasmine.createSpy("done");
            cancel = jasmine.createSpy("cancel");
            invokeCallback = jasmine.createSpy("invokeCallback");
        });

        it("should call execAsync with the correct options", function () {
            client.invokeEmailComposer(details, done, cancel, invokeCallback);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "invokeEmailComposer", {options: details});
        });

        it("should register all necessary events", function () {
            client.invokeEmailComposer(details, done, cancel, invokeCallback);
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeEmailComposer.eventId", jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "invokeEmailComposer.invokeEventId", jasmine.any(Function));
        });

        it("should remove event listener on invoke error", function () {
            client.invokeEmailComposer("error", done, cancel, invokeCallback);
            events["invokeEmailComposer.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeEmailComposer.eventId", jasmine.any(Function));
        });

        it("should not remove event listener on invoke success", function () {
            client.invokeEmailComposer("error", done, cancel, invokeCallback);
            events["invokeEmailComposer.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
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
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
        });
        it("should remove event listener on invoke error", function () {
            client.invokeIcsViewer("error", done, cancel, invokeCallback);
            events["invokeIcsViewer.invokeEventId"]("error");
            expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, "invokeIcsViewer.eventId", jasmine.any(Function));
        });

        it("should not remove event listener on invoke success", function () {
            client.invokeIcsViewer("error", done, cancel, invokeCallback);
            events["invokeIcsViewer.invokeEventId"]("");
            expect(mockedWebworks.event.remove).not.toHaveBeenCalled();
        });
    });

});
