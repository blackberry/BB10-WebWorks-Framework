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

var srcPath = __dirname,
    pp = require(srcPath + '/../../../../build/build/preprocessor'),
    fs = require('fs');

describe("preprocessor", function () {

    it("can preprocess a simple if else", function () {
        var options = {
                defines: ["as"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "//@else\n" +
                    "   Line2\n" +
                    "//@endif",
            result = "   Line2\n";

        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });

    it("can preprocess a simple if else [else condition]", function () {
        var options = {
                defines: ["Hello"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "//@else\n" +
                    "   Line2\n" +
                    "//@endif",
            result = "   Line1\n";

        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });

    it("can preprocess a simple if multiline", function () {
        var options = {
                defines: ["Hello"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "   Line1\n" +
                    "//@endif",
            result = "   Line1\n" +
                    "   Line1\n";

        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });

    it("can preprocess a simple if multiline", function () {
        var options = {
                defines: ["as"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "   Line1\n" +
                    "//@endif",
            result = "";
        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });

    it("can preprocess a simple if else multiline", function () {
        var options = {
                defines: ["as"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "   Line1\n" +
                    "//@else\n" +
                    "   Line2\n" +
                    "//@endif",
            result = "   Line2\n";

        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });

    it("can preprocess a simple if else multi line", function () {
        var options = {
                defines: ["Hello"],
                src: "",
                dst: ""
            },
            text =  "//@if Hello\n" +
                    "   Line1\n" +
                    "   Line1\n" +
                    "//@else\n" +
                    "   Line2\n" +
                    "//@endif",
            result = "   Line1\n" +
                     "   Line1\n";

        spyOn(fs, "readFileSync").andReturn(text);
        spyOn(fs, "writeFileSync");

        pp.preprocess(options);
        expect(fs.writeFileSync).toHaveBeenCalledWith('', result);
    });
});
