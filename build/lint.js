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
    wrench = require('wrench'),
    path = require('path'),
    _c = require('./build/conf'),
    preprocess = require('./build/preprocess'),
    jWorkflow = require("jWorkflow"),
    fs = require('fs');

function copyFile(src, dst) {
    var fileBuffer = fs.readFileSync(src);
    fs.writeFileSync(dst, fileBuffer);
}

function _done(error) {
    if (error === 0) {
        utils.displayOutput("Lint SUCCESS");
    }
    process.exit();
}

function _lintJS() {
    var options = ["--reporter", "build/lint/reporter.js", "--show-non-errors"],
        files = ["."];

    return utils.execCommandWithJWorkflow('jshint ' + files.concat(options).join(' '), {cwd: _c.TEMP});
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
        files = [
            "ext/app",
            "ext/bbm.platform",
            "ext/connection",
            "ext/io.filetransfer",
            "ext/json",
            "ext/pim.contacts",
            "ext/push",
            "ext/ui.dialog"
        ];
    //Only cpplint on unix. Windows currently has an issue with cpplinting
    if (!utils.isWindows()) {
        returnValue = utils.execCommandWithJWorkflow('python ' + __dirname + "/../dependencies/cpplint/cpplint.py " + options.concat(files).join(' '));
    }

    return returnValue;
}

module.exports = function (files) {
    utils.copyFolder(path.join(_c.ROOT, "ext"), path.join(_c.TEMP, "ext"));
    utils.copyFolder(path.join(_c.ROOT, "lib"), path.join(_c.TEMP, "lib"));
    utils.copyFolder(path.join(_c.ROOT, "build"), path.join(_c.TEMP, "build"));
    utils.copyFolder(path.join(_c.ROOT, "test"), path.join(_c.TEMP, "test"));
    copyFile(path.join(_c.ROOT, ".jshintignore"), path.join(_c.TEMP, ".jshintignore"));
    copyFile(path.join(_c.ROOT, ".jshintrc"), path.join(_c.TEMP, ".jshintrc"));

    var lint = jWorkflow.order(preprocess([], [_c.TEMP]))
                    .andThen(_lintJS())
                    .andThen(_lintCPP());

    lint.start(function (code) {
            wrench.rmdirSyncRecursive(_c.TEMP, true);
            _done(code);
        });
};
