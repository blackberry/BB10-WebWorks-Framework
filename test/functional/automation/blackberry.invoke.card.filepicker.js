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
describe("blackberry.invoke.card.invokeFilePicker", function () {
    var waitForTimeout = 2000,
        errorOnCallback,
        onDone,
        onCancel,
        callback,
        request,
        filePath = "",
        isPhotoTaken;

    beforeEach(function () {
        request = {};
        onDone = jasmine.createSpy("Done Callback").andCallFake(function (info) {
            filePath = info;
        });
        onCancel = jasmine.createSpy("Cancel Callback").andCallFake(function (reason) {
            console.log("Cancel: " + reason);
        });
        callback = jasmine.createSpy().andCallFake(function (error) {
            errorOnCallback = error;
        });
    });

    afterEach(function () {
        filePath = null;
        isPhotoTaken = false;
        request = null;
        onDone = null;
        onCancel = null;
        callback = null;
        errorOnCallback = false;
        // wait for media player to be closed
        waits(waitForTimeout * 2);
        runs(function () {
        });
    });

    describe("Testing invokeFilePicker api", function () {
        function pickCameraAndTakePhoto() {
            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                waits(waitForTimeout);
                runs(function () {
                    // Selecting camera to take a photo
                    internal.automation.touchBottomLeftSecondIcon();
                    waits(waitForTimeout * 4);
                    runs(function () {
                        internal.automation.touchCenter();
                        isPhotoTaken = true;
                    });
                });
            });
        }

        // Switch to grid view, for easier picking and selecting two files
        function pickGridViewAndSelectTwoFiles() {
            var iconsPerWidth = screen.availWidth < screen.availHeight ? 3 : 5,
                headerHeight = 200,
                iconWidth = screen.availWidth / iconsPerWidth,
                iconHeight = iconWidth;

            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                waits(waitForTimeout);
                runs(function () {
                    // Selecting camera to take a photo
                    internal.automation.touchBottomLeftThirdIcon();
                    waits(waitForTimeout);
                    runs(function () {
                        // Select first file
                        internal.automation.touch(iconWidth / 2, headerHeight + iconHeight / 2);
                        // Select second file
                        internal.automation.touch(iconWidth + iconWidth / 2, headerHeight + iconHeight / 2);
                    });
                });
            });
        }

        it("should pick a 'picture' type of file", function () {
            blackberry.invoke.card.invokeFilePicker({
                mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
                type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE]
            }, onDone, onCancel, callback);

            pickCameraAndTakePhoto();

            waitsFor(function () {
                return isPhotoTaken;
            }, "Problem with taking the photo", waitForTimeout * 10);
            runs(function () {
                waitsFor(function () {
                    return filePath;
                }, "done callback never fired", waitForTimeout * 3);
                runs(function () {
                    expect(filePath && filePath.length === 1).toBeTruthy();
                });
            });
        });

        it("should pick a 'picture' type of file with imageCrop available, crop the image and receive its path when onDone trigerred", function () {
            blackberry.invoke.card.invokeFilePicker({
                mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
                type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE],
                imageCrop: true
            }, onDone, onCancel, callback);

            pickCameraAndTakePhoto();

            waitsFor(function () {
                return isPhotoTaken;
            }, "Problem with taking the photo", waitForTimeout * 10);
            runs(function () {
                waits(waitForTimeout * 3);
                runs(function () {
                    // Simulate moving image
                    internal.automation.swipeUpABitFromCenter();
                    waits(waitForTimeout);
                    runs(function () {
                        // Press 'done'
                        internal.automation.touchTopRight();

                        waitsFor(function () {
                            return filePath;
                        }, "done callback never fired", waitForTimeout * 3);
                        runs(function () {
                            expect(filePath && filePath.length === 1).toBeTruthy();
                        });
                    });
                });
            });
        });

        // At this point, (considering two previous tests passed), should be at least two file in the camera folder
        it("should open camera folder in multiple mode to select two files and recive their pathes when onDone trigerred", function () {
            blackberry.invoke.card.invokeFilePicker({
                mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER_MULTIPLE,
                directory: [blackberry.io.sharedFolder + "/camera"]
            }, onDone, onCancel, callback);

            pickGridViewAndSelectTwoFiles();

            waits(waitForTimeout * 4);
            runs(function () {
                // Press 'done'
                internal.automation.touchTopRight();

                waitsFor(function () {
                    return filePath;
                }, "done callback never fired", waitForTimeout * 2);
                runs(function () {
                    expect(filePath && filePath.length === 2).toBeTruthy();
                });
            });
        });
    });
});