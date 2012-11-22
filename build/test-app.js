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
    Zip = require("node-native-zip"),
    childProcess = require('child_process'),
    util = require("util"),
    conf = require("./build/conf"),
    path = require("path"),
    fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    utils = require('./build/utils'),
    TEST_APP_PATH = path.normalize(__dirname + "/../test/test-app/"),
    appZipPath = path.join(TEST_APP_PATH, "wwTest.zip"),
    FILES_TO_IGNORE = ["README", "src", "Thumbs.db", "device", "simulator", ".DS_Store"];


function createZipFile(prev, baton) {
    baton.take();

    var appZip = new Zip(),
        appFiles,
        zipFiles,
        relativePath,
        fileStats;
    
    appFiles = utils.listFiles(TEST_APP_PATH, function (element) {
        return !FILES_TO_IGNORE.some(function (file, index, array) {
            return element.indexOf(file) !== -1;
        });
    });
    zipFiles = appFiles.map(function (element) {
        relativePath = path.relative(TEST_APP_PATH, element);
        if (utils.isWindows()) {
            relativePath.replace(/\\/g, "/");
        }
        fileStats = fs.lstatSync(element);
        if (!fileStats.isDirectory()) {
            return { name: relativePath, path: element};
        }
    }).filter(function (element) {
        return element; 
    });

    appZip.addFiles(zipFiles, function (err) {
        if (err) {
            util.puts("Error creating zip file " + err);
            baton.drop();
        }
        
        fs.writeFile(appZipPath, appZip.toBuffer(), function () {
            baton.pass(prev);
        });   

    });
}


module.exports = function () {
    var cssDir = path.join(TEST_APP_PATH, "css"),
        jasmineDir = path.normalize(__dirname + "/../dependencies/jasmine/lib/jasmine-core/"),
        testSrcDir = path.normalize(__dirname + "/../test/functional"),
        buildZip = jWorkflow.order(createZipFile);


    //Check if css dir exists, if not create it (not necessary for js because it already contains webworks.js)
    if (!path.exists(cssDir)) {
        wrench.mkdirSyncRecursive(cssDir);
    }

    //Copy over all the jasmine files
    utils.copyFile(path.join(jasmineDir, "jasmine.js"), path.join(TEST_APP_PATH, "js"), undefined, true);
    utils.copyFile(path.join(jasmineDir, "jasmine-html.js"), path.join(TEST_APP_PATH, "js"), undefined, true);
    utils.copyFile(path.join(jasmineDir, "jasmine.css"), path.join(TEST_APP_PATH, "css"), undefined, true);
    //Automatic functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "automatic"), path.join(TEST_APP_PATH, "automatic", "spec"));
    //Manual functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "manual"), path.join(TEST_APP_PATH, "manual", "framework", "spec"));
    //Automation functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "automation"), path.join(TEST_APP_PATH, "automatic", "spec", "automation"));
    //If the zip exists delete it
    if (path.existsSync(appZipPath)) {
        fs.unlinkSync(appZipPath);
    }
    
    buildZip.start(function () {
        util.puts("Test App created successfully");
    });
};
