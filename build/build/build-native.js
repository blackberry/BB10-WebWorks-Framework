/*
* Copyright 2011-2012 Research In Motion Limited.
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
var utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    jWorkflow = require("jWorkflow"),
    _c = require("./conf");

module.exports = function (isForUnitTest) {
    var MAKE_CMD = "make " + "-j " + _c.COMPILER_THREADS,
        simDir = (isForUnitTest ? _c.UNIT_TEST_SIM_BUILD : _c.SIM_BUILD),
        deviceDir = (isForUnitTest ? _c.UNIT_TEST_DEVICE_BUILD : _c.DEVICE_BUILD),
        buildEnv = process.env;

    return function (prev, baton) {
        var SH_CMD = "bash ",
            build = jWorkflow.order(),
            thisBaton = baton,
            configurePrefix,
            configureX86,
            configureARM;

        thisBaton.take();

        //Create build directories if necessary
        if (!path.existsSync(simDir)) {
            fs.mkdirSync(simDir);
        }

        if (!path.existsSync(deviceDir)) {
            fs.mkdirSync(deviceDir);
        }

        //configure-qsk commands
        configurePrefix = utils.isWindows() ? SH_CMD : "";
        configureX86 = configurePrefix + _c.DEPENDENCIES_CONFIGURE_QSK + " x86";
        configureARM = configurePrefix + _c.DEPENDENCIES_CONFIGURE_QSK + " arm a9";

        if (isForUnitTest) {
            buildEnv.UNIT_TESTS = "1";
        }

        build = build.andThen(utils.execCommandWithJWorkflow(configureX86, {cwd: simDir, env: buildEnv}))
        .andThen(utils.execCommandWithJWorkflow(MAKE_CMD, {cwd: simDir}))
        .andThen(utils.execCommandWithJWorkflow(configureARM, {cwd: deviceDir, env: buildEnv}))
        .andThen(utils.execCommandWithJWorkflow(MAKE_CMD, {cwd: deviceDir}))
        .andThen(function () {
            //catch the success case
            thisBaton.pass(prev);
        });

        //catch the error case
        build.start(function (error) {
            if (error) {
                thisBaton.drop(error);
            }
        });
    };
};
