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
var fs = require('fs'),
    path = require('path');

module.exports = {
    bundle: function () {
        var fs = require('fs'),
            crypto = require('crypto'),
            shasum = crypto.createHash('md5'),
            files = [
                "lib/public/builder.js",
                "lib/public/window.js",
                "lib/public/event.js",
                "lib/utils.js",
                "lib/exception.js"
            ],
            include = function (files, transform) {
                files = files.map ? files : [files];
                return files.map(function (file) {
                    var str = fs.readFileSync(file, "utf-8") + "\n";
                    return transform ? transform(str, file) : str;
                }).join('\n');
            },
            transformCallback = function (file, path) {
                return "define('" + path.replace(/lib\/public\//, "").replace(/\.js$/, "") +
                       "', function (require, exports, module) {\n" + file + "});\n";
            },
            
            output = "",//webworks.js output
            clientFilesPath,
            wwVersion = fs.readFileSync("version", "utf-8").trim(),
            wwHash,
            wwInfoModule,
            
            //output sections
            pre_injection,
            hash_injection,
            post_injection;
            

        //include LICENSE
        pre_injection = include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //Open closure
        pre_injection += "(function () { \n";
        
        //include require
        pre_injection += include("dependencies/require/require.js");

        //include modules
        pre_injection += include(files, transformCallback);

        //include window.webworks
        post_injection = include("lib/public/window-webworks.js");

        //Close closure
        post_injection += "\n}());";
        
        //Hash the sections
        shasum.update((pre_injection + post_injection).replace(/\\r\\n/g, "\\n"));//convert CRLF to LF
        wwHash = shasum.digest('hex');
        
        wwInfoModule = "module.exports = {\n" +
            "\thash: \"" + wwHash + "\",\n" +
            "\tversion: \"" + wwVersion + "\"\n" +
            "};";
        
        //Create webworks-info to be placed in bar and respresent the framework version[hash].
        //This is neccessary to determine if the apps webworks.js is compatible with the framework.
        fs.writeFileSync(__dirname.replace(/\\/g, '/') + "/../../lib/webworks-info.js", wwInfoModule);
        
        //Inject a define into the webworks.js that will represent its version[hash]
        hash_injection = include(["lib/webworks-info.js"], transformCallback);
        
        //output
        output = pre_injection + hash_injection + post_injection;
        
        //create output folder if it doesn't exist
        clientFilesPath = __dirname.replace(/\\/g, '/') + "/../../clientFiles";
        if (!path.existsSync(clientFilesPath)) {
            fs.mkdirSync(clientFilesPath, "0777"); //full permissions
        }
        
        //Create webworks.js file
        fs.writeFileSync(clientFilesPath + "/webworks-" + wwVersion + ".js", output);
    }
};
