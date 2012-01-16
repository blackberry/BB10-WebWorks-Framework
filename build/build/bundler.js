var fs = require('fs');

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
            filepath;

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //include require
        output += include("dependencies/browser-require/require.js");

        //include modules
        output += include(files, function (file, path) {
            return "require.define('" + path.replace(/lib\/public\//, "").replace(/\.js$/, "") +
                   "', function (require, module, exports) {\n" + file + "});\n";
        });

        //include window.webworks
        output += include("lib/public/window-webworks.js");

        filepath = __dirname.replace(/\\/g, '/');
        fs.writeFileSync(filepath + "/../../lib/public/webworks.js", output);
    }
};