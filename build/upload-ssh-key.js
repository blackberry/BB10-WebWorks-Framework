/*
 *  Copyright 2012 Research In Motion Limited.
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
var childProcess = require('child_process'),
    utils = require('./build/utils'),
    path = require('path'),
    _c = require('./build/conf'),
    fs = require('fs');

function _exec(cmdExpr) {
    childProcess.exec(cmdExpr, function (error, stdout, stderr) {
        if (error) {
            console.log("Upload Failed");
            console.log(stderr);
            process.exit(1);
        } else {
            console.log(stdout);
            console.log("Upload SUCCESS");
            process.exit();
        }
    });

}

function _getCmd(loc, ip) {
    return "ssh root@" + ip + " 'mkdir .ssh; chmod 700 .ssh/;' &&" +
        "scp " + loc  + " root@" + ip + ":/root/.ssh/authorized_keys2 ";
}

module.exports = function () {
    var args = Array.prototype.slice.call(arguments)[0],
        loc = args[1] ||  _c.DEFAULT_SSH_KEY,
        ip = args[0] || _c.USB_IP;
    _exec(_getCmd(loc, ip));
};
