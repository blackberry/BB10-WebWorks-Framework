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
var path = require("path"),
    conf = require("../../../build/build/conf"),
    settings = conf.COMMAND_DEFAULTS,
    input = path.join(__dirname, "..", "Apps"),
    wrench = require("wrench"),
    output = path.normalize(path.join(conf.ROOT, conf.COMMAND_DEFAULTS.output_folder)),
    cliTest = require('../helpers/CLITest'),
    DeployTest = require('../helpers/DeployTest'),
    flag;

describe("whitelist", function () {
    beforeEach(function () {
        flag = false;
        wrench.rmdirSyncRecursive(output, true);
        wrench.mkdirSyncRecursive(output, "0755");
    });

    afterEach(function () {
        wrench.rmdirSyncRecursive(output, true);
        wrench.mkdirSyncRecursive(output, "0755");
    });

    it("runs the disable websecurity tests", function () {
        cliTest.addOption(path.join(input, "DisableWebSecurity"));
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
                dt = new DeployTest(path.join(output, "device", "DisableWebSecurity.bar"));
                dt.listen(function (request) {
                    if (request.status === 'finished') {
                        cliTest.reportRunnerFinished("DisableWebSecurity", request.data);
                        flag = true;
                    } else if (request.status === "SuiteResults") {
                        cliTest.reportSuiteResults(request.data);
                    } else if (request.status === "SpecResults") {
                        cliTest.reportSpecResults(request.data);
                    } else if (request.status === "RunnerStarting") {
                        cliTest.reportRunnerStarting("DisableWebSecurity");
                    }
                });
                dt.startServer();
                dt.deploy();
            });
            waitsFor(function () {
                return flag;
            }, "Something", 100000);

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

    it("runs the disable websecurity tests", function () {
        cliTest.addOption(path.join(input, "SubfolderStartupPage"));
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
                dt = new DeployTest(path.join(output, "device", "SubfolderStartupPage.bar"));
                dt.listen(function (request) {
                    if (request.status === 'finished') {
                        cliTest.reportRunnerFinished("SubfolderStartupPage", request.data);
                        flag = true;
                    } else if (request.status === "SuiteResults") {
                        cliTest.reportSuiteResults(request.data);
                    } else if (request.status === "SpecResults") {
                        cliTest.reportSpecResults(request.data);
                    } else if (request.status === "RunnerStarting") {
                        cliTest.reportRunnerStarting("SubfolderStartupPage");
                    }
                });
                dt.startServer();
                dt.deploy();
            });
            waitsFor(function () {
                return flag;
            }, "Something", 100000);

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

    it("runs the wildcard domain tests", function () {
        cliTest.addOption(path.join(input, "WildcardDomain"));
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
                dt = new DeployTest(output + "/device/WildcardDomain.bar");
                dt.listen(function (request) {
                    if (request.status === 'finished') {
                        cliTest.reportRunnerFinished("WildcardDomain", request.data);
                        flag = true;
                    } else if (request.status === "SuiteResults") {
                        cliTest.reportSuiteResults(request.data);
                    } else if (request.status === "SpecResults") {
                        cliTest.reportSpecResults(request.data);
                    } else if (request.status === "RunnerStarting") {
                        cliTest.reportRunnerStarting("WildcardDomain");
                    }
                });
                dt.startServer();
                dt.deploy();
            });
            waitsFor(function () {
                return flag;
            }, "Something", 100000);

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
