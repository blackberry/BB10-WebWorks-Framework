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
        appJsZip,
        oldPackagerFiles,
        oldPackagerJsZip;

    if (!pathToPackager) {
        util.puts("No arguments specified correctly, using default arguments (found in build/conf.js). Call Jake -T for instructions on how to use this command.");
        pathToPackager = pathToPackager || conf.PACKAGE_COMMAND_DEFAULT_PACKAGER;
        pathToApp = pathToApp || conf.PACKAGE_COMMAND_DEFAULT_APP;
        packagerOptions = packagerOptions || conf.PACKAGE_COMMAND_DEFAULT_OPTIONS;
        pathToWebWorksJs = pathToWebWorksJs || conf.PACKAGE_COMMAND_DEFAULT_WEBWORKS_JS_PATH;
    }

    if (!path.existsSync(pathToPackager)) {
        util.puts("Invalid path to packager specified - " + pathToPackager);
        proccess.exit();
    }

    if (!path.existsSync(pathToApp)) {
        util.puts("Invalid path to app specified - " + pathToApp);
    }

    //If the path to webworks is specified, then update the webworks in the zip
    if (pathToWebWorksJs) {
        zipFileData = fs.readFileSync(pathToApp).toString('base64');
        wwVersion = fs.readFileSync("version", "utf-8").trim();
        webworksJsData = fs.readFileSync(conf.CLIENTFILES + "/webworks-" + wwVersion + ".js").toString('base64');
        appJsZip = new JSZip(zipFileData, {base64: true});
        appJsZip.remove(pathToWebWorksJs);
        appJsZip.file(pathToWebWorksJs, webworksJsData, {base64: true});
        fs.writeFileSync(pathToApp, appJsZip.generate({base64:true, compression:'DEFLATE'}), "base64");
    } 

    //Backup the old directory if there isn't already a backup present.
    //NOT WORKING YET
    /*
    if (!path.existsSync(pathToPackager + "/" + conf.BACKUP_PACKAGER_FRAMEWORK)){
        oldPackagerFiles = wrench.readdirSyncRecursive(pathToPackager + "/Framework");
        oldPackagerJsZip = new JSZip();
        oldPackagerFiles.forEach(function (element, index, array) {
                console.log(element);
                console.log("About to read element - " + element + " path - "+ path.join(pathToPackager, element));
                var filePath = path.join(pathToPackager + "/Framework", element),
                fileStats = fs.lstatSync(filePath),
                fileData;

                if (fileStats.isDirectory()) {
                    oldPackagerJsZip.folder(element);
                } else {
                    if (filePath.indexOf(".so") === -1) {
                        console.log("Using Base64");
                        fileData = fs.readFileSync(filePath).toString("base64");
                        oldPackagerJsZip.file(element, fileData, {base64: true});
                    } else {
                        console.log("NOT USING BASE64");
                        fileData = fs.readFileSync(filePath).toString();
                        oldPackagerJsZip.file(element, fileData, {binary: true});
                    }
                }
        });
        fs.writeFileSync(pathToPackager + "/" + conf.BACKUP_PACKAGER_FRAMEWORK, oldPackagerJsZip.generate({base64: true, compression: "DEFLATE"}), "base64");
    }
    */

    //First delete the old directory
    if (path.existsSync(pathToPackager + "/Framework")) {
        wrench.rmdirSyncRecursive(pathToPackager + "/Framework");
    }
    //Now replace with current framework  
    wrench.copyDirSyncRecursive(conf.DEPLOY, pathToPackager + "/Framework");

    //Call bbwp using node
    _exec("node " + pathToPackager + "/lib/bbwp.js " + pathToApp + " " + packagerOptions);       

};
