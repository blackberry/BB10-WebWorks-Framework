var root = __dirname + "/../../../../",
    sysClient = require(root + "ext/blackberry.system/client"),
    mockedWebworks = {
        exec : function () {},
        execSync: function () {}
    };

describe("blackberry.system client", function () {
    beforeEach(function () {
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;
    });

    it("hasPermission", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(0);

        result = sysClient.hasPermission("blackberry.app");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith("blackberry.system", "hasPermission", {"module": "blackberry.app"});
        expect(result).toEqual(0);
    });

    it("hasCapability", function () {
        var result;

        spyOn(mockedWebworks, "execSync").andReturn(true);

        result = sysClient.hasCapability("abc.def");

        expect(mockedWebworks.execSync).toHaveBeenCalledWith("blackberry.system", "hasCapability", {"capability": "abc.def"});
        expect(result).toBeTruthy();
    });

    it("ALLOW", function () {
        expect(sysClient.ALLOW).toEqual(0);
    });

    it("DENY", function () {
        expect(sysClient.DENY).toEqual(1);
    });
});