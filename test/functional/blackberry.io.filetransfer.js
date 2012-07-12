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

var upload_source,
    upload_target;

window.confirm("[blackberry.io.transfer][upload] A JPEG image is recommended for this test");
upload_source = window.prompt("Please enter a upload source file on the device");
upload_target = window.prompt("Please enter a the target url for file to be uploaded");

function testConstantValue(field, value) {
    expect(blackberry.io.filetransfer[field]).toBeDefined();
    expect(blackberry.io.filetransfer[field]).toEqual(value);
}

function upload_success(r) {
    alert("Code = " + r.responseCode +
        "\nResponse = " + r.response +
        "\nSent = " + r.bytesSent);
}

function upload_failure(error) {
    alert("An error has occurred: Code = " + error.code +
        "\nupload error source " + error.source +
        "\nupload error target " + error.target);
}

describe("blackberry.io.filetransfer", function () {
    it('blackberry.io.filetransfer should exist', function () {
        expect(blackberry.io.filetransfer).toBeDefined();
    });

    it('blackberry.io.filetransfer.* should be defined', function () {
        testConstantValue("FILE_NOT_FOUND_ERR", 1);
        testConstantValue("INVALID_URL_ERR", 2);
        testConstantValue("CONNECTION_ERR", 3);
    });
});

describe("blackberry.io.filetransfer upload", function () {
    var confirm,
        options;

    beforeEach(function () {
        confirm = false;
        options = {};
    });

    it("should upload a file successfully w/o options", function () {
        blackberry.io.filetransfer.upload(upload_source, upload_target, upload_success, upload_failure);
        waits(2000);
        confirm = window.confirm("Did it the file upload successfully?");
        expect(confirm).toEqual(true);
    });

    it("should upload a file successfully w/ custom options", function () {
        options = {
            "fileKey": "file",
            "fileName": "functional_test_custom_options.jpg",
            "mimeType": "image/jpeg",
            "params": {
                "key1": "value1",
                "key2": "value2"
            },
            "chunkedMode": true
        };
        blackberry.io.filetransfer.upload(upload_source, upload_target, upload_success, upload_failure, options);
        waits(2000);
        confirm = window.confirm("Did it the file upload successfully?");
        expect(confirm).toEqual(true);
    });

    it("should upload a file successfully w/ chunkedMode false", function () {
        options = {
            "fileName": "functional_test_chunkedmode_false.jpg",
            "chunkedMode": false
        };
        blackberry.io.filetransfer.upload(upload_source, upload_target, upload_success, upload_failure, options);
        waits(2000);
        confirm = window.confirm("Did it the file upload successfully?");
        expect(confirm).toEqual(true);
    });
});