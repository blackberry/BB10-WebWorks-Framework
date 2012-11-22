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
var utils = require("./utils"),
    jWorkflow = require("jWorkflow"),
    _c = require("./conf");

module.exports = function (ip, fileName) {
    var cmd = "scp root@" + ip + ":/accounts/1000/shared/camera/WebWorksScreenShot.bmp test/data/automation/ReferenceImages/" + fileName;
    return function (prev, baton) {
        var build = jWorkflow.order();
        baton.take();
        build = build.andThen(utils.execCommandWithJWorkflow(cmd));

        build.start(function (error) {
            if (error) {
                baton.drop(error);
            }
        });
    };
};
