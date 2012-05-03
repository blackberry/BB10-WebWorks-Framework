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
var childProcess = require("child_process"),
    utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    _c = require("./conf");

function _getCmd() {
    if (utils.isWindows()) {
        return "cmd /c if exist " + _c.DEPLOY + " rd /s /q " + _c.DEPLOY + " && " +
               "cmd /c if not exist " + _c.TARGET + " md " + _c.TARGET + " && " + 
               "cmd /c if not exist " + _c.DEPLOY + " md " + _c.DEPLOY;
    } else {
            //go into the ext folder
        var exts = fs.readdirSync(_c.EXT),
            cmd = "",
            ext;
        //find all extension that need to built
        for (ext in exts) {
            if (path.existsSync(_c.EXT + "/" + exts[ext] + "/native")) {
                //we know native extension exists
                if (!path.existsSync(_c.EXT + "/" + exts[ext] + "/" + "simulator")) {
                    fs.mkdirSync(_c.EXT + "/" + exts[ext] + "/" + "simulator");
                }

                if (!path.existsSync(_c.EXT + "/" + exts[ext] + "/" + "device")) {
                    fs.mkdirSync(_c.EXT + "/" + exts[ext] + "/" + "device");
                }
                if (cmd) {
                    cmd += " && ";
                }
                cmd += "cd " + _c.EXT + '/' + exts[ext] + '/' + 'simulator' + " && " + 
                    "../native/configure-qsk x86" + " && " +
                    "make" + " && " +
                    "cd " + _c.EXT + '/' + exts[ext] + '/' + 'device' + " && " + 
                    "../native/configure-qsk arm a9" + " && " +
                    "make";
            }
        } 

        return cmd;
    }
}

module.exports = function (prev, baton) {
    baton.take();

    childProcess.exec(_getCmd(), function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.log(stderr);
            baton.pass(error.code);
        } else {
            baton.pass(prev);
        }
    });
};
