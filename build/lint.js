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
var childProcess = require('child_process'),
    util = require('util'),
    os = require('os'),
    jWorkflow = require("jWorkflow"),
    fs = require('fs');

function _exec(cmdExpr, prev, baton) {
    baton.take();
    var proc = childProcess.exec(cmdExpr, function (error, stdout, stderr) {
        util.print(stdout);
        util.print(stderr);
    });

    proc.on("exit", function (code) {
        if (code) {
            util.puts("Lint FAILED");
            process.exit(code);
        }
        baton.pass(prev);
    });
}
function _done() {
    util.puts("Lint SUCCESS");
    process.exit();
}

function _lintJS(prev, baton) {
    var options = ["--reporter", "build/lint/reporter.js", "--show-non-errors"],
        files = ["."];        
    _exec('jshint ' + files.concat(options).join(' '), prev, baton);
}

function _lintCSS(prev, baton) {
    var rules = JSON.parse(fs.readFileSync(__dirname + "/../.csslintrc", "utf-8")),
        options = ["--rules=" + rules, "--format=compact"],
        files = ["lib"];
    _exec('csslint ' + files.concat(options).join(' '), prev, baton);
}

function _lintCPP(prev, baton) {
    //Only cpplint on unix. Windows currently has an issue with cpplinting
    if (os.type().toLowerCase().indexOf("windows") === -1) {
        var options = ["--R", "--filter=-whitespace/line_length,-whitespace/comments,-whitespace/labels,-readability/streams"],
            files = ["ext"];
        _exec('python ' + __dirname + "/../dependencies/cpplint/cpplint.py " + options.concat(files).join(' '), prev, baton);
    }
}

module.exports = function (files) {
    var lint = jWorkflow.order(_lintJS)
                    .andThen(_lintCSS)
                    .andThen(_lintCPP);

    lint.start(function () {
        _done();
    });
};
