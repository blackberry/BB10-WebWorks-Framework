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

var root = __dirname + "/../../../../",
    webview = require(root + "lib/webview"),
    index;

describe("io.filetransfer index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("0"),
            registerEvents: jasmine.createSpy(),
            invoke: jasmine.createSpy()
        };

        spyOn(webview, "windowGroup").andReturn(42);
        index = require(root + "ext/io.filetransfer/index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });

    it("makes sure JNEXT was not initialized on require", function () {
        expect(JNEXT.require).not.toHaveBeenCalledWith("libfiletransfer");
        expect(JNEXT.createObject).not.toHaveBeenCalledWith("libfiletransfer.FileTransfer");
    });

    describe("filetransfer upload", function () {
        it("should call JNEXT.invoke with custom params", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3")),
                    "options": encodeURIComponent(JSON.stringify({
                        "fileKey": "test",
                        "fileName": "test.gif",
                        "mimeType": "image/gif",
                        "params": { "test": "test" },
                        "chunkedMode": false,
                        "chunkSize": 512
                    }))
                },
                expected_args = {
                    "_eventId": "1",
                    "filePath": "2",
                    "server": "3",
                    "options": {
                        "fileKey": "test",
                        "fileName": "test.gif",
                        "mimeType": "image/gif",
                        "params": { "test": "test" },
                        "chunkedMode": false,
                        "chunkSize": 512,
                        "windowGroup" : 42
                    }
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.upload(successCB, failCB, mocked_args, null);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "upload " + JSON.stringify(expected_args));
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("should call JNEXT.invoke with default params", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3"))
                },
                expected_default_args = {
                    "_eventId": "1",
                    "filePath": "2",
                    "server": "3",
                    "options": {
                        "fileKey": "file",
                        "fileName": "image.jpg",
                        "mimeType": "image/jpeg",
                        "params": {},
                        "chunkedMode": true,
                        "chunkSize": 1024,
                        "windowGroup" : 42
                    }
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.upload(successCB, failCB, mocked_args, null);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "upload " + JSON.stringify(expected_default_args));
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("should call failure callback with null parameters", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "filePath": encodeURIComponent(JSON.stringify("")),
                    "server": encodeURIComponent(JSON.stringify(""))
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.upload(successCB, failCB, mocked_args, null);

            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalled();
        });

        it("should fail if chunkSize is not positive", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "filePath": encodeURIComponent(JSON.stringify("2")),
                    "server": encodeURIComponent(JSON.stringify("3")),
                    "options": encodeURIComponent(JSON.stringify({
                        "chunkSize": -1
                    }))
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.upload(successCB, failCB, mocked_args, null);

            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalled();
        });
    });

    describe("filetransfer download", function () {
        it("should call JNEXT.invoke", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "source": encodeURIComponent(JSON.stringify("2")),
                    "target": encodeURIComponent(JSON.stringify("3"))
                },
                expected_args = {
                    "_eventId": "1",
                    "source": "2",
                    "target": "3",
                    "windowGroup": 42
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.download(successCB, failCB, mocked_args, null);

            expect(JNEXT.invoke).toHaveBeenCalledWith("0", "download " + JSON.stringify(expected_args));
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("should call failure callback with null parameters", function () {
            var mocked_args = {
                    "_eventId": encodeURIComponent(JSON.stringify("1")),
                    "filePath": encodeURIComponent(JSON.stringify("")),
                    "server": encodeURIComponent(JSON.stringify(""))
                },
                successCB = jasmine.createSpy(),
                failCB = jasmine.createSpy();

            index.download(successCB, failCB, mocked_args, null);

            expect(successCB).not.toHaveBeenCalled();
            expect(failCB).toHaveBeenCalled();
        });
    });
});
