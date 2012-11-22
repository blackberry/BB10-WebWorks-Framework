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
        fail,
        mockXHR;


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

        it("returns 412 when the client webworks.js is incompatible with the framework", function () {
            var reqWithHash = {
                params: {
                    ext: "?hash=2af67c1a4739f6f3f307dcc7601d35fc&version=1.0.0.7"//random hash/version for client webworks.js
                }
            };

            extensions.get(reqWithHash, succ, fail);
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 412);
        });
    });

    describe("load client", function () {
        beforeEach(function () {
            mockXHR = function () {};
            mockXHR.prototype = {
                open: jasmine.createSpy(),
                send: jasmine.createSpy(),
                responseText: "blah"
            };
            GLOBAL.XMLHttpRequest = mockXHR;
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
        afterEach(function () {
            delete GLOBAL.XMLHttpRequest;
        });

        it("sends xhr response text if feature is whitelisted", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith("GET", "ext/blackberry.app/client.js", false);
            expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(200, JSON.stringify({client: "blah", dependencies: []}));
        });


        xit("sends xhr respones text that includes client dependencies", function () {
            GLOBAL.XMLHttpRequest.prototype.open = jasmine.createSpy().andCallFake(function (method, url, async) {
                if (url.match("blackberry.app")) {
                    GLOBAL.XMLHttpRequest.prototype.responseText = "module.exports = { id: require('./manifest.json').namespace };";
                } else {
                    GLOBAL.XMLHttpRequest.prototype.responseText = "{\"namespace\": \"blackberry.app\"}";
                }
            });
            //TODO trouble mocking require.toUrl, had to comment out test case for now
            //require.toUrl = jasmine.createSpy("");

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith("GET", "ext/blackberry.app/client.js", false);
            expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(200, JSON.stringify({
                client: "module.exports = { id: require('./manifest.json').namespace };",
                dependencies: [{
                    moduleName: "ext/blackberry.app/manifest.json",
                    body: "{\"namespace\": \"blackberry.app\"}"
                }]
            }));
        });

        it("calls fail callback with HTTP 404 if whitelisted feature does not exist", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(console, "log");
            GLOBAL.XMLHttpRequest.prototype.send = jasmine.createSpy().andThrow("TOO BAD");

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String), 404);
            expect(console.log).toHaveBeenCalledWith("TOO BAD");
        });

        it("calls fail callback with HTTP 403 if feature is NOT whitelisted", function () {
            var errMsg = "Feature denied by whitelist";
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);
            spyOn(console, "log");

            extensions.load(req, succ, fail, undefined, {request: req, response: res});

            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalledWith("abc", "blackberry.app");
            expect(fail).toHaveBeenCalledWith(-1, errMsg, 403);
            expect(console.log).toHaveBeenCalledWith(errMsg + ": blackberry.app");
        });
    });
});
