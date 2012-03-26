var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require("path"),
    childProcess = require("child_process"),
    wrench = require("wrench"),
    zip = require("zip"),
    _widget = path.normalize(__dirname + "/../widget"),
    _workspace = path.normalize(__dirname + "/../workspace"),
    DEVICE_IP = "192.168.137.88",
    DEVICE_PASSWORD = "123",
    HUDSON_CI_HOSTNAME = "mac-ci",
    HUDSON_CI_PORT = "9000",
    BUILD_ON_HUDSON = false;

function prepareHudson(job, callback) {
    var PACKAGER_URL = "http://" + HUDSON_CI_HOSTNAME + ":" + HUDSON_CI_PORT + "/job/" + job + "/ws/target/zip/*zip*/zip.zip",
        EXECUTABLES_URL = "http://" + HUDSON_CI_HOSTNAME + ":" + HUDSON_CI_PORT + "/job/" + job + "/ws/target/dependency/*zip*/dependency.zip",
        FUNCTIONAL_TEST_URL = "http://" + HUDSON_CI_HOSTNAME + ":" + HUDSON_CI_PORT + "/job/" + job + "/ws/Framework/test.functional/*zip*/test.functional.zip",
        PACKAGER_FILENAME = "/zip.zip",
        EXECUTABLES_FILENAME = "/dependency.zip",
        FUNCTIONAL_TEST_FILENAME = "/test.functional.zip";
    
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

    // grab functional tests from framework/ext/test.functional and place in workpace/public/spec
    downloadUnzipDelete(PACKAGER_URL, PACKAGER_FILENAME, function() {
        downloadUnzipDelete(EXECUTABLES_URL, EXECUTABLES_FILENAME, function() {
            wrench.copyDirSyncRecursive(_workspace + "/dependency", _workspace + "/zip/dependencies");
            downloadUnzipDelete(FUNCTIONAL_TEST_URL, FUNCTIONAL_TEST_FILENAME, callback);
        });
    });
}

function prepareLocal(callback) {
    var PACKAGER_URL = path.normalize(__dirname + "/../../../../target/zip"),
        FUNCTIONAL_TEST_URL = path.normalize(__dirname + "/../../../test.functional"),
        // Temp location
        EXECUTABLES_URL = "http://mac-ci:9000/job/BB10-Webworks-Packager-next-api-refactor/ws/target/dependency/*zip*/dependency.zip",
        EXECUTABLES_FILENAME = "/dependency.zip";
    
    // CLEAN/Delete workspace first
    if (!path.existsSync(_workspace)) {
        console.log('CREATE: new workspace')
        fs.mkdirSync(_workspace, "0755");
    } else {
        console.log('DELETE: old workspace')
        wrench.rmdirSyncRecursive(_workspace);
        console.log('CREATE: new workspace')
        fs.mkdirSync(_workspace, "0755");
    }

    console.log("local");   
    wrench.copyDirSyncRecursive(PACKAGER_URL, _workspace + "/zip");
    wrench.copyDirSyncRecursive(FUNCTIONAL_TEST_URL, _workspace + "/test.functional");

    downloadUnzipDelete(EXECUTABLES_URL, EXECUTABLES_FILENAME, function() {
        wrench.copyDirSyncRecursive(_workspace + "/dependency", _workspace + "/zip/dependencies");
    });
}

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

function createPage() {
    // just copy tests to public/spec folder...
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
        var package_cmd = _workspace + "/zip/bbwp " + _widget + "/widget.zip -d";
        execute(package_cmd, callback);
    }

    var zip_cmd = "cd " + _widget + " && " + "zip widget.zip config.xml";
    execute(zip_cmd, packageWidget);
    
}


function deploy(callback) {
    // deploy -installApp -launchApp
    var deploy_cmd = _workspace + "/zip/dependencies/tools/bin/blackberry-deploy.bat -package " + _widget + "/simulator/widget.bar " +
        "-device " + DEVICE_IP + " -password " + DEVICE_PASSWORD + " -installApp -launchApp";

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
        if (BUILD_ON_HUDSON) {
            prepareHudson(job, function (err) {
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
        } else {
            prepareLocal(function (err) {
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
    }
};

module.exports = _self;