/*
 * Copyright 2010-2011 Research In Motion Limited.
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

function writeBlobToPath(blob, size, path, callback) {
    var errorHandler = function (e) {
        console.log(e);
    };
    blackberry.io.sandbox = false;
    window.webkitRequestFileSystem(window.PERSISTENT, size, function (fs) {
        fs.root.getFile(path, {create: true}, function (file) {
            file.createWriter(function (writer) {
                writer.onwriteend = function (e) {
                    callback();
                };
                writer.write(blob);
            }, errorHandler);
        }, errorHandler);
    }, errorHandler);
}

describe("blackberry.ui.cover", function () {
    describe("window covers", function () {
        var entercover,
            exitcover;

        afterEach(function () {
            blackberry.event.removeEventListener("entercover", entercover);
            blackberry.event.removeEventListener("exitcover", exitcover);
            blackberry.ui.cover.resetCover();
        });

        it("sets window cover from file:///filepath", function () {
            var confirm,
                path = "file:///accounts/1000/shared/downloads/windowcover.png",
                label = {"label": "Test 1", "size": 8},
                blob,
                flag = false,
                description = "type: file\n" +
                              "image: windowcover.png\n" +
                              "label: Test 1\n";
            entercover = function () {
                blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {path: path});
                blackberry.ui.cover.setTransition(blackberry.ui.cover.TRANSITION_FADE);
                blackberry.ui.cover.labels.push(label);
                blackberry.ui.cover.updateCover();
            };
            exitcover = function () {
                confirm = window.confirm(description);
            };
            blackberry.event.addEventListener("entercover", entercover);
            blackberry.event.addEventListener("exitcover", exitcover);

            runs(function () {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', "local:///img/windowcover.png", true);
                xhr.responseType = 'blob';
                xhr.onload = function (e) {
                    if (this.status === 200) {
                        blob = new window.Blob([this.response], {type:  'image/png'});
                        writeBlobToPath(blob, 1024 * 1024, "/accounts/1000/shared/downloads/windowcover.png", function () {
                            flag = true;
                        });
                    }
                };
                xhr.send();
            });
            waitsFor(function () {
                return flag;
            });
            runs(function () {
                alert("Thumbnail the application, then resume it to confirm if the cover matches the description");
            });
            waitsFor(function () {
                return (confirm === true || confirm === false);
            }, "exitcover never fired", 15000);
            runs(function () {
                expect(confirm).toEqual(true);
            });
        });

        it("sets window cover from local:///filepath", function () {
            var confirm,
                path = "local:///img/windowcover.png",
                label = {"label": "Test 2", "size": 8},
                description = "type: file\n" +
                              "image: windowcover.png\n" +
                              "label: Test 2\n";
            entercover = function () {
                blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {path: path});
                blackberry.ui.cover.labels.push(label);
                blackberry.ui.cover.updateCover();
            };
            exitcover = function () {
                confirm = window.confirm(description);
            };
            blackberry.event.addEventListener("entercover", entercover);
            blackberry.event.addEventListener("exitcover", exitcover);

            runs(function () {
                alert("Thumbnail the application, then resume it to confirm if the cover matches the description");
            });
            waitsFor(function () {
                return (confirm === true || confirm === false);
            }, "exitcover never fired", 15000);
            runs(function () {
                expect(confirm).toEqual(true);
            });
        });

        it("sets the window cover from snapshot", function () {
            var confirm,
                capture = {"x": 0, "y": 0, "height": 300, "width": 250},
                label = {"label": "Test 3", "size": 8},
                description = "type: snapshot\n" +
                              "capture: 0, 0, 300, 250\n" +
                              "label: Test 3\n";
            entercover = function () {
                blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_SNAPSHOT, capture);
                blackberry.ui.cover.labels.push(label);
                blackberry.ui.cover.updateCover();
            };
            exitcover = function () {
                confirm = window.confirm(description);
            };
            blackberry.event.addEventListener("entercover", entercover);
            blackberry.event.addEventListener("exitcover", exitcover);

            runs(function () {
                alert("Thumbnail the application, then resume it to confirm if the cover matches the description");
            });
            waitsFor(function () {
                return (confirm === true || confirm === false);
            }, "exitcover never fired", 15000);
            runs(function () {
                expect(confirm).toEqual(true);
            });
        });

        it("sets window cover without label wrapping", function () {
            var confirm,
                path = "local:///img/windowcover.png",
                label = {"label": "This is a long label that should wrap text to the next line", "size": 8, "wrap": true},
                description = "type: file\n" +
                              "image: windowcover.png\n" +
                              "label: This is a long label that should wrap text to the next line\n" +
                              "wrap: yes\n";
            entercover = function () {
                blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {path: path});
                blackberry.ui.cover.labels.push(label);
                blackberry.ui.cover.updateCover();
            };
            exitcover = function () {
                confirm = window.confirm(description);
            };
            blackberry.event.addEventListener("entercover", entercover);
            blackberry.event.addEventListener("exitcover", exitcover);

            runs(function () {
                alert("Thumbnail the application, then resume it to confirm if the cover matches the description");
            });
            waitsFor(function () {
                return (confirm === true || confirm === false);
            }, "exitcover never fired", 15000);
            runs(function () {
                expect(confirm).toEqual(true);
            });
        });

        it("sets window cover without label wrapping", function () {
            var confirm,
                path = "local:///img/windowcover.png",
                label = {"label": "This is a long label that should not wrap text to the next line", "size": 8, "wrap": false},
                description = "type: file\n" +
                              "image: windowcover.png\n" +
                              "label: This is a long label that...\n" +
                              "wrap: no\n";
            entercover = function () {
                blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {path: path});
                blackberry.ui.cover.labels.push(label);
                blackberry.ui.cover.updateCover();
            };
            exitcover = function () {
                confirm = window.confirm(description);
            };
            blackberry.event.addEventListener("entercover", entercover);
            blackberry.event.addEventListener("exitcover", exitcover);

            runs(function () {
                alert("Thumbnail the application, then resume it to confirm if the cover matches the description");
            });
            waitsFor(function () {
                return (confirm === true || confirm === false);
            }, "exitcover never fired", 15000);
            runs(function () {
                expect(confirm).toEqual(true);
            });
        });
    });
});
