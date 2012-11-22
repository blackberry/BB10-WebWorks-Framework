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
var wrench = require("wrench"),
    fs = require("fs"),
    path = require("path"),
    _c = require("./conf"),
    pp = require("./preprocessor");

module.exports = function (preprocessDefs, paths) {
    return  function (prev, baton) {
        var files = [];

        baton.take();
        //get list of files that need to be precompiled
        function collect(dir, files) {
            if (fs.statSync(dir).isDirectory()) {
                fs.readdirSync(dir).forEach(function (item) {
                    collect(path.join(dir, item), files);
                });
            } else if (dir.match(/\.js$/)) {
                files.push(dir);
            }
        }
        if (!paths) {
            collect(_c.DEPLOY_LIB, files);
            collect(_c.DEPLOY_EXT, files);
        } else {
            paths.forEach(function (path) {
                collect(path, files);
            });
        }
        files.forEach(function (file) {
            //fork and start a node process and produce the output file.
            file = path.normalize(file);
            var temp = file + "-temp",
                fileBuffer,
                options = {
                    defines: preprocessDefs,
                    src: file,
                    dst: temp
                };

            pp.preprocess(options);

            fileBuffer = fs.readFileSync(temp);

            fs.writeFileSync(file, fileBuffer);

            fs.unlinkSync(temp);
        });

        baton.pass();
    };
};
