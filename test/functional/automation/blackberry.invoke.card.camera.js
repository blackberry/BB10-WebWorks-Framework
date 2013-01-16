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


describe("blackberry.invoke.card.invokeCamera", function () {

    describe("Testing invokeCamera api", function () {
        var waitForTimeout = 2000;

        afterEach(function () {
            // wait for camera to be closed
            waits(waitForTimeout * 2);
            runs(function () {
            });
        });

        // 1. Launch camera in full mode (explicitly or by default).
        // 2. Verify invocation callback invoked with no error.
        // 3. Touch right-top corner to expand camera mode options (i.e. photo, video, time-shift).
        // 4. Touch right-top corner to select photo camera mode from the expended camera mode options.
        // 5. Touch the center of the screen to take a picture.
        // 6. Verify file created is actually an image by checking its extension.
        function launchFullModeCameraAndTakePhoto(cameraMode) {
            var filePath = "",
                fileExt = "jpg",
                errorOnCallback,
                callback = jasmine.createSpy().andCallFake(function (error) {
                    errorOnCallback = error;
                });

            blackberry.invoke.card.invokeCamera(cameraMode,
                function (path) {
                    filePath = path.toLowerCase();
                },
                function () {},
                callback
            );

            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout * 2);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                // Waits that long to ensure the camera mode options are folded
                waits(waitForTimeout * 6);
                runs(function () {
                    // When in Full Mode select icon in right top corner to expand the camera mode selection
                    internal.automation.touchTopRight();

                    waits(waitForTimeout);
                    runs(function () {
                        // Select camera mode in expended camera mode selection
                        internal.automation.touchTopRight();

                        waits(waitForTimeout * 3);
                        runs(function () {
                            internal.automation.touchCenter();
                            waitsFor(function () {
                                return filePath && filePath.length > 0;
                            }, "done callback never fired", waitForTimeout * 3);
                            runs(function () {
                                expect(filePath.indexOf(fileExt)).toBe(filePath.length - fileExt.length);
                            });
                        });
                    });
                });
            });
        }

        // 1. Launch camera in photo mode.
        // 2. Verify invocation callback invoked with no error.
        // 3. Touch the center of the screen to take a picture.
        // 4. Verify file created is actually an image by checking its extension.
        it("should invoke Camera in Photo mode and take a picture", function () {
            var filePath = "",
                fileExt = "jpg",
                errorOnCallback,
                callback = jasmine.createSpy().andCallFake(function (error) {
                    errorOnCallback = error;
                });

            blackberry.invoke.card.invokeCamera(blackberry.invoke.card.CAMERA_MODE_PHOTO,
                function (path) {
                    filePath = path.toLowerCase();
                },
                function () {},
                callback
            );

            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout * 2);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                waits(waitForTimeout * 4);
                runs(function () {
                    internal.automation.touchCenter();
                    waitsFor(function () {
                        return filePath && filePath.length > 0;
                    }, "done callback never fired", waitForTimeout * 3);
                    runs(function () {
                        expect(filePath.indexOf(fileExt)).toBe(filePath.length - fileExt.length);
                    });
                });
            });
        });

        // 1. Launch camera in video mode.
        // 2. Verify invocation callback invoked with no error.
        // 3. Touch the center of the screen to start recording video.
        // 4. Touch the center of the screen to stop recording  video.
        // 5. Verify file created is actually a video by checking its extension.
        it("should invoke Camera in Video mode and to record a video", function () {
            var filePath = "",
                fileExt = "mp4",
                errorOnCallback,
                callback = jasmine.createSpy().andCallFake(function (error) {
                    errorOnCallback = error;
                });

            blackberry.invoke.card.invokeCamera(blackberry.invoke.card.CAMERA_MODE_VIDEO,
                function (path) {
                    filePath = path.toLowerCase();
                },
                function () {},
                callback
            );

            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout * 2);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                waits(waitForTimeout * 4);
                runs(function () {
                    internal.automation.touchCenter();
                    waits(waitForTimeout * 2);
                    runs(function () {
                        internal.automation.touchCenter();
                        waitsFor(function () {
                            return filePath && filePath.length > 0;
                        }, "done callback never fired", waitForTimeout * 3);
                        runs(function () {
                            expect(filePath.indexOf(fileExt)).toBe(filePath.length - fileExt.length);
                        });
                    });
                });
            });
        });

        it("should invoke Camera in Full mode and to take a picture", function () {
            launchFullModeCameraAndTakePhoto(blackberry.invoke.card.CAMERA_MODE_FULL);
        });

        it("should invoke Camera in Full mode and to take a picture when mode is invalid", function () {
            launchFullModeCameraAndTakePhoto("invalidcameramode");
        });

        it("should invoke Camera in Full mode and to take a picture when mode is undefined", function () {
            launchFullModeCameraAndTakePhoto(undefined);
        });
    });
});
