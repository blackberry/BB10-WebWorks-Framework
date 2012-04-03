describe("bridge", function () {
    var bridge = require('../../../../lib/plugins/bridge'),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist,
        testExtension = require("../../../../ext/blackberry.example.test/index");

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
            expect(fail).toHaveBeenCalledWith(404, jasmine.any(String));
        });

        it("returns 403 if the feature is not white listed", function () {
            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(false);

            bridge.exec(req, succ, fail, args);
            expect(fail).toHaveBeenCalledWith(403, jasmine.any(String));
        });

        it("calls the action method of the feature", function () {
            var env = {"request": req, "response": res};

            spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);
            spyOn(testExtension, "helloworld");

            req.params.ext = "blackberry.example.test";
            req.params.method = "helloworld";

            bridge.exec(req, succ, fail, args, env);

            expect(testExtension.helloworld).toHaveBeenCalledWith(succ, fail, args, env);
        });
    });
});
