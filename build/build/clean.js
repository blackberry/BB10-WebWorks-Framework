/*
* Copyright 2011 Research In Motion Limited.
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
    utils = require("./utils"),
    _c = require("./conf");

function _getCmd() {
    if (utils.isWindows()) {
        return "cmd /c if exist " + _c.DEPLOY + " rd /s /q " + _c.DEPLOY + " && " +
               "cmd /c if not exist " + _c.TARGET + " md " + _c.TARGET + " && " + 
               "cmd /c if not exist " + _c.DEPLOY + " md " + _c.DEPLOY;
    } else {
        return "rm -rf " + _c.DEPLOY + " && " + 
               "rm -rf " + _c.TARGET + " && " +
               "mkdir " + _c.TARGET + " && " +
               "mkdir " + _c.DEPLOY;
    }
}

module.exports = function (prev, baton) {
    baton.take();

    childProcess.exec(_getCmd(), function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.log(stderr);
            baton.pass(error.code);
        } else {
            baton.pass(prev);
        }
    });
};
