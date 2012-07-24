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
    fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    utils = require('./build/utils'),
    TEST_APP_PATH = __dirname + "/../test/test-app/";

function _exec(cmdExpr, options, prev, baton) {
    if (baton) {
        baton.take();
    }
    var proc = childProcess.exec(cmdExpr, options, function (error, stdout, stderr) {
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

function _done() {
    util.puts("Test App created successfully");
    process.exit();
}

function _buildJQMobile (prev, baton) {
    _exec("make", {cwd: __dirname + "/../dependencies/jquery-mobile/"}, prev, baton);
}

function _buildJQuery (prev, baton) {
    _exec("git submodule update --init && make", {cwd: __dirname + "/../dependencies/jquery/"}, prev, baton);
}

function _copyFiles (prev, baton) {
    baton.take();

    //Check if css dir exists, if not create it (not necessary for js because it already contains webworks.js)
    if (!path.exists(TEST_APP_PATH + "css")) {
        wrench.mkdirSyncRecursive(TEST_APP_PATH + "css");
    }

    //JQMobile JS file
    utils.copyFile(__dirname + "/../dependencies/jquery-mobile/compiled/jquery.mobile.min.js", __dirname + "/../test/test-app/js/");
    //JQMobile CSS File
    utils.copyFile(__dirname + "/../dependencies/jquery-mobile/compiled/jquery.mobile.min.css", __dirname + "/../test/test-app/css/");
    //JQuery JS file
    utils.copyFile(__dirname + "/../dependencies/jquery/dist/jquery.min.js", __dirname + "/../test/test-app/js/");
    //Jasmine JS file
    utils.copyFile(__dirname + "/../dependencies/jasmine/lib/jasmine-core/jasmine.js", __dirname + "/../test/test-app/js/");
    utils.copyFile(__dirname + "/../dependencies/jasmine/lib/jasmine-core/jasmine-html.js", __dirname + "/../test/test-app/js/");
    //Jasmine CSS file
    utils.copyFile(__dirname + "/../dependencies/jasmine/lib/jasmine-core/jasmine.css", __dirname + "/../test/test-app/css/");
    //Automatic functional tests
    wrench.copyDirSyncRecursive(__dirname + "/../test/functional/automatic/", __dirname + '/../test/test-app/automatic/spec/');
    //Manual functional tests
    wrench.copyDirSyncRecursive(__dirname + "/../test/functional/manual/", __dirname + '/../test/test-app/manual/framework/spec/');

    baton.pass(prev);
}

function _buildZip (prev, baton) {
    var appFiles,
        appJSZip,
        filePath,
        fileData,
        fileStats,
        i,
        element,
        FILES_TO_IGNORE = ["README", "src", "Thumbs.db", "device", "simulator"];
    
    baton.take();
   
    if (path.existsSync(TEST_APP_PATH + "wwTest.zip")) {
        fs.unlinkSync(TEST_APP_PATH + "wwTest.zip");
    }

    appFiles =  wrench.readdirSyncRecursive(TEST_APP_PATH).filter(function (element) {
        return !FILES_TO_IGNORE.some(function (file, index, array) {
            return element.indexOf(file) !== -1;
        });
    });
    appJSZip = new JSZip();
    for (i = 0; i< appFiles.length; i++) {
        element = appFiles[i];
        filePath = path.relative(TEST_APP_PATH, element); 
        fileStats = fs.lstatSync(element);
        if (fileStats.isDirectory()) {
            appJSZip.folder(filePath);
        } else {
            fileData = fs.readFileSync(element).toString("base64");
            appJSZip.file(filePath, fileData, {base64: true});
        }
    }
/*
    appFiles.forEach(function (element, index, array) {
        fileData = fs.readFileSync(TEST_APP_PATH + element).toString("base64");
        appJSZip.file(element, fileData, {base64: true});
    });
    */
    fs.writeFileSync(TEST_APP_PATH + "wwTest.zip", appJSZip.generate({base64:true, compression: "DEFLATE"}), "base64");

    baton.pass(prev);
} 


module.exports = function () {
    var packageApp = jWorkflow.order(_buildJQMobile)
                            .andThen(_buildJQuery)
                            .andThen(_copyFiles)
                            .andThen(_buildZip);

    packageApp.start(function () {
        _done();
    });

};
