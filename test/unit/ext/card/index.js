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

var _apiDir = __dirname + "./../../../../ext/card/",
    _libDir = __dirname + "./../../../../lib/",
    _extDir = __dirname + "./../../../../ext/",
    mockedMediaPlayer,
    mockedCamera,
    mockedFile,
    mockedIcs,
    mockedCalPicker,
    mockedCalComposer,
    mockedEmailComposer,
    index,
    successCB,
    failCB;

describe("invoke.card index", function () {

    beforeEach(function () {
        mockedMediaPlayer = {
            open: jasmine.createSpy("mediaplayerPreviewer.open")
        };
        mockedCamera = {
            open: jasmine.createSpy("camera.open")
        };
        mockedFile = {
            open: jasmine.createSpy("file.open")
        };
        mockedIcs = {
            open: jasmine.createSpy("ics.open")
        };
        mockedCalPicker = {
            open: jasmine.createSpy("calendarPicker.open")
        };
        mockedCalComposer = {
            open: jasmine.createSpy("calendarComposer.open")
        };
        mockedEmailComposer = {
            open: jasmine.createSpy("emailComposer.open")
        };
        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
        GLOBAL.window = {
            qnx: {
                callExtensionMethod : function () {},
                webplatform: {
                    getApplication: function () {
                        return {
                            cards: {
                                mediaplayerPreviewer: mockedMediaPlayer,
                                camera: mockedCamera,
                                filePicker: mockedFile,
                                icsViewer: mockedIcs,
                                email: {
                                    composer: mockedEmailComposer
                                },
                                calendar: {
                                    picker: mockedCalPicker,
                                    composer: mockedCalComposer
                                }
                            }
                        };
                    }
                }
            }
        };
    });

    afterEach(function () {
        mockedMediaPlayer = null;
        mockedCamera = null;
        delete GLOBAL.window;
        mockedFile = null;
        mockedCalPicker = null;
        mockedCalComposer = null;
        mockedEmailComposer = null;
        mockedIcs = null;
        index = null;
        delete require.cache[require.resolve(_apiDir + "index")];
        successCB = null;
        failCB = null;
    });

    describe("invoke camera", function () {
        it("can invoke camera with mode", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "mode": encodeURIComponent(JSON.stringify({mode: "photo"}))
                };

            index.invokeCamera(successCB, null, mockedArgs);
            expect(mockedCamera.open).toHaveBeenCalledWith({
                mode: "photo"
            }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("invoke file picker", function () {
        it("can invoke file picker with options", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "options": encodeURIComponent(JSON.stringify({mode: "Picker"}))
                };

            index.invokeFilePicker(successCB, null, mockedArgs);
            expect(mockedFile.open).toHaveBeenCalledWith({
                    mode: "Picker"
                }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("invoke mediaplayer", function () {
        it("can invoke mediaplayer previewer with options", function () {
            var contentTitle = "Test Title",
                contentUri = "file:///accounts/1000/shared/camera/VID_00000001.mp4",
                imageUri = "",
                mockedArgs = {
                    contentTitle: contentTitle,
                    contentUri: contentUri,
                    imageUri: imageUri
                };

            index.invokeMediaPlayer(successCB, null, {options: encodeURIComponent(JSON.stringify(mockedArgs))});

            expect(mockedMediaPlayer.open).toHaveBeenCalledWith({
                    contentTitle: decodeURIComponent(contentTitle),
                    contentUri: decodeURIComponent(contentUri),
                    imageUri: decodeURIComponent(imageUri)
                }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("invoke ICS viewer", function () {
        it("can invoke ICS viewer with options", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    options: encodeURIComponent(JSON.stringify({options: {uri: "file://path/to/file.ics"}}))
                };
            index.invokeIcsViewer(successCB, null, mockedArgs);
            expect(mockedIcs.open).toHaveBeenCalledWith({
                options: { uri : "file://path/to/file.ics" }
            }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
        });
    });

    describe("invoke calendar picker", function () {
        it("can invoke calendar picker with options", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    options: encodeURIComponent(JSON.stringify({options: {filepath: "/path/to/file.vcs"}}))
                };
            index.invokeCalendarPicker(successCB, null, mockedArgs);
            expect(mockedCalPicker.open).toHaveBeenCalledWith({
                options: { filepath : "/path/to/file.vcs" }
            }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("invoke calendar composer", function () {
        it("can invoke calendar composer with", function () {
            var subject = "Subject",
                body = "Body",
                startTime = "Wed Jun 21 12:21:21 2012",
                duration = '20',
                mockedArgs = {
                    "subject": subject,
                    "body": body,
                    "startTime": startTime,
                    "duration": duration
                };

            index.invokeCalendarComposer(successCB, null, {options: encodeURIComponent(JSON.stringify(mockedArgs))});

            expect(mockedCalComposer.open).toHaveBeenCalledWith({
                    subject: decodeURIComponent(subject),
                    body: decodeURIComponent(body),
                    startTime: decodeURIComponent(startTime),
                    duration: decodeURIComponent(duration)
                }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("invoke email composer", function () {
        it("can invoke email composer with", function () {
            var subject = "Subject",
                body = "Body",
                mockedArgs = {
                    "subject": subject,
                    "body": body,
                };

            index.invokeEmailComposer(successCB, null, {options: encodeURIComponent(JSON.stringify(mockedArgs))});

            expect(mockedEmailComposer.open).toHaveBeenCalledWith({
                    subject: decodeURIComponent(subject),
                    body: decodeURIComponent(body),
                }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });
});
