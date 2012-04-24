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

describe("bridge", function () {
    var bridge = require('../../../../lib/plugins/bridge'),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist,
        testExtension = require("../../../../ext/blackberry.app/index");

    beforeEach(function () {
        spyOn(console, "log");
    });

    describe("when handling requests", function () {
        var req, res, succ, fail, args;

        beforeEach(function () {
            req = {
                params: {}
            };
            res = {
                send: jasmine.createSpy()
            };
            succ = jasmine.createSpy();
            fail = jasmine.createSpy();
            args = {};
        });

        it("checks if the feature is white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

            bridge.exec(req, res, succ, fail, args);
            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        });

        it("returns 404 if the feature is not found", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

            req.params.ext = "IDoNotExist";

            bridge.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
        });

        it("returns 403 if the feature is not white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);

            bridge.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 403);
        });

        it("calls the action method of the feature", function () {
            var env = {"request": req, "response": res};

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "author");

            req.params.ext = "blackberry.app";
            req.params.method = "author";

            bridge.exec(req, succ, fail, args, env);

            expect(testExtension.author).toHaveBeenCalledWith(succ, fail, args, env);
        });
    });
});
