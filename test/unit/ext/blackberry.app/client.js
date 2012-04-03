var _ID = "blackberry.app",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {
        execSync: function () {}
    };

describe("blackberry.app client", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.webworks = mockedWebworks;

        spyOn(console, "log");

        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });

    describe("author", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.author);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "author", null);
        });
    });

    describe("authorEmail", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.authorEmail);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "authorEmail", null);
        });
    });

    describe("authorURL", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.authorURL);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "authorURL", null);
        });
    });

    describe("copyright", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.copyright);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "copyright", null);
        });
    });

    describe("description", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.description);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "description", null);
        });
    });

    describe("id", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.id);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "id", null);
        });
    });

    describe("license", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.license);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "license", null);
        });
    });

    describe("licenseURL", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.licenseURL);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "licenseURL", null);
        });
    });

    describe("name", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.name);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "name", null);
        });
    });

    describe("version", function () {
        it("should call execSync", function () {
            spyOn(mockedWebworks, "execSync");
            console.log(client.version);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "version", null);
        });
    });
});