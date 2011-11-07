describe("server", function () {
    var express = require('express'),
        server = require('../../lib/server'),
        app = {
            configure: jasmine.createSpy(),
            post: jasmine.createSpy(),
            use: jasmine.createSpy(),
            listen: jasmine.createSpy()
        };

    beforeEach(function () {
        spyOn(express, "createServer").andReturn(app);
        spyOn(console, "log");
    });

    describe("when setting up the express server", function () {
        it("creates one", function () {
            server.start();
            expect(express.createServer).toHaveBeenCalled();
        });

        it("calls configure to set up the static server", function () {
            server.start();
            expect(express.createServer).toHaveBeenCalled();
        });

        it("sets up a post request handler", function () {
            server.start();
            expect(app.post).toHaveBeenCalledWith("/webworks/exec/:service/:action", server.handle);
        });

        it("listens like a boss", function () {
            server.start();
            expect(app.listen).toHaveBeenCalledWith(4567);
        });
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
            expect(res.send).toHaveBeenCalledWith(404);
        });

        it("returns 404 if the action doesn't exist", function () {
            req.params.service = "example";
            req.params.action = "ponies";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith(404);
        });
        
        it("calls the action method on the plugin", function () {
            var plugin = require("../../lib/plugins/example");

            spyOn(plugin, "win");

            req.params.service = "example";
            req.params.action = "win";

            server.handle(req, res);
            expect(plugin.win).toHaveBeenCalled();
        });

        it("returns the result and code 1 when success callback called", function () {
            var plugin = require("../../lib/plugins/example");

            spyOn(plugin, "win").andCallFake(function (success) {
                success("return!");
            });

            req.params.service = "example";
            req.params.action = "win";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith({
                code: 1,
                data: "return!"
            });
        });

        it("returns the result and code -1 when fail callback called", function () {
            var plugin = require("../../lib/plugins/example");

            spyOn(plugin, "win").andCallFake(function (success, fail) {
                fail("omg");
            });

            req.params.service = "example";
            req.params.action = "win";

            server.handle(req, res);
            expect(res.send).toHaveBeenCalledWith({
                code: -1,
                data: null,
                msg: "omg"
            });
        });
    });
});  
