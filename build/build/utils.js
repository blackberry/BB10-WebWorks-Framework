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
var os = require("os"),
    fs = require('fs'),
    wrench = require("../../node_modules/wrench"),
    path = require('path');

module.exports = {
    isWindows : function () {
        return os.type().toLowerCase().indexOf("windows") >= 0;
    },

    copyFile: function (srcFile, destDir, baseDir) {
        var filename = path.basename(srcFile),
            fileBuffer = fs.readFileSync(srcFile),
            fileLocation;

        //if a base directory was provided, determine
        //folder structure from the relative path of the base folder
        if (baseDir && srcFile.indexOf(baseDir) === 0) {
            fileLocation = srcFile.replace(baseDir, destDir);
            wrench.mkdirSyncRecursive(path.dirname(fileLocation), "0755");
            fs.writeFileSync(fileLocation, fileBuffer);
        } else {
            fs.writeFileSync(path.join(destDir, filename), fileBuffer);
        }
    },

    listFiles: function (directory, filter) {
        var files = wrench.readdirSyncRecursive(directory),
            filteredFiles = [];

        files.forEach(function (file) {
            //On mac wrench.readdirSyncRecursive does not return absolute paths, so resolve one.
            file = path.resolve(directory, file);

            if (filter(file)) {
                filteredFiles.push(file);
            }
        });

        return filteredFiles;
    },

    arrayContains: function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    },

    /*
     * This is not a complete test as it does not check for values between the dots less 255.
     * If needed that can be added at a later point.
     */
    isValidIPAddress: function (ip) {
        var regex = new RegExp("^(?:[0-9]{1,3}\/.){3}[0-9]{1,3}$");
        return regex.test(ip);
    }
};
