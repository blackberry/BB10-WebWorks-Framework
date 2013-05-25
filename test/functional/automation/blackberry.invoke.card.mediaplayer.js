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
describe("blackberry.invoke.card.invokeMediaPlayer", function () {
    var waitForTimeout = 2000,
        errorOnCallback,
        onDone,
        onCancel,
        callback,
        request;

    beforeEach(function () {
        request = {};
        onDone = jasmine.createSpy("Done Callback").andCallFake(function (info) {
            console.log(info);
        });
        onCancel = jasmine.createSpy("Cancel Callback").andCallFake(function (reason) {
            console.log("Cancel: " + reason);
        });
        callback = jasmine.createSpy().andCallFake(function (error) {
            errorOnCallback = error;
        });
    });

    afterEach(function () {
        request = null;
        onDone = null;
        onCancel = null;
        callback = null;
        errorOnCallback = false;
        // wait for media player to be closed
        waits(waitForTimeout);
        runs(function () {
        });
    });

    // Currently media player can't play files from ..../app/native/... path (this is what the path looks like when local protocol is resolved)
    describe("Testing invokeMediaPlayer api", function () {
        // 1. Invoke MediaPlayer card and pass request object contains options
        // 2. Verify invocation callback trigered
        // 3. Wait and press back button on MediaPlayer card located at left bottom corner
        // 4. Verify onDone event triggered
        function invokeMediaPlayer(request) {
            blackberry.invoke.card.invokeMediaPlayer(request, onDone, onCancel, callback);
            waitsFor(function () {
                return callback.callCount;
            }, "callback never fired", waitForTimeout * 3);
            runs(function () {
                expect(errorOnCallback).toBeUndefined();
                waits(waitForTimeout);
                runs(function () {
                    internal.automation.touchBottomLeft();
                    waits(waitForTimeout);
                    runs(function () {
                        expect(onDone).toHaveBeenCalled();
                    });
                });
            });
        }

        // Invoke MediaPlayer card with Title only
        it("should invoke media player with title only and successfully close it", function () {
            invokeMediaPlayer({
                contentTitle: "The Title"
            });
        });

        // Invoke MediaPlayer card with local video
        it("should invoke media player with local video and successfully close it", function () {
            invokeMediaPlayer({
                contentUri: "local:///video/VideoRecord1.mp4"
            });
        });

        // Invoke MediaPlayer card with local video
        it("should invoke media player with local video and title and successfully close it", function () {
            invokeMediaPlayer({
                contentTitle: "The Title",
                contentUri: "local:///video/VideoRecord1.mp4"
            });
        });
    });
});