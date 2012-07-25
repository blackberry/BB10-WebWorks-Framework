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
var childProcess = require("child_process"),
    util = require("util"),
    jWorkflow = require("jWorkflow"),
    buildNative = require("./build/build-native"),
    test = require("./build/native-test");

function _done(error) {
    if (error) {
        util.puts("NATIVE TEST FAILED:\n" + error);
        process.exit(1);
    } else {
        util.puts("NATIVE TEST SUCCESS");
        process.exit();
    }
}

function _handle(func) {
    return function () {
        try {
            func.apply(func, Array.prototype.slice.call(arguments));
        } catch (e) {
            _done(e.message + "\n" + e.stack);
        }
    };
}

module.exports = _handle(function () {
    var build = jWorkflow.order(buildNative)
                         .andThen(test);

    build.start({
        initialValue: Array.prototype.slice.call(arguments),
        callback: function (error) {
            _done(error);
        },
        context: build
    });
});
