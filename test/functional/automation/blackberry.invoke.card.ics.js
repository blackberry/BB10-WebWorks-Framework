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

/*global internal */

describe("blackberry.invoke.card.ics", function () {

    var waitTimeout = 2000;

    function pushIcsFileToDevice(callback) {
        var dir = blackberry.io.sharedFolder + "/documents/",
            fileName = "test.ics",
            bb = new window.WebKitBlobBuilder();

        blackberry.io.sandbox = false;

        function generateUUID() {
            function segment(count, val) {
                if (!val) {
                    val = "";
                }
                if (count > 0) {
                    return segment(--count, val + Math.floor(Math.random() * 0x10000).toString(16));
                } else {
                    return val;
                }
            }
            return segment(2) + "-" + segment(1) + "-" + segment(1) + "-" + segment(1) +  "-" + segment(3);
        }

        function gotWriter(fileWriter) {
            fileWriter.onwriteend = function (e) {
                callback();
            };
            bb.append("BEGIN:VCALENDAR\n");
            bb.append("PRODID:-//Research In Motion//RIM App//EN\n");
            bb.append("VERSION:1.0\n");
            bb.append("BEGIN:VEVENT\n");
            bb.append("DTEND:20210101T003000Z\n");
            bb.append("DTSTART:20210101T000000Z\n");
            bb.append("SUMMARY:invokeIcsViewer Test Event\n");
            bb.append("UID:" + generateUUID() + "\n");
            bb.append("END:VEVENT\n");
            bb.append("END:VCALENDAR\n");

            fileWriter.write(bb.getBlob('text/plain'));
        }

        function errorHandler(e) {
            console.log(e);
        }

        function gotFile(fileEntry) {
            fileEntry.createWriter(gotWriter, errorHandler);
        }

        function onInitFs(fs) {
            fs.root.getFile(dir + fileName, {create: true}, gotFile, errorHandler);
        }

        window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs, errorHandler);
    }

    describe("invokeIcsViewer", function () {
        var onDone,
            onCancel;

        beforeEach(function () {
            onDone = jasmine.createSpy("done");
            onCancel = jasmine.createSpy("cancel");
        });

        it("should invoke the card and call cancel", function () {
            waits(waitTimeout);
            blackberry.invoke.card.invokeIcsViewer({uri: "local:///manual/framework-split/test.ics"}, onDone, onCancel);
            waits(waitTimeout);
            runs(function () {
                internal.automation.touchBottomLeft();
                waits(waitTimeout);
                runs(function () {
                    expect(onCancel).toHaveBeenCalled();
                });
            });
        });

        it("should add event to calendar and call done", function () {
            var flag = false;
            pushIcsFileToDevice(function () {
                flag = true;
            });
            waitsFor(function () {
                return flag;
            }, waitTimeout);
            runs(function () {
                blackberry.invoke.card.invokeIcsViewer({uri: "file://" + blackberry.io.sharedFolder + "/documents/test.ics"}, onDone, onCancel);
                waits(waitTimeout);
                runs(function () {
                    internal.automation.touchBottomCenter();
                    waits(waitTimeout);
                    runs(function () {
                        internal.automation.touch(screen.availWidth / 2, 150);
                        waits(waitTimeout);
                        runs(function () {
                            expect(onDone).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });

});
