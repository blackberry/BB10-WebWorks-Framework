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
    utils = require("./build/utils"),
    conf = require("./build/conf"),
    path = require("path"),
    fs = require('fs');

function _exec(cmdExpr, prev, baton) {
    if (baton) {
        baton.take();
    }
    var proc = childProcess.exec(cmdExpr, function (error, stdout, stderr) {
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
}
/**
 * This function will call the function argument with the commandline arguments.
 */
function _handle(func) {
    return function () {
        try {
            func.apply(func, Array.prototype.slice.call(process.argv, 3));
        } catch (e) {
            util.puts(e.message + "\n" + e.stack);
        }
    };
}

module.exports = function (pathToPackager, pathToApp, packagerOptions, pathToWebWorksJs) {

    var zipFileData,
        webworksJsData,
        wwVersion,
        wwVersionPath,
        appJsZip,
        frameworkPath,
        intExtPath,
        cmd;


    if (!pathToPackager) {
        pathToPackager = conf.PACKAGE_COMMAND_DEFAULT_PACKAGER;
        util.puts("No packager specified, using default from build/conf.js - " + pathToPackager);
    }

    pathToPackager = path.normalize(pathToPackager);
    frameworkPath = path.join(pathToPackager, "Framework");

    if (!pathToApp) {
        pathToApp = conf.PACKAGE_COMMAND_DEFAULT_APP;
        util.puts("No app path specified, using default from build/conf.js - " + pathToApp);
    }

    if (!packagerOptions) {
        packagerOptions = conf.PACKAGE_COMMAND_DEFAULT_OPTIONS;
        util.puts("No packager options specified, using default from build/conf.js - " + packagerOptions);
    }

    //If the path to webworks is specified, then update the webworks in the zip
    if (pathToWebWorksJs) {
        zipFileData = fs.readFileSync(pathToApp).toString('base64');
        wwVersion = fs.readFileSync("version", "utf-8").trim();
        wwVersionPath = path.join(conf.CLIENTFILES, "webworks-" + wwVersion + ".js");
        webworksJsData = fs.readFileSync(wwVersionPath).toString('base64');
        appJsZip = new JSZip(zipFileData, {base64: true});
        appJsZip.remove(pathToWebWorksJs);
        appJsZip.file(pathToWebWorksJs, webworksJsData, {base64: true});
        fs.writeFileSync(pathToApp, appJsZip.generate({base64: true, compression: 'DEFLATE'}), "base64");
    }

    //First delete the old directory
    if (path.existsSync(frameworkPath)) {
        wrench.rmdirSyncRecursive(frameworkPath);
    }
    //Now replace with current framework
    wrench.copyDirSyncRecursive(conf.DEPLOY, frameworkPath);

    //Include internal extensions
    intExtPath = path.normalize(__dirname + "/../ext-internal/");
    fs.readdirSync(intExtPath).forEach(function (ext) {
        wrench.copyDirSyncRecursive(path.join(intExtPath, ext), path.join(frameworkPath, "ext", ext));
    });

    //Call bbwp using node
    cmd = "node " + path.join(pathToPackager, "lib/bbwp.js") + " " + pathToApp + " " + packagerOptions;
    _exec(cmd);

};
