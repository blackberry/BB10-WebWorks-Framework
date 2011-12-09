describe("server", function () {
    var server = require('../../../lib/server'),
        plugin = require("../../../lib/plugins/extensions");

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
        });

        it("returns 404 if the plugin doesn't exist", function () {
            req.params.service = "not";
            req.params.action = "here";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(404, jasmine.any(String));
        });

        it("returns 404 if the action doesn't exist", function () {
            req.params.service = "extensions";
            req.params.action = "ThisActionDoesNotExist";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(404, jasmine.any(String));
        });
        
        it("calls the action method on the plugin", function () {
            spyOn(plugin, "get");

            req.params.service = "extensions";
            req.params.action = "get";

            server.handle(req, res);
            expect(plugin.get).toHaveBeenCalled();
        });

        it("returns the result and code 1 when success callback called", function () {
            spyOn(plugin, "get").andCallFake(function (request, succ, fail, body) {
                succ(["MyFeatureId"]);
            });

            req.params.service = "extensions";
            req.params.action = "get";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(200, {
                code: 1,
                data: ["MyFeatureId"]
            });
        });

        it("returns the result and code -1 when fail callback called", function () {
            spyOn(plugin, "get").andCallFake(function (request, succ, fail, body) {
                fail("ErrorMessage", -1);
            });

            req.params.service = "extensions";
            req.params.action = "get";

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
                    featureId: "blackberry.app",
                    action: "author"
                },
                headers: {
                    host: ""
                },
                url: "",
                body: "" 
            };
            res = {
                send: jasmine.createSpy()
            };
        });
/*
        it("checks if the feature is white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            server.handleFeature(req, res);
            expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        });
        
        it("returns 403 if the feature is not white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);
            server.handleFeature(req, res);
            expect(res.send).toHaveBeenCalledWith(403);
        });
        
        it("calls the action method on the feature", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author");
            server.handleFeature(req, res);            
            expect(applicationAPIServer.author).toHaveBeenCalled();
        });
        
        it("returns the result and code 1 when success callback called", function () {
            var expectedResult = {"author": "Yogi bear"};
            
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author").andCallFake(function (success, fail) {
                success(expectedResult);
            });
            
            server.handleFeature(req, res);
            
            expect(res.send).toHaveBeenCalledWith({
                code: 1,
                data: expectedResult
            });
        });
        
        it("returns the result and code -1 when fail callback called", function () {
            var expectedResult = "omg";
            
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(applicationAPIServer, "author").andCallFake(function (success, fail) {
                fail(expectedResult);
            });
            
            server.handleFeature(req, res);
            
            expect(res.send).toHaveBeenCalledWith({
                code: -1,
                data: null,
                msg: expectedResult
            });
        });
*/      
    });
});  
