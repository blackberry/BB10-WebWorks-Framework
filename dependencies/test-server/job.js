/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var fs = require('fs'),
    fs_extra = require('fs-extra'),
    http = require('http'),
    url = require('url'),
    path = require("path"),
    childProcess = require("child_process"),
    wrench = require("wrench"),
    zip = require("zip"),
    _widget = path.normalize(__dirname + "/widget"),
    _workspace = path.normalize(__dirname + "/workspace"),
    _functional_dir = path.normalize(__dirname + "/../../test/functional"),
    _spec_dir = path.normalize(__dirname + "/public/spec"),
    DEVICE_IP = "192.168.198.128",
    DEVICE_PASSWORD = "123",
    BUILD_ON_HUDSON = false,
    LOCAL_PACKAGER = "C:/Users/adrilee/Desktop/50";

function prepare(job, callback) {
    var PACKAGER_URL = "http://mac-ci:9000/job/" + job + "/ws/target/zip/*zip*/zip.zip",
        EXECUTABLES_URL = "http://mac-ci:9000/job/" + job + "/ws/target/dependency/*zip*/dependency.zip",
        FUNCTIONAL_TEST_URL = "http://mac-ci:9000/job/" + job + "/ws/Framework/ext/test/functional/*zip*/functional.zip",
        PACKAGER_FILENAME = "/zip.zip",
        EXECUTABLES_FILENAME = "/dependency.zip",
        FUNCTIONAL_TEST_FILENAME = "/functional.zip";
    
    // TODO: Do a CLEAN/Delete workspace first
    if (!path.existsSync(_workspace)) {
        console.log('CREATE: new workspace')
        fs.mkdirSync(_workspace, "0755");
    } else {
        console.log('DELETE: old workspace')
        wrench.rmdirSyncRecursive(_workspace);
        console.log('CREATE: new workspace')
        fs.mkdirSync(_workspace, "0755");
    }

    if (BUILD_ON_HUDSON) {
        // grab functional tests from framework/ext/test.functional and place in workpace/public/spec
        downloadUnzipDelete(PACKAGER_URL, PACKAGER_FILENAME, function() {
            downloadUnzipDelete(EXECUTABLES_URL, EXECUTABLES_FILENAME, function() {
                wrench.copyDirSyncRecursive(_workspace + "/dependency", _workspace + "/zip/dependencies");
                downloadUnzipDelete(FUNCTIONAL_TEST_URL, FUNCTIONAL_TEST_FILENAME, callback);
            });
        });

        function downloadUnzipDelete(url, filename, callback) {
            downloadDependency(url, filename, function (err) {
                if (err) {
                    callback(err);
                } else {
                    unzipDependency(filename, function (err) {
                        if (err) { 
                            callback(err);
                        } else {
                            fs.unlinkSync(_workspace + filename);
                            callback();
                        }
                    });
                }
            });
        }
    } else {
        // copy framwork/test.functional content to test-server/public/spec dir.
        wrench.copyDirSyncRecursive(_functional_dir, _spec_dir);
        fs_extra.copyFileSync(LOCAL_PACKAGER + "/Framework/clientFiles/webworks.js", path.normalize(__dirname + "/public/webworks.js"));
        callback();
    }
}

function downloadDependency(source, destination, callback) {
    var _url = url.parse(source),
        _destination = _workspace + destination,
        req;

    if (!path.existsSync(_destination)) {
        console.log("DL&UNZIP: " + destination);

        // TODO: check HTTP response status code for 
        
        req = http.get({'host': 'mac-ci', 'port': '9000', 'path': _url.pathname}, function (res) {
            if (res.statusCode !== 200) {
                callback("downloadDependency - http request status: " + res.statusCode);
            } else {
                var stream = fs.createWriteStream(_destination);
                res.pipe(stream);
                res.on('end', function () {
                    callback();
                });
            }
        }).on('error', function (e) {
            callback('downloadDependency - Unable to Download Dependency: ' + e.message);
        });

        req.on('error', function (e) {
            callback('downloadDependency - Problem with request: ' + e.message);
        });
    } else {
        console.log("SKIP-DL&UNZIP: " + destination);
        callback();
    }
}

function unzipDependency(target, callback) {
    var data, 
        filesObj, 
        p, 
        parent, 
        to = _workspace;
    
    if (!path.existsSync(_workspace + target)) {
        callback('.zip is missing ...');
    }

    data = fs.readFileSync(_workspace + target);
    filesObj = zip.Reader(data).toObject();

    if (!path.existsSync(to)) {
        wrench.mkdirSyncRecursive(to, "0755");
    }

    for (p in filesObj) {
        if (p.split("/").length > 1) {
            parent = p.split("/").slice(0, -1).join("/");
            wrench.mkdirSyncRecursive(to + "/" + parent, "0755");
        }

        fs.writeFileSync(to + "/" + p, filesObj[p]);
    }
    callback();
}

function execute(cmd, callback) {
    childProcess.exec(cmd, function (error, stdout, stderr) {
        console.log('EXECUTE: ' + cmd);
        console.log(stdout);
        if (error) {
            callback();
        } else {
            callback();
        }
    });
}

function spawn(cmd, callback) {
    var cmd_split = cmd.split(" "),
        success = false,
        array = [],
        sh;

    for (i=1; i <= cmd_split.length-1; i++) {
        array.push(cmd_split[i]);
    }

    sh = childProcess.spawn(cmd_split[0], array);

    sh.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        if (data.toString().indexOf('success') !== -1) {
            success = true;
        }
    });

    sh.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    sh.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        if (!success) {
            callback(false);
        } else {
            callback(true);
        }
      
    });
}

function package(callback) {
    // TODO: generate config.xml

    // ZIP widget & BBWP Package
    function packageWidget() {
        var package_cmd;

        if (BUILD_ON_HUDSON) {
            package_cmd = _workspace + "/zip/bbwp " + _widget + "/widget.zip -d";
        } else {
            package_cmd = LOCAL_PACKAGER + "/bbwp " + _widget + "/widget.zip -d";
        }

        execute(package_cmd, callback);
    }

    var zip_cmd = "cd " + _widget + " && " + "zip widget.zip config.xml";
    
    execute(zip_cmd, packageWidget);
}


function deploy(callback) {
    var deploy_cmd;

    if (BUILD_ON_HUDSON) {
        deploy_cmd = _workspace + "/zip/dependencies/tools/bin/blackberry-deploy" + (require(LOCAL_PACKAGER + "/lib/packager-utils.js").isWindows() ? ".bat" : "") + " -package " + _widget + "/simulator/widget.bar " +
        "-device " + DEVICE_IP + " -password " + DEVICE_PASSWORD + " -installApp -launchApp";
    } else {
        deploy_cmd = LOCAL_PACKAGER + "/dependencies/tools/bin/blackberry-deploy" + (require(LOCAL_PACKAGER + "/lib/packager-utils.js").isWindows() ? ".bat" : "") + " -package " + _widget + "/simulator/widget.bar " +
        "-device " + DEVICE_IP + " -password " + DEVICE_PASSWORD + " -installApp -launchApp";
    }

    console.log('DEPLOY: ' + deploy_cmd);
    spawn(deploy_cmd, function (success) {
        if (!success) {
            spawn(deploy_cmd, function (success) {
                if (!success) {
                    callback("DEPLOY: Unable to get success status")
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
    });
}

_self = {
    run: function (job, callback) {
        prepare(job, function (err) {
            if (err) {
                callback(err);
            } else {
                package(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        deploy(callback);
                    }
                });
            }
        });
    }
};

module.exports = _self;