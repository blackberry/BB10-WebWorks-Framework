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

describe("server", function () {
    var server = require('../../../lib/server'),
        plugin = require("../../../lib/plugins/default"),
        extensionPlugin = require("../../../lib/plugins/extensions"),
        Whitelist = require("../../../lib/policy/whitelist").Whitelist,
        applicationAPIServer = require("../../../ext/blackberry.app/index"),
        DEFAULT_SERVICE = "exec";

    beforeEach(function () {
        spyOn(console, "log");
    });

    describe("when handling requests", function () {
        var req, res;

        beforeEach(function () {
            req = {
                params: {
                    service: "",
                    action: ""
                },
                body: "" 
            };
            res = {
                send: jasmine.createSpy()
            };
            GLOBAL.frameworkModules = ['ext/blackberry.app/index.js', 'lib/plugins/extensions.js', 'lib/plugins/default.js'];
        });

        afterEach(function () {
            delete GLOBAL.frameworkModules;
        });

        it("calls the default plugin if the service doesn't exist", function () {
            spyOn(plugin, DEFAULT_SERVICE);
            req.params.service = "not";
            req.params.action = "here";

            server.handle(req, res);
            expect(plugin[DEFAULT_SERVICE]).toHaveBeenCalled();
        });

        it("returns 404 if the action doesn't exist", function () {
            req.params.service = "default";
            req.params.action = "ThisActionDoesNotExist";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(404, jasmine.any(String));
        });
        
        it("calls the action method on the plugin", function () {
            spyOn(extensionPlugin, "get");

            req.params.service = "extensions";
            req.params.action = "get";

            server.handle(req, res);
            expect(extensionPlugin.get).toHaveBeenCalled();
        });

        it("returns the result and code 1 when success callback called", function () {
            spyOn(plugin, "exec").andCallFake(function (request, succ, fail, body) {
                succ(["MyFeatureId"]);
            });

            req.params.service = "default";
            req.params.action = "exec";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(200, {
                code: 1,
                data: ["MyFeatureId"]
            });
        });

        it("returns the result and code -1 when fail callback called", function () {
            spyOn(plugin, "exec").andCallFake(function (request, succ, fail, body) {
                fail(-1, "ErrorMessage");
            });

            req.params.service = "default";
            req.params.action = "exec";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(200, {
                code: -1,
                data: null,
                msg: "ErrorMessage"
            });
        });
    });
    
    describe("when handling feature requests", function () {       
        var req, res;

        beforeEach(function () {
            req = {
                params: {
                    service: "default",
                    action: "exec",
                    ext: "blackberry.app",
                    method: "author",
                    args: null,
                    origin: null
                },
                headers: {
                    host: ""
                },
                url: "",
                body: "",
                origin: "" 
            };
            res = {
                send: jasmine.createSpy()
            };
            GLOBAL.frameworkModules = ['ext/blackberry.app/index.js', 'lib/plugins/extensions.js', 'lib/plugins/default.js'];
        });

        afterEach(function () {
            delete GLOBAL.frameworkModules;
        });

        it("checks if the feature is white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            server.handle(req, res);
            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        });
        
        it("returns 403 if the feature is not white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);
            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(403, jasmine.any(Object));
        });
        
        it("calls the action method on the feature", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author");
            server.handle(req, res);            
            expect(applicationAPIServer.author).toHaveBeenCalled();
        });
        
        it("returns the result and code 1 when success callback called", function () {
            var expectedResult = {"author": "Yogi bear"};
            
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author").andCallFake(function (success, fail) {
                success(expectedResult);
            });
            
            server.handle(req, res);
            
            expect(res.send).toHaveBeenCalledWith(200, {
                code: 1,
                data: expectedResult
            });
        });
        
        it("returns the result and code -1 when fail callback called", function () {
            var expectedResult = "omg";
            
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author").andCallFake(function (success, fail) {
                fail(-1, expectedResult);
            });
            
            server.handle(req, res);
            
            expect(res.send).toHaveBeenCalledWith(200, {
                code: -1,
                data: null,
                msg: expectedResult
            });
        });
    });
});  
