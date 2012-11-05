/*
* Copyright 2012 Research In Motion Limited.
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

function _getCmd(ext, device, ip) {
    var cmd = "",
        deviceDir,
        simDir,
        testDir;

    //unit tests directories
    deviceDir = path.join(_c.UNIT_TEST_DEVICE_BUILD, ext, "native/arm/o.le-v7/test");
    simDir = path.join(_c.UNIT_TEST_SIM_BUILD, ext, "native/x86/o/test");
    testDir = device === "device" ? deviceDir : simDir;
    
    //If the folder exists, grab the test
    if (fs.existsSync(testDir)) {
        console.log("Running Unit tests for " + ext);
        cmd += " " +
            "scp " + testDir  + " root@" + ip + ":/tmp/test && " +
            "ssh root@" + ip + " '. /base/scripts/env.sh; cd ../tmp; chmod 755 test; ./test'";
    }
    return cmd;
}

module.exports = function (prev, baton) {
    var build = jWorkflow.order(),
        thisBaton = baton,
        args = Array.prototype.slice.call(prev)[0] || [],
        device = args[0] === "simulator" ? "simulator" : "device",
        ip = utils.isValidIPAddress(args[1]) ? args[1] : _c.USB_IP,
        omitList = args.slice(2) || [],
        exts = fs.readdirSync(path.join(_c.ROOT, "ext")),
        i;
    
    thisBaton.take();
    for (i = 0; i < exts.length; i++) {
        if (!utils.arrayContains(omitList, exts[i])) {
            build = build.andThen(utils.execCommandWithJWorkflow(_getCmd(exts[i], device, ip)));
        }
    }

    //catch the success case
    build = build.andThen(function () {
        thisBaton.pass();
    });

    //catch the error case
    build.start(function (error) {
        if (error) {
            thisBaton.drop(error);
        }
    });
};
