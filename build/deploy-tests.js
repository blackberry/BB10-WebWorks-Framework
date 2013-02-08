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
    util = require("util"),
    utils = require("./build/utils"),
    childProcess = require('child_process'),
    conf = require("./build/conf"),
    path = require("path"),
    build;

function _exec(cmdExpr, options) {
    return function (prev, baton) {
        if (baton) {
            baton.take();
        }
        console.log("Calling " + cmdExpr);
        var proc = childProcess.exec(cmdExpr, options, function (error, stdout, stderr) {
        });

        proc.stdout.on('data', function (data) {
            utils.displayOutput(data);
        });

        proc.stderr.on('data', function (data) {
            utils.displayOutput(data);
        });

        proc.on("exit", function (code) {
            if (code) {
                process.exit(code);
            }
            if (baton) {
                baton.pass(prev);
            }
        });
    };
}

function _done(error) {
    if (error === undefined) {
        utils.displayOutput("Test App deployed successfully");
    } else {
        utils.displayOutput("Test App FAILED to deploy");
    }
    process.exit(error);
}

module.exports = function (pathToPackager, packagerOptions, target, deviceIp, password) {
    var jakeDir = __dirname + "/../",
        deployTests,
        packageCmd = "jake package[" + path.normalize("test/test-app"),
        deployCmd = "jake deploy[";


    if (pathToPackager) {
        packageCmd += ",\"" + pathToPackager + "\"";
    }

    if (packagerOptions) {
        packageCmd += "," + packagerOptions;
    }

    packageCmd += "]";

    if (!target) {
        target = ((!!conf.COMMAND_DEFAULTS.device) ? "device" : "simulator");
        utils.displayOutput("No deploy target specified, using default from test-runner.json - " + target);
    }
    deployCmd += "\"" + path.join("test", target, "test-app.bar") + "\"";

    if (deviceIp) {
        deployCmd += "," + deviceIp;
    }

    if (password) {
        deployCmd += "," + password;
    }

    deployCmd += "]";

    deployTests = jWorkflow.order(_exec("jake build[test]", {cwd: jakeDir}))
                           .andThen(_exec("jake test-app", {cwd: jakeDir}))
                           .andThen(_exec(packageCmd,  {cwd: jakeDir}))
                           .andThen(_exec(deployCmd,  {cwd: jakeDir}))
                           .start(_done);

};
