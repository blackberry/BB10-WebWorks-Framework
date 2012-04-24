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

describe("extensions", function () {
    var extensions = require("../../../../lib/plugins/extensions"),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist,
        req,
        res,
        succ,
        fail;

    beforeEach(function () {
        spyOn(console, "log");
    });

    describe("when handling get requests", function () {
        beforeEach(function () {
            req = {
                params: {}
            };
            succ = jasmine.createSpy();
            fail = jasmine.createSpy();
        });
        
        it("gets the list of features for the request url", function () {
            spyOn(Whitelist.prototype, "getFeaturesForUrl");

            extensions.get(req, succ, fail);
            expect(Whitelist.prototype.getFeaturesForUrl).toHaveBeenCalled();
        });
        
        it("calls the success callback with featureIds", function () {
            spyOn(Whitelist.prototype, "getFeaturesForUrl").andReturn(["MyFeatureId"]);
            
            req.params.ext = "blackberry.identity";
            req.params.method = "uuid";

            extensions.get(req, succ, fail);
            expect(succ).toHaveBeenCalledWith(["MyFeatureId"]);
        });
    });

    describe("load client", function () {
        beforeEach(function () {
            GLOBAL.XMLHttpRequest = function () {};
            GLOBAL.XMLHttpRequest.prototype.open = jasmine.createSpy();
            GLOBAL.XMLHttpRequest.prototype.send = jasmine.createSpy();
            GLOBAL.XMLHttpRequest.prototype.responseText = "blah";
            req = {
                params: {
                    ext: "blackberry.app"
                },
                origin: "abc"
            };
            res = {
                send: jasmine.createSpy()
            };
            succ = jasmine.createSpy();
            fail = jasmine.createSpy();
        });

        it("sends xhr response text if feature is whitelisted", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith("GET", "ext/blackberry.app/client.js", false);
            expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(200, "blah");
        });

        it("calls fail callback with HTTP 404 if whitelisted feature does not exist", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            GLOBAL.XMLHttpRequest.prototype.send = jasmine.createSpy().andThrow("TOO BAD");

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
        });

        it("calls fail callback with HTTP 403 if feature is NOT whitelisted", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 403);
        });
    });
});  
