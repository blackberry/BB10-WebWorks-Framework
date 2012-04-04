var _apiDir = __dirname + "./../../../../ext/blackberry.identity/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    ppsUtils,
    mockedPPS,
    path = "/pps/services/private/deviceproperties",
    mode = "0";

describe("blackberr.identity index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
        mockedPPS = {
            init: jasmine.createSpy(),
            open: jasmine.createSpy().andReturn(true),
            read: jasmine.createSpy().andReturn({"devicepin": "abcdefg"}),
            close: jasmine.createSpy()
        };
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        ppsUtils = null;
        index = null;
        mockedPPS = null;
    });

    describe("uuid", function () {
        it("can call success with devicepin", function () {
            var success = jasmine.createSpy();

            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.uuid(success, null, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith("abcdefg");
        });

        it("can call fail if failed to open PPS object", function () {
            var fail = jasmine.createSpy();

            mockedPPS.open = jasmine.createSpy().andReturn(false);
            spyOn(ppsUtils, "createObject").andReturn(mockedPPS);

            index.uuid(null, fail, null, null);

            expect(mockedPPS.init).toHaveBeenCalled();
            expect(mockedPPS.open).toHaveBeenCalledWith(path, mode);
            expect(mockedPPS.read).not.toHaveBeenCalled();
            expect(mockedPPS.close).toHaveBeenCalled();            
            expect(fail).toHaveBeenCalled();
        });
    });
});