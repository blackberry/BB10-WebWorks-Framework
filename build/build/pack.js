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
var wrench = require("../../node_modules/wrench"),
    utils = require("./utils"),
    _c = require("./conf"),
    fs = require("fs"),
    path = require("path");

function copyFolder(source, destination) {
    //create the destination folder if it does not exist
    if (!path.existsSync(destination)) {
        wrench.mkdirSyncRecursive(destination, "0755");
    }

    wrench.copyDirSyncRecursive(source, destination);
}

function copyExtensions(extPath, extDest) {
    if (path.existsSync(extPath)) {
        //Iterate over extensions directory
        fs.readdirSync(extPath).forEach(function (extension) {
            var apiDir = path.normalize(path.resolve(extPath, extension)),
                apiDest = path.join(extDest, extension),
                soPath, soDest,
                apiNativeDir,
                jsFiles, soFiles;
            
            //find all .js files or .json files
            jsFiles = utils.listFiles(apiDir, function (file) {
                var extName = path.extname(file);
                return extName === ".js" || extName === ".json";
            });
            
            //Copy each .js file to its extensions folder
            jsFiles.forEach(function (jsFile) {
                utils.copyFile(jsFile, apiDest, apiDir);
            });
            
            //find and copy each .so file to the extension folder 
            ["device", "simulator"].forEach(function (target) {
                soPath = path.normalize(path.join(apiDir, target));
                soDest = path.join(apiDest, target);
                apiNativeDir = path.normalize(path.join(apiDir, "native"));
                
                //If this is a native extension, copy all .so files
                if (path.existsSync(soPath) && path.existsSync(apiNativeDir)) {
                    soFiles = utils.listFiles(soPath, function (file) {
                        return path.extname(file) === ".so";
                    });
                    
                    soFiles.forEach(function (soFile) {
                        utils.copyFile(soFile, soDest, soPath);
                    });
                }
            });
        });
    }
}

module.exports = function (src, baton) {
    var libDest = path.join(_c.DEPLOY, 'lib'),
        extDest = path.join(_c.DEPLOY, 'ext'),
        clientFilesDest = path.join(_c.DEPLOY, 'clientFiles'),
        bootstrapDest = path.join(_c.DEPLOY, 'dependencies/bootstrap'),
        browserRequireDest = path.join(_c.DEPLOY, 'dependencies/bootstrap/'),
        webplatformDest = path.join(_c.DEPLOY, 'dependencies/bootstrap/'),
        
        //files
        readmeFile = path.join(_c.ROOT, 'README.md'),
        licenseFile = path.join(_c.ROOT, 'LICENSE');

    require('./bundler').bundle();

    //Copy folders to target directory
    copyFolder(_c.LIB, libDest);
    copyExtensions(_c.EXT, extDest);
    copyFolder(_c.CLIENTFILES, clientFilesDest);
    copyFolder(_c.DEPENDENCIES_BOOTSTRAP, bootstrapDest);
    
    //Copy files to target directory (DO NOT copy webplatform-framework lib/* files over)
    utils.copyFile(_c.DEPENDENCIES_WEBPLATFORM_FRAMEWORK_REQUIRE, browserRequireDest);
    utils.copyFile(_c.DEPENDENCIES_WEBPLATFORM_FRAMEWORK_LIB, webplatformDest);
    utils.copyFile(readmeFile, _c.DEPLOY);
    utils.copyFile(licenseFile, _c.DEPLOY);
    
    //Remove public folder
    wrench.rmdirSyncRecursive(_c.DEPLOY + 'lib/public', true);
};
