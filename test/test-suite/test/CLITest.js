/*
 *  Copyright 2012 Research In Motion Limited.
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
var childProcess = require("child_process"),
    CLITest;

CLITest = function (face) {
    var cli = face,
    option = [];

    this.addOption = function (name, value) {
        option.push(name + " " + (value || ""));
    };
    this.run = function (done) {
        var cmd = option.reduce(function (previousValue, currentValue, index, array) {
            return (index === 0 ? "" : " ") + previousValue + " " + currentValue;
        }, cli);
        console.log(cmd);
        childProcess.exec(cmd, function (error, stdout, stderr) {
            console.log(stderr);
            console.log(stdout);
            done();
        });
    };
};
module.exports = CLITest;
