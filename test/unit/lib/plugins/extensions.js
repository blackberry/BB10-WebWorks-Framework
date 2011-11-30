describe("extensions", function () {
    var extensions = require("../../../../lib/plugins/extensions"),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist;

    beforeEach(function () {
        spyOn(console, "log");
    });

    describe("when handling get requests", function () {
        var req, succ, fail;

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
            
            req.params.ext = "blackberry.example.test";
            req.params.method = "helloworld";

            extensions.get(req, succ, fail);
            expect(succ).toHaveBeenCalledWith(["MyFeatureId"]);
        });
    });
});  
