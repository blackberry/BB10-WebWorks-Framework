var _apiDir = __dirname + "./../../../../ext/blackberry.app/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    config;

describe("blackberr.app index", function () {

    beforeEach(function () {
        config = require(_libDir + "config");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        config = null;
        index = null;
    });

    describe("author", function () {
        it("can call success with author", function () {
            var success = jasmine.createSpy();
            index.author(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.author);
        });
    });

    describe("authorEmail", function () {
        it("can call success with authorEmail", function () {
            var success = jasmine.createSpy();
            index.authorEmail(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.authorEmail);
        });
    });

    describe("authorURL", function () {
        it("can call success with authorURL", function () {
            var success = jasmine.createSpy();
            index.authorURL(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.authorURL);
        });
    });

    describe("copyright", function () {
        it("can call success with copyright", function () {
            var success = jasmine.createSpy();
            index.copyright(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.copyright);
        });
    });

    describe("description", function () {
        it("can call success with description", function () {
            var success = jasmine.createSpy();
            index.description(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.description);
        });
    });

    describe("id", function () {
        it("can call success with id", function () {
            var success = jasmine.createSpy();
            index.id(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.id);
        });
    });

    describe("license", function () {
        it("can call success with license", function () {
            var success = jasmine.createSpy();
            index.license(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.license);
        });
    });

    describe("licenseURL", function () {
        it("can call success with licenseURL", function () {
            var success = jasmine.createSpy();
            index.licenseURL(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.licenseURL);
        });
    });

    describe("name", function () {
        it("can call success with name", function () {
            var success = jasmine.createSpy();
            index.name(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.name);
        });
    });

    describe("version", function () {
        it("can call success with version", function () {
            var success = jasmine.createSpy();
            index.version(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.version);
        });
    });
});
