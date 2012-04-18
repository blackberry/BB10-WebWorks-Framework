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
    util = require("util"),
    _c = require("./conf"),
    fs = require("fs"),
    path = require("path");

function _copyCmd(source, destination) {
    var unix_path = (_c.DEPLOY + destination).replace(/([^\/]*)$/, '');

    if (utils.isWindows()) {
        if (destination === '') {
            return 'xcopy /y ' + source + ' ' + path.normalize(_c.DEPLOY + destination);
        } else {
            return 'cmd /c if not exist ' + path.normalize(_c.DEPLOY + destination) +
                   ' md ' + path.normalize(_c.DEPLOY + destination) + ' && ' +
                   'xcopy /y/e ' + source + ' ' + path.normalize(_c.DEPLOY + destination);
        }
    } else {
        if (_c.DEPLOY === unix_path) {
            return 'cp -r ' + source + ' ' + unix_path;
        } else {
            return 'mkdir -p ' + unix_path + ' && ' +
                   'cp -r ' + source + ' ' + unix_path;
        }
    }
}

function _copyFiles() {
    var cmdSep = " && ";
    return  _copyCmd(_c.LIB, 'lib') + cmdSep +
            _copyCmd(_c.EXT, 'ext') + cmdSep +
            _copyCmd(_c.CLIENTFILES, 'clientFiles') + cmdSep +
            _copyCmd(_c.DEPENDENCIES_BOOTSTRAP, 'dependencies/bootstrap') + cmdSep +
            _copyCmd(_c.DEPENDENCIES_WEBPLATFORM_FRAMEWORK_REQUIRE, 'dependencies/bootstrap/') + cmdSep +
            // DO NOT copy webplatform-framework lib/* files over
            // _copyCmd(_c.DEPENDENCIES_WEBPLATFORM_FRAMEWORK_LIB, 'lib') + cmdSep +
            _copyCmd(_c.ROOT + 'README.md', '') + cmdSep +
            _copyCmd(_c.ROOT + 'LICENSE', '');

}

function _deleteFolderCmd(folderpath) {
    var unix_path = _c.DEPLOY + folderpath;
    if (utils.isWindows()) {
        return 'rmdir /S /Q ' + path.normalize(_c.DEPLOY + folderpath);
    } else {
        return 'rm -rf ' + unix_path;
    }
}

function _deleteFilesFromTarget() {
    return  _deleteFolderCmd('lib/public');
}

function _processFiles() {
    return _copyFiles() + ' && ' + _deleteFilesFromTarget();
}

module.exports = function (src, baton) {
    baton.take();

    require('./bundler').bundle();

    childProcess.exec(_processFiles(), function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.log(stderr);
            baton.pass(error.code);
        } else {
            baton.pass(src);
        }
    });
};
