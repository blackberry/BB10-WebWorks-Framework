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
var input = __dirname + "/../Apps",
    wrench = require("wrench"),
    output = __dirname + "/../data/output",
    path = require("path"),
    cliTest,
    cliTest = require('../helpers/CLITest'),
    DeployTest = require('../helpers/DeployTest'),
    utils = require('../../../build/build/utils'),
    flag,
    settings = require('../../../test-runner.json');

describe("functional tests", function () {
    beforeEach(function () {
        flag = false;
        wrench.rmdirSyncRecursive(output, true);
        wrench.mkdirSyncRecursive(output, "0755");
    });

    afterEach(function () {
        wrench.rmdirSyncRecursive(output, true);
        wrench.mkdirSyncRecursive(output, "0755");
    });

    it("runs the functional test app", function () {
        flag = false;
        cliTest.execCmd("jake test-app", function () {
            flag = true;
        });
        waitsFor(function () {
            return flag;
        }, "Something", 100000);

        runs(function () {
            var testAppSrc = path.normalize(__dirname + "/../../test-app/"),
                testAppDst = path.normalize(input + "/wwTest-automation/"),
                flag = false;

            utils.copyFolder(path.join(testAppSrc, "js"), path.join(testAppDst, "js"), undefined, true);
            utils.copyFolder(path.join(testAppSrc, "css"), path.join(testAppDst, "css"), undefined, true);
            utils.copyFile(path.join(testAppSrc, "config.xml"), testAppDst, undefined, true);
            utils.cp(path.join(testAppSrc, "automation","SpecRunner.htm"), path.join(testAppDst, "index.html"));
            wrench.copyDirSyncRecursive(path.join(testAppSrc, "automation", "spec"), path.join(testAppDst, "spec"));

            cliTest.addOption(testAppDst);
            cliTest.addOption("-d");
            cliTest.addOption("-o", output);
            cliTest.run(settings.packager, function () {
                flag = true;
            });

            waitsFor(function () {
                return flag;
            }, "Something", 100000);

            runs(function () {
                var reqData = [],
                flag = false,
                dt;
                runs(function () {
                    dt = new DeployTest(output + "/device/wwTest-automation.bar");
                    dt.listen(function (request) {
                        if (request.status === 'finished') {
                            cliTest.reportRunnerFinished("Functional Tests", request.data);
                            flag = true;
                        } else if (request.status === "SuiteResults") {
                            cliTest.reportSuiteResults(request.data);
                        } else if (request.status === "SpecResults") {
                            cliTest.reportSpecResults(request.data);
                        } else if (request.status === "RunnerStarting") {
                            cliTest.reportRunnerStarting("Functional Tests");
                        }
                    });
                    dt.startServer();
                    dt.deploy();
                });
                waitsFor(function () {
                    return flag;
                }, "Something", 1000000);

                runs(function () {
                    var flag = false;
                    dt.terminate(function () {
                        flag = true;
                    });
                    waitsFor(function () {
                        return flag;
                    });
                    runs(function () {
                    });
                });
            });
        });
    });
});
