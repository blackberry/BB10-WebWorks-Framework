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
    fs = require('fs'),
    jWorkflow = require('jWorkflow');

function _exec(cmdExpr) {
    return function (prev, baton) {
        if (baton) {
            baton.take();
        }

        var proc = childProcess.exec(cmdExpr, function (error, stdout, stderr) {
        });

        proc.on("exit", function (code) {
            if (code) {
                process.exit(code);
            }
            if (baton) {
                baton.pass(prev);
            }
        });
    };
}

function _done(error) {
    if (error) {
        console.log("Startup Test Failed");
        process.exit(1);
    } else {
        console.log("Startup Test Success");
        process.exit();
    }
}

function _getReadLogCmd(ip, appName) {
    return "ssh root@" + ip +
        " \"mount -uw /base; " +
        "sloginfo | grep startapp:.*" + appName + " | awk '{print \\$14}' > startupTests.log\" && " +
        "scp root@" + ip + ":startupTests.log .";
}

function _getClearLogCmd(ip) {
    return "ssh root@" + ip + " \"mount -uw /base; sloginfo -c\"";
}

function _parseStartupLog(path) {
    return function (prev, baton) {
        if (baton) {
            baton.take();
        }
        fs.readFile(path, 'utf-8', function (err, data) {
            if (err) {
                process.exit(err);
            } else {
                // Parse log file here
                var timeValues = data.split('\n'),
                    count = 0,
                    totalTime = 0;

                timeValues.forEach(function (value) {
                    if (value) {
                        count += 1;
                        totalTime += parseFloat(value);
                    }
                });

                console.log("Average startup time over " + parseInt(count, 10) + " executions: " + (totalTime / count) + " seconds");
                baton.pass();
            }
        });
    };
}

module.exports = function () {
    var args = Array.prototype.slice.call(arguments)[0],
        ip = args[0] || _c.USB_IP,
        appName = args[1] || "WebWorksTest",
        startupTest;


    if (appName === "CLEAR_LOG") {
        startupTest = jWorkflow.order(_exec(_getClearLogCmd(ip)));
        startupTest.start();
    } else {
        startupTest = jWorkflow.order(_exec(_getReadLogCmd(ip, appName))).andThen(_parseStartupLog('./startupTests.log'));
        startupTest.start();
    }
};
