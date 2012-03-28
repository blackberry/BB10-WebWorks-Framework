var root = __dirname + "/../../../../",
    Whitelist = require(root + "lib/policy/whitelist").Whitelist,
    sysIndex = require(root + "ext/blackberry.system/index");

describe("blackberry.system index", function () {
    it("hasPermission", function () {
        var success = jasmine.createSpy(),
            env = {
                "request": {
                    "origin": "blah"
                },
                "response": {
                }
            };

        spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

        sysIndex.hasPermission(success, undefined, {"module": "blackberry.system"}, env);

        expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(0);
    });
});