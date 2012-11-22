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
    _apiDir = root + "ext/io.filetransfer/",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {},
    constants = {
        "FILE_NOT_FOUND_ERR": 1,
        "INVALID_URL_ERR": 2,
        "CONNECTION_ERR": 3
    },
    defineROFieldArgs = [];

describe("io.filetransfer client", function () {
    beforeEach(function () {
        mockedWebworks.execAsync = jasmine.createSpy();
        mockedWebworks.defineReadOnlyField = jasmine.createSpy();
        mockedWebworks.event = {
            once : jasmine.createSpy(),
            isOn : jasmine.createSpy()
        };

        GLOBAL.window = {
            webworks: mockedWebworks
        };

        client = require(_apiDir + "client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    describe("io.filetransfer constants", function () {
        it("should return constant", function () {
            Object.getOwnPropertyNames(constants).forEach(function (c) {
                defineROFieldArgs.push([client, c, constants[c]]);
            });

            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("FILE_NOT_FOUND_ERR")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_URL_ERR")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CONNECTION_ERR")]);
        });
    });

    describe("io.filetransfer upload", function () {
        var filePath = "a",
            server = "b",
            options = { "c": "d" },
            callback = function () {};

        it("should create a once event handler", function () {
            client.upload(filePath, server, callback, callback, options);
            expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(jasmine.any(String));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
        });

        it("should call webworks.execAsync", function () {
            var expected_args = {
                "_eventId": jasmine.any(String),
                "filePath": filePath,
                "server": server,
                "options": options
            };

            client.upload(filePath, server, callback, callback, options);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "upload", expected_args);
        });

        it("should call success callback on success event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "success",
                    "bytesSent": "someBytesSent",
                    "responseCode": "someResponseCode",
                    "response": escape("someResponse!")
                },
                expected_args = {
                    "bytesSent": "someBytesSent",
                    "responseCode": "someResponseCode",
                    "response": "someResponse!"
                };

            client.upload(filePath, server, success, failure, options);
            mockedWebworks.event.once.argsForCall[0][2](mocked_args);

            expect(success).toHaveBeenCalledWith(expected_args);
            expect(failure).not.toHaveBeenCalled();
        });

        it("should call failure callback on error event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "error",
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                },
                expected_args = {
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                };

            client.upload(filePath, server, success, failure, options);
            mockedWebworks.event.once.argsForCall[0][2](mocked_args);

            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith(expected_args);
        });
    });

    describe("io.filetransfer download", function () {
        var source = "a",
            target = "b",
            callback = function () {};

        it("should create a once event handler", function () {
            client.download(source, target, callback, callback);
            expect(mockedWebworks.event.isOn).toHaveBeenCalledWith(jasmine.any(String));
            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
        });

        it("should call webworks.execAsync", function () {
            var expected_args = {
                "_eventId": jasmine.any(String),
                "source": source,
                "target": target
            };

            client.download(source, target, callback, callback);
            expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "download", expected_args);
        });

        it("should call success callback on success event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "success",
                    "isFile": true,
                    "isDirectory": false,
                    "name": "someName",
                    "fullPath": escape("someFullPath!")
                },
                expected_args = {
                    "isFile": true,
                    "isDirectory": false,
                    "name": "someName",
                    "fullPath": "someFullPath!"
                };

            client.download(source, target, success, failure);
            mockedWebworks.event.once.argsForCall[0][2](mocked_args);

            expect(success).toHaveBeenCalledWith(expected_args);
            expect(failure).not.toHaveBeenCalled();
        });


        it("should call failure callback on error event", function () {
            var success = jasmine.createSpy(),
                failure = jasmine.createSpy(),
                mocked_args = {
                    "result": "error",
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                },
                expected_args = {
                    "code": "someCode",
                    "source": "someSource",
                    "target": "someTarget"
                };

            client.download(source, target, success, failure);
            mockedWebworks.event.once.argsForCall[0][2](mocked_args);

            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalledWith(expected_args);
        });
    });
});
