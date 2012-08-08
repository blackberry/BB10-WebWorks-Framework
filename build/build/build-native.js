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
var childProcess = require("child_process"),
    utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    jWorkflow = require("jWorkflow"),
    _c = require("./conf");

function _getCmd(ext) {
    var cmd = "",
        nativeDir,
        simDir,
        deviceDir,
        configurePrefix,
        configureX86,
        configureARM,

        //strip binary commands
        stripX86 = "ntox86-strip *.so",
        stripARM = "ntoarmv7-strip *.so",

        //Command constants
        AND_CMD = " && ",
        CD_CMD = "cd ",
        MAKE_CMD = "make -j" + _c.COMPILER_THREADS,
        CP_CMD = "cp ",
        SH_CMD = "bash ";

    //Native build directories
    nativeDir = path.join(_c.EXT, ext, "native");
    simDir = path.join(_c.EXT, ext, "simulator");
    deviceDir = path.join(_c.EXT, ext, "device");

    //configure-qsk commands
    configurePrefix = utils.isWindows() ? SH_CMD : "";
    configureX86 = configurePrefix + path.join(simDir, "configure-qsk x86");
    configureARM = configurePrefix + path.join(deviceDir, "configure-qsk arm a9");

    //If native folder exists, Build
    if (path.existsSync(nativeDir)) {
        if (!path.existsSync(simDir)) {
            fs.mkdirSync(simDir);
        }

        if (!path.existsSync(deviceDir)) {
            fs.mkdirSync(deviceDir);
        }

        cmd += CP_CMD + _c.DEPENDENCIES_CONFIGURE_QSK + " " +
            simDir + AND_CMD + CP_CMD + _c.DEPENDENCIES_CONFIGURE_QSK +
            " " + deviceDir + AND_CMD +
            CD_CMD + simDir + AND_CMD +
            configureX86 + AND_CMD +
            MAKE_CMD + AND_CMD + stripX86 + AND_CMD +
            CD_CMD + deviceDir + AND_CMD +
            configureARM + AND_CMD +
            MAKE_CMD + AND_CMD + stripARM;

    }

    return cmd;
}

function createCmd(ext) {
    return function (prev, baton) {
        baton.take();
        var c = childProcess.exec(_getCmd(ext), function (error, stdout, stderr) {
            if (error) {
                baton.drop(error.code);
            } else {
                baton.pass(prev);
            }
        });

        c.stdout.on('data', function (data) {
            utils.displayOutput(data);
        });

        c.stderr.on('data', function (data) {
            utils.displayOutput(data);
        });
    };
}

module.exports = function (prev, baton) {
    var build = jWorkflow.order(),
        i,
        thisBaton = baton,
        exts = fs.readdirSync(_c.EXT);

    thisBaton.take();

    for (i = 0; i < exts.length; i++) {
        build = build.andThen(createCmd(exts[i]));
    }

    //catch the success case
    build = build.andThen(function () {
        thisBaton.pass(prev);
    });

    //catch the error case
    build.start(function (error) {
        if (error) {
            thisBaton.drop(error);
        }
    });
};
