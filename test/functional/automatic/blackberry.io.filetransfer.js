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

