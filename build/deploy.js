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
var wrench = require("wrench"),
    zip = require("node-zip"),
    childProcess = require('child_process'),
    util = require("util"),
    conf = require("./build/conf"),
    path = require("path"),
    fs = require('fs');

function _exec(cmdExpr, prev, baton) {
    if (baton) {
        baton.take();
    }
    var proc = childProcess.exec(cmdExpr, function (error, stdout, stderr) {
        util.print(stdout);
        util.print(stderr);
    });

    proc.on("exit", function (code) {
        if (code) {
            process.exit(code);
        }
        if (baton) {
            baton.pass(prev);
        }
    });
}

module.exports = function (barFile, deviceIp, password) {

    if (!barFile || !path.existsSync(barFile)) { 
        util.puts("Invalid bar file specified - " + barFile);
        process.exit();
    }

    if (!deviceIp) {
        deviceIp = conf.DEPLOY_COMMAND_DEFAULT_IP;
        util.puts("Device IP not specified, using default from build/conf.js - " + deviceIp);
    }

    if (!password) {
        password = conf.DEPLOY_COMMAND_DEFAULT_PW;
        util.puts("Device password not specified, using default from build/conf.js - " + password);
    }

    _exec("blackberry-deploy -installApp -launchApp " + "-package " +  barFile + " -device " + deviceIp + " -password " + password); 
};
