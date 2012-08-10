/*
 *  Copyright 2011 Research In Motion Limited.
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
var utils = require('./build/utils'),
    jWorkflow = require("jWorkflow"),
    fs = require('fs');

function _done() {
    utils.displayOutput("Lint SUCCESS");
    process.exit();
}

function _lintJS() {
    var options = ["--reporter", "build/lint/reporter.js", "--show-non-errors"],
        files = ["."];
    return utils.execCommandWithJWorkflow('jshint ' + files.concat(options).join(' '));
}

function _lintCSS() {
    var rules = JSON.parse(fs.readFileSync(__dirname + "/../.csslintrc", "utf-8")),
        options = ["--rules=" + rules, "--format=compact", "--quiet"],
        files = [""];
    return utils.execCommandWithJWorkflow('node dependencies/csslint/release/npm/cli.js ' + files.concat(options).join(' '));
}

function _lintCPP() {
    var returnValue = function (prev, baton) {},
        options = ["--R", "--filter=-whitespace/line_length,-whitespace/comments,-whitespace/labels,-whitespace/braces,-readability/streams"],
        files = ["ext"];
    //Only cpplint on unix. Windows currently has an issue with cpplinting
    if (!utils.isWindows()) {
        returnValue = utils.execCommandWithJWorkflow('python ' + __dirname + "/../dependencies/cpplint/cpplint.py " + options.concat(files).join(' '));
    }

    return returnValue;
}

module.exports = function (files) {
    var lint = jWorkflow.order(_lintJS())
                    .andThen(_lintCSS())
                    .andThen(_lintCPP());

    lint.start(function () {
        _done();
    });
};
