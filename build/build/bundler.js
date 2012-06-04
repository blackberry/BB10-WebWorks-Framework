var fs = require('fs'),
    path = require('path');

module.exports = {
    bundle: function () {
        var fs = require('fs'),
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
            output = "",
            version = fs.readFileSync("version", "utf-8").trim(),
            filepath;

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //Open closure
        output = "(function () { \n";

        //include require
        output += include("dependencies/require/require.js");

        //include modules
        output += include(files, function (file, path) {
            return "define('" + path.replace(/lib\/public\//, "").replace(/\.js$/, "") +
                   "', function (require, exports, module) {\n" + file + "});\n";
        });

        //include window.webworks
        output += include("lib/public/window-webworks.js");

        //Close closure
        output += "\n}());";

        //create output folder if it doesn't exist
        filepath = __dirname.replace(/\\/g, '/') + "/../../clientFiles";
        if (!path.existsSync(filepath)) {
            fs.mkdirSync(filepath, "0777"); //full permissions
        }
        fs.writeFileSync(filepath + "/webworks-" + version + ".js", output);
    }
};
