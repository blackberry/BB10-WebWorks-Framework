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
describe("blackberry.invoke.card", function () {
    it('blackberry.invoke.card should exist', function () {
        expect(blackberry.invoke.card).toBeDefined();
        expect(blackberry.invoke.card.invokeCamera).toBeDefined();
        expect(blackberry.invoke.card.invokeFilePicker).toBeDefined();
    });

    it('blackberry.invoke should exist', function () {
        expect(blackberry.invoke).toBeDefined();
        expect(blackberry.invoke.invoke).toBeDefined();
        expect(blackberry.invoke.query).toBeDefined();
    });

    it('blackberry.invoke.card should have camera constants', function () {
        expect(blackberry.invoke.card.CAMERA_MODE_PHOTO).toBe('photo');
        expect(blackberry.invoke.card.CAMERA_MODE_VIDEO).toBe('video');
        expect(blackberry.invoke.card.CAMERA_MODE_FULL).toBe('full');
    });

    it('blackberry.invoke.card should have file picker constants', function () {
        expect(blackberry.invoke.card.FILEPICKER_MODE_PICKER).toBe('Picker');
        expect(blackberry.invoke.card.FILEPICKER_MODE_SAVER).toBe('Saver');
        expect(blackberry.invoke.card.FILEPICKER_MODE_PICKER_MULTIPLE).toBe('PickerMultiple');
        expect(blackberry.invoke.card.FILEPICKER_MODE_SAVER_MULTIPLE).toBe('SaverMultiple');
        expect(blackberry.invoke.card.FILEPICKER_VIEWER_MODE_LIST).toBe('ListView');
        expect(blackberry.invoke.card.FILEPICKER_VIEWER_MODE_GRID).toBe('GridView');
        expect(blackberry.invoke.card.FILEPICKER_VIEWER_MODE_DEFAULT).toBe('Default');
        expect(blackberry.invoke.card.FILEPICKER_SORT_BY_NAME).toBe('Name');
        expect(blackberry.invoke.card.FILEPICKER_SORT_BY_DATE).toBe('Date');
        expect(blackberry.invoke.card.FILEPICKER_SORT_BY_SUFFIX).toBe('Suffix');
        expect(blackberry.invoke.card.FILEPICKER_SORT_BY_SIZE).toBe('Size');
        expect(blackberry.invoke.card.FILEPICKER_SORT_ORDER_ASCENDING).toBe('Ascending');
        expect(blackberry.invoke.card.FILEPICKER_SORT_ORDER_DESCENDING).toBe('Descending');
        expect(blackberry.invoke.card.FILEPICKER_TYPE_PICTURE).toBe('picture');
        expect(blackberry.invoke.card.FILEPICKER_TYPE_DOCUMENT).toBe('document');
        expect(blackberry.invoke.card.FILEPICKER_TYPE_MUSIC).toBe('music');
        expect(blackberry.invoke.card.FILEPICKER_TYPE_VIDEO).toBe('video');
        expect(blackberry.invoke.card.FILEPICKER_TYPE_OTHER).toBe('other');
    });


    it('open the file picker card and then close to make sure it actually opens.', function () {
        var delay = 20000,
            flag = false,
            reason,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.card.invokeFilePicker({mode: "Picker"}, function (path) {
        },
        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay / 4);

        runs(function () {
            flag = false;

            blackberry.event.addEventListener("onChildCardClosed", function (request) {
                reason = request.reason;
                flag = true;
            });

            blackberry.invoke.closeChildCard();
            waitsFor(function () {
                return flag;
            }, delay);
            runs(function () {
                expect(reason).toBe("closed");
            });
        });
    });

    it('open the camera card and then close to make sure it actually opens.', function () {
        var delay = 20000,
            flag = false,
            errorSpy = jasmine.createSpy(),
            reason;

        blackberry.invoke.card.invokeCamera("photo", function (path) {
        },
        function (reason) {
            flag = true;
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay / 4);

        runs(function () {
            flag = false;

            blackberry.event.addEventListener("onChildCardClosed", function (request) {
                reason = request.reason;
                flag = true;
            });

            blackberry.invoke.closeChildCard();
            waitsFor(function () {
                return flag;
            }, delay);
            runs(function () {
                expect(reason).toBe("closed");
            });
        });
    });

    it('open the mediaplayer card, close it and check for response reason to be equal closed .', function () {
        var delay = 20000,
            flag = false,
            errorSpy = jasmine.createSpy("Callback when error happens"),
            reason,
            callback;

        blackberry.invoke.card.invokeMediaPlayer({contentTitle: "Test Title"}, function (path) {
        },
        function (reason) {
            flag = true;
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay / 4);

        runs(function () {
            flag = false;
            callback = function (request) {
                blackberry.event.removeEventListener("onChildCardClosed", callback);

                reason = request.reason;
                flag = true;
            };

            blackberry.event.addEventListener("onChildCardClosed", callback);

            blackberry.invoke.closeChildCard();
            waitsFor(function () {
                return flag;
            }, delay);
            runs(function () {
                // Currently the response that comes onChildCardClosed is not informative or just emtpy.
                expect(reason).toBe("closed");
            });
        });
    });


    it('open the ICS viewer card and then close to make sure it actually opens.', function () {
        var delay = 20000,
            flag = false,
            errorSpy = jasmine.createSpy(),
            reason;

        blackberry.invoke.card.invokeIcsViewer({uri: "test"}, function (path) {
        },
        function (reason) {
            flag = true;
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay / 4);

        runs(function () {
            flag = false;

            blackberry.event.addEventListener("onChildCardClosed", function (request) {
                reason = request.reason;
                flag = true;
            });

            blackberry.invoke.closeChildCard();
            waitsFor(function () {
                return flag;
            }, delay);
            runs(function () {
                expect(reason).toBe("closed");
            });
        });
    });

});
