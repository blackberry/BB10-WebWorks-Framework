var libRoot = __dirname + '/../../../lib/',
    builder = require(libRoot + 'public/builder');

describe("builder", function () {

    it("can build an object with a single member", function () {
        var featureIds = ['blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toBeDefined();
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.version).toBeDefined();
    });

    it("can build an object with a nested member", function () {
        var featureIds = ['blackberry.app', 'blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build with feature IDs provided in any order", function () {
        var featureIds = ['blackberry.app.event', 'blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build an object with only the nested member", function () {
        var featureIds = ['blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeUndefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build an object with multiple members", function () {
        var featureIds = ['blackberry.app', 'blackberry.system'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toBeDefined();
        expect(target.blackberry.system).toBeDefined();
    });
});