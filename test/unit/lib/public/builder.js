var libRoot = __dirname + "/../../../../lib/",
    builder = require(libRoot + "public/builder"),
    mockedWebworks = {
        exec : function () {},
        execSync: function () { return ""; }
    };

describe("builder", function () {

    beforeEach(function () {
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;
    });

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