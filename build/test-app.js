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
    path = require("path"),
    fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    utils = require('./build/utils'),
    TEST_APP_PATH = path.normalize(__dirname + "/../test/test-app/");

module.exports = function () {
    utils.displayOutput("Preparing Test-App for packaging");

    var cssDir = path.join(TEST_APP_PATH, "css"),
        jsDir = path.join(TEST_APP_PATH, "js"),
        jasmineDir = path.normalize(__dirname + "/../dependencies/jasmine/lib/jasmine-core/"),
        testSrcDir = path.normalize(__dirname + "/../test/functional");

    if (!fs.existsSync(cssDir)) {
        wrench.mkdirSyncRecursive(cssDir);
    }
    if (!fs.existsSync(jsDir)) {
        wrench.mkdirSyncRecursive(jsDir);
    }

    //Copy over all the jasmine files
    utils.copyFile(path.join(jasmineDir, "jasmine.js"), jsDir, undefined, true);
    utils.copyFile(path.join(jasmineDir, "jasmine-html.js"), jsDir, undefined, true);
    utils.copyFile(path.join(jasmineDir, "jasmine.css"), cssDir, undefined, true);
    //Automatic functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "automatic"), path.join(TEST_APP_PATH, "automatic", "spec"));
    //Manual functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "manual"), path.join(TEST_APP_PATH, "manual", "framework", "spec"));
    //Automation functional tests
    wrench.copyDirSyncRecursive(path.join(testSrcDir, "automation"), path.join(TEST_APP_PATH, "automation", "spec"));

    utils.displayOutput("SUCCESSFULLY Prepared Test-App for packaging");
};
