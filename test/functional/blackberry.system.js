describe("blackberry.system", function () {
    it("blackberry.system should exist", function () {
        expect(blackberry.system).toBeDefined();
    });

    it("blackberry.system.ALLOW should exist", function () {
        expect(blackberry.system.ALLOW).toBeDefined(0);
    });

    it("blackberry.system.DENY should exist", function () {
        expect(blackberry.system.DENY).toBeDefined(1);
    });

    it("blackberry.system.hasPermission should exist", function () {
        expect(blackberry.system.hasPermission).toBeDefined();
    });

    it("blackberry.system.hasCapability should exist", function () {
        expect(blackberry.system.hasCapability).toBeDefined();
    });

    it("blackberry.system.hasPermission should return true for module in whitelist", function () {
        expect(blackberry.system.hasPermission("blackberry.system")).toBe(blackberry.system.ALLOW);
    });

    it("blackberry.system.hasPermission should return false for module not in whitelist", function () {
        expect(blackberry.system.hasPermission("blackberry.system.event")).toBe(blackberry.system.DENY);
    });

    it("blackberry.system.hasCapability should return true for wifi", function () {
        expect(blackberry.system.hasCapability("network.wlan")).toBeTruthy();
    });

    it("blackberry.system.hasCapability should return false for unknown capability", function () {
        expect(blackberry.system.hasCapability("bake.cookies")).toBeFalsy();
    });
});
