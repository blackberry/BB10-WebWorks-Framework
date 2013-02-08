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
    childProcess = require('child_process'),
    util = require("util"),
    utils = require("./build/utils"),
    conf = require("./build/conf"),
    path = require("path"),
    jWorkflow = require("jWorkflow"),
    fs = require('fs');

/**
 * This function will call the function argument with the commandline arguments.
 */
function _handle(func) {
    return function () {
        try {
            func.apply(func, Array.prototype.slice.call(process.argv, 3));
        } catch (e) {
            utils.displayOutput(e.message + "\n" + e.stack);
        }
    };
}

module.exports = function (pathToApp, pathToPackager, packagerOptions) {
    var frameworkPath,
        intExtPath,
        outputPath = path.normalize(conf.COMMAND_DEFAULTS.output_folder),
        cmd;

    pathToApp = path.normalize(pathToApp);
    if (!pathToApp || !fs.existsSync(pathToApp)) {
        utils.displayOutput("Invalid bar file specified - " + pathToApp);
        process.exit(-1);
    }

    if (!pathToPackager) {
        pathToPackager = conf.COMMAND_DEFAULTS.packager;
        utils.displayOutput("No packager specified, using default from test-runner.json - " + pathToPackager);
    }

    pathToPackager = path.normalize(pathToPackager);
    frameworkPath = path.join(pathToPackager, "Framework");

    if (!packagerOptions) {
        packagerOptions = conf.COMMAND_DEFAULTS.packager_options + " -o \"" + outputPath + "\"";
        utils.displayOutput("No packager options specified, using default from test-runner.json - " + packagerOptions);
    } else if (packagerOptions === '-d') {
        packagerOptions = " -d " + "-o \"" + outputPath + "\"";
    } else if (packagerOptions.indexOf('-d') === -1) {
        packagerOptions = " -d " + packagerOptions;
    }

    //First delete the old directory
    if (fs.existsSync(frameworkPath)) {
        wrench.rmdirSyncRecursive(frameworkPath);
    }
    //Now replace with current framework
    wrench.copyDirSyncRecursive(conf.DEPLOY, frameworkPath);

    //Include internal extensions
    intExtPath = path.normalize(__dirname + "/../ext-internal/");
    fs.readdirSync(intExtPath).forEach(function (ext) {
        wrench.copyDirSyncRecursive(path.join(intExtPath, ext), path.join(frameworkPath, "ext", ext));
    });
    //Include experimental extensions
    intExtPath = path.normalize(__dirname + "/../ext-experimental/");
    fs.readdirSync(intExtPath).forEach(function (ext) {
        wrench.copyDirSyncRecursive(path.join(intExtPath, ext), path.join(frameworkPath, "ext", ext));
    });

    //Call bbwp using node
    cmd = "node " + ' "' + path.join(pathToPackager, "lib/bbwp.js") + '"' + ' "' + pathToApp + '" ' + packagerOptions;

    jWorkflow.order(utils.execCommandWithJWorkflow(cmd))
        .start(function (error) {
            process.exit(error);
        });

};
