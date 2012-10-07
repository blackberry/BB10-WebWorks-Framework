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

function _done() {
    util.puts("Test App deployed successfully");
    process.exit();
}

module.exports = function (pathToPackager, packagerOptions, target, deviceIp, password) {
    var jakeDir = __dirname + "/../",
        barPath,
        deployTests;


    if (!pathToPackager) {
        pathToPackager = conf.PACKAGE_COMMAND_DEFAULT_PACKAGER;
        util.puts("No packager specified, using default from build/conf.js - " + pathToPackager);
    }

    if (!packagerOptions) {
        packagerOptions = conf.PACKAGE_COMMAND_DEFAULT_OPTIONS;
        util.puts("No packager options specified, using default from build/conf.js - " + packagerOptions);
    }

    if (!target) {
        target = conf.DEPLOY_TESTS_DEFAULT_TARGET;
        util.puts("No deploy target specified, using default from build/conf.js - " + target);
    }
    barPath = "'test/test-app/" + target + "/wwTest.bar'";

    if (!deviceIp) {
        deviceIp = conf.DEPLOY_COMMAND_DEFAULT_IP;
        util.puts("Device IP not specified, using default from build/conf.js - " + deviceIp);
    }

    if (!password) {
        password = conf.DEPLOY_COMMAND_DEFAULT_PW;
        util.puts("Device password not specified, using default from build/conf.js - " + password);
    }

    deployTests = jWorkflow.order(_exec("jake build[test]", {cwd: jakeDir}))
                           .andThen(_exec("jake test-app", {cwd: jakeDir}))
                           .andThen(_exec("jake package['" + pathToPackager + "','test/test-app/wwTest.zip','" + packagerOptions + "','js/webworks.js']",  {cwd: jakeDir}))
                           .andThen(_exec("jake deploy[" + barPath + "," + deviceIp + "," + password + "]",  {cwd: jakeDir}));

    deployTests.start(function () {
        _done();
    });

};
