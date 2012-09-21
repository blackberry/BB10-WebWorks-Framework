/*
 * Copyright 2010-2011 Research In Motion Limited.
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

describe("default plugin", function () {
    var defaultPlugin = require('../../../../lib/plugins/default'),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist,
        testExtension = require("../../../../ext/app/index"),
        utils = require("../../../../lib/utils");

    beforeEach(function () {
        spyOn(console, "log");
        spyOn(utils, "loadModule").andCallFake(function (module) {
            // on device, "ext/blackberry.app/index.js" would exist since packager would
            // name the extension folder with feature id in compilation time,
            // but in unit test environment, it's the real extension folder being used
            module = "../../../" + module.replace("blackberry.", "");
            return require(module);
        });
    });

    describe("when handling requests", function () {
        var req, res, succ, fail, args;

        beforeEach(function () {
            req = {
                origin: "http://www.origin.com",
                params: {}
            };
            res = {
                send: jasmine.createSpy()
            };
            succ = jasmine.createSpy();
            fail = jasmine.createSpy();
            args = {};

            GLOBAL.frameworkModules = ["ext/blackberry.app/index.js"];
        });

        afterEach(function () {
            delete GLOBAL.frameworkModules;
        });

        it("returns 404 if the extension is not found", function () {
            req.params.ext = "NotAnExt";
            defaultPlugin.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
        });

        it("returns 404 if the method is not found", function () {
            req.params.ext = "blackberry.app";
            req.params.method = "NotAMethod";
            defaultPlugin.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
        });

        it("checks if the feature is white listed if it exists", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "author");

            req.params.ext = "blackberry.app";
            req.params.method = "author";

            defaultPlugin.exec(req, res, succ, fail, args);
            expect(fail).wasNotCalled();
            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith(req.origin, req.params.ext);
        });


        it("returns 403 if the feature is not white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);

            req.params.ext = "blackberry.app";
            req.params.method = "author";

            defaultPlugin.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 403);
        });

        it("calls the method of the extension", function () {
            var env = {"request": req, "response": res};

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "author");

            req.params.ext = "blackberry.app";
            req.params.method = "author";

            defaultPlugin.exec(req, succ, fail, args, env);

            expect(testExtension.author).toHaveBeenCalledWith(succ, fail, args, env);
        });

        it("calls a multi-level method of the extension", function () {
            var env = {"request": req, "response": res};

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "author");
            testExtension.author.a = {
                b : {
                    c : jasmine.createSpy()
                }
            };

            req.params.ext = "blackberry.app";
            req.params.method = "author/a/b/c";

            defaultPlugin.exec(req, succ, fail, args, env);

            expect(fail).wasNotCalled();
            expect(testExtension.author.a.b.c).toHaveBeenCalledWith(succ, fail, args, env);
        });

        it("throws a 404 is a multi-level method is not found", function () {
            var env = {"request": req, "response": res};

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "author");
            testExtension.author.a = {
            };

            req.params.ext = "blackberry.app";
            req.params.method = "author/a/b/c";

            defaultPlugin.exec(req, succ, fail, args, env);

            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
        });
    });
});
