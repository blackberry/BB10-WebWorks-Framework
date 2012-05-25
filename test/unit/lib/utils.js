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

var srcPath = __dirname + '/../../../lib/';

describe("Utils", function () {
    var utils = require(srcPath + 'utils.js');

    it("Verify that the filenameToImageMIME is defined", function () {
        expect(utils.fileNameToImageMIME).toBeDefined();
    });

    it("Verify that the proper PNG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.png")).toEqual("image/png");
    });

    it("Verify that the proper period MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.t.png")).toEqual("image/png");
    });

    it("Verify that the proper JPG types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpg")).toEqual("image/jpeg");
    });

    it("Verify that the proper GIF types are returned", function () {
        expect(utils.fileNameToImageMIME("test.gif")).toEqual("image/gif");
    });

    it("Verify that the proper TIFF types are returned", function () {
        expect(utils.fileNameToImageMIME("test_test_.tif")).toEqual("image/tiff");
    });

    it("Verify that the proper TIFF types are returned", function () {
        expect(utils.fileNameToImageMIME("test_test_.tiff")).toEqual("image/tiff");
    });

    it("Verify that the proper JPE MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpe")).toEqual("image/jpeg");
    });

    it("Verify that the proper BMP MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.bmp")).toEqual("image/bmp");
    });

    it("Verify that the proper JPEG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpeg")).toEqual("image/jpeg");
    });

    it("Verify that the proper SVG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.svg")).toEqual("image/svg+xml");
    });
});
