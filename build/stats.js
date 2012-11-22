/*
 *  Copyright 2011 Research In Motion Limited.
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
module.exports = function () {
    var util = require('util'),
        libs = [],
        exts = [],
        tests = [],
        total_lines = 0,
        total_loc = 0,
        ext_loc = 0,
        ext_lines = 0,
        lib_loc = 0,
        lib_lines = 0,
        test_loc = 0,
        test_lines = 0,
        emptySpace,
        testsOverLib;

    function spaces(number) {
        var str = "", i;
        for (i = 0; i < number; i++) {
            str += " ";
        }
        return str;
    }

    function parseFile(file, callback) {
        var lines = 0,
            loc = 0;

        if (file.match(/\.cpp$/) || file.match(/\.hpp$/) || file.match(/\.js$/)) {
            // hack!
            require('fs').readFileSync(file, "utf-8").replace(/\n$/, '').split("\n").forEach(function (line) {
                lines++;
                if (line !== "" && !line.match(/^\s*(\/\/.*)?$/)) {
                    loc++;
                }
            });

            file = file.replace(/\.js$/, '')
                        .replace(/\.hpp$/, '')
                        .replace(/\.cpp$/, '')
                        .replace(/^.*test\//, '');

            util.puts("| " + file + spaces(59 - file.length) + "| " +
                    lines + spaces(7 - String(lines).length) + "| " +
                    loc + spaces(7 - String(loc).length) + "|");

            callback(lines, loc);
        }
    }

    function collect(path, files) {
        var fs = require('fs');
        if (fs.statSync(path).isDirectory()) {
            fs.readdirSync(path).forEach(function (item) {
                collect(require('path').join(path, item), files);
            });
        } else if (path.match(/\.cpp$/) || path.match(/\.hpp$/) || path.match(/\.js$/)) {
            files.push(path);
        }
    }

    collect(__dirname + "/../lib/", libs);
    collect(__dirname + "/../test/", tests);
    collect(__dirname + "/../ext/", exts);

    libs.sort();
    tests.sort();
    exts.sort();

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.puts("| Lib                                                        | Lines  | LOC    |");
    util.puts("+------------------------------------------------------------+--------+--------+");

    libs.forEach(function (lib) {
        parseFile(lib, function (lines, loc) {
            lib_lines += lines;
            lib_loc += loc;
        });
    });

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.print("| Total                                                      |");
    util.print(" " + lib_lines + spaces(7 - String(lib_lines).length) + "|");
    util.puts(" " + lib_loc + spaces(7 - String(lib_loc).length) + "|");
    util.puts("+------------------------------------------------------------+--------+--------+");

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.puts("| Exts                                                        | Lines  | LOC   |");
    util.puts("+------------------------------------------------------------+--------+--------+");

    exts.forEach(function (ext) {
        parseFile(ext, function (lines, loc) {
            ext_lines += lines;
            ext_loc += loc;
        });
    });

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.print("| Total                                                      |");
    util.print(" " + ext_lines + spaces(7 - String(ext_lines).length) + "|");
    util.puts(" " + ext_loc + spaces(7 - String(ext_loc).length) + "|");
    util.puts("+------------------------------------------------------------+--------+--------+");

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.puts("| Tests                                                      | Lines  | LOC    |");
    util.puts("+------------------------------------------------------------+--------+--------+");

    tests.forEach(function (test) {
        parseFile(test, function (lines, loc) {
            test_lines += lines;
            test_loc += loc;
        });
    });

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.print("| Total                                                      |");
    util.print(" " + test_lines + spaces(7 - String(test_lines).length) + "|");
    util.puts(" " + test_loc + spaces(7 - String(test_loc).length) + "|");
    util.puts("+------------------------------------------------------------+--------+--------+");

    total_lines = lib_lines + test_lines;
    total_loc = lib_loc + test_loc;
    testsOverLib = (lib_loc / test_loc).toFixed(2);
    emptySpace = total_lines - total_loc;

    util.puts("+------------------------------------------------------------+--------+--------+");
    util.puts("| Stats                                                                        |");
    util.puts("+------------------------------------------------------------+--------+--------+");
    util.puts("| lines: " + total_lines + spaces(70 - String(total_lines).length) + "|");
    util.puts("| loc: " + total_loc + spaces(72 - String(total_loc).length) + "|");
    util.puts("| lib/test (loc): " + testsOverLib + spaces(61 - String(testsOverLib).length) + "|");
    util.puts("| comments & empty space: " + emptySpace + spaces(53 - String(emptySpace).length) + "|");
    util.puts("+------------------------------------------------------------+--------+--------+");
};
