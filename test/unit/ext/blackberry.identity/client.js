var _ID = "blackberry.identity",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {},
    fields = [
        "uuid"
    ],
    execSyncArgs = [];

beforeEach(function () {
    GLOBAL.window = GLOBAL;

    fields.forEach(function (field) {
        execSyncArgs.push([_ID, field, null]);
    });
});

afterEach(function () {
    execSyncArgs = [];
    delete GLOBAL.window;
});

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("blackberry.identity client", function () {
    describe("when user has specified correct permission", function () {
        beforeEach(function () {
            mockedWebworks.execSync = jasmine.createSpy().andReturn("0x12345678");
            GLOBAL.window.webworks = mockedWebworks;
            // client needs to be required for each test
            client = require(_apiDir + "/client");
        });

        afterEach(unloadClient);

        it("execSync should have been called once for each blackberry.identity field", function () {
            expect(mockedWebworks.execSync.callCount).toEqual(fields.length);
        });

        it("uuid should call execSync and equal to execSync return value", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("uuid")]);
            expect(client.uuid).toEqual("0x12345678");
        });
    });

    describe("when user hasn't specified correct permission", function () {
        beforeEach(function () {
            spyOn(console, "error");
            mockedWebworks.execSync = jasmine.createSpy().andThrow("Cannot read PPS object"); 
            GLOBAL.window.webworks = mockedWebworks;
            client = require(_apiDir + "/client");
        });

        afterEach(unloadClient);

        it("uuid should call execSync and catch error and return null", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("uuid")]);
            expect(client.uuid).toEqual(null);
        });
    });
});