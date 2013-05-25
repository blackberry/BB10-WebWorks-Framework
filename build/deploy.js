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
var jWorkflow = require("jWorkflow"),
    fs = require("fs"),
    conf = require("./build/conf"),
    utils = require("./build/utils");

module.exports = function (barFile, deviceIp, password) {
    var deployBar = jWorkflow.order();

    if (!barFile || !fs.existsSync(barFile)) {
        utils.displayOutput("Invalid bar file specified - " + barFile);
        process.exit(-1);
    }

    if (!deviceIp) {
        deviceIp = conf.COMMAND_DEFAULTS.ip;
        utils.displayOutput("Device IP not specified, using default from test-runner.json - " + deviceIp);
    }

    if (!password) {
        password = conf.COMMAND_DEFAULTS.password;
        utils.displayOutput("Device password not specified, using default from test-runner.json - " + password);
    }

    deployBar.andThen(utils.execCommandWithJWorkflow("blackberry-deploy -terminateApp " + "-package " +  barFile + " -device " + deviceIp + " -password " + password, {}, true))
             .andThen(utils.execCommandWithJWorkflow("blackberry-deploy -uninstallApp " + "-package " +  barFile + " -device " + deviceIp + " -password " + password, {}, true))
             .andThen(utils.execCommandWithJWorkflow("blackberry-deploy -installApp -launchApp " + "-package " +  barFile + " -device " + deviceIp + " -password " + password))
             .start(function () {
                    utils.displayOutput("App Deployed successfully");
                    process.exit();
                });

};
