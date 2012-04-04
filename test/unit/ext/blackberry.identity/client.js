var _ID = "blackberry.identity",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + _ID,
    client,
    mockedWebworks = {
        execSync: jasmine.createSpy()
    },
    fields = [
        "uuid"
    ],
    execSyncArgs = [];

beforeEach(function () {
    GLOBAL.window = GLOBAL;
    GLOBAL.window.webworks = mockedWebworks;

    fields.forEach(function (field) {
        execSyncArgs.push([_ID, field, null]);
    });

    client = require(_apiDir + "/client");
});

afterEach(function () {
    delete GLOBAL.window;
    client = null;
});

describe("blackberry.identity client", function () {
    it("execSync should have been called once for each blackberry.identity field", function () {
        expect(mockedWebworks.execSync.callCount).toEqual(fields.length);
    });

    describe("uuid", function () {
        it("should call execSync", function () {
            expect(mockedWebworks.execSync.argsForCall).toContain(execSyncArgs[fields.indexOf("uuid")]);
        });
    });
});