var _ID = "blackberry.invoke",
    _extDir = __dirname + "./../../../../ext",
    _libDir = __dirname + "./../../../../lib",
    _apiDir = _extDir + "/" + _ID,
    utils,
    client;


describe("blackberry.invoke client", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window  = {
            webworks : {
            }
        };
        utils = require(_libDir + "/utils");
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        utils = null;
        client = null;
    });

    describe("appType", function () {
        it("should return constant for appropriate appType", function () {
            expect(client.APP_CAMERA).toEqual(4);
            expect(client.APP_MAPS).toEqual(5);
            expect(client.APP_BROWSER).toEqual(11);
            expect(client.APP_MUSIC).toEqual(13);
            expect(client.APP_PHOTOS).toEqual(14);
            expect(client.APP_VIDEOS).toEqual(15);
            expect(client.APP_APPWORLD).toEqual(16);
        });
    });

    describe("Browser Invoke", function () {
        var url = "http://www.google.com";
        it("invoke should performExec", function () {
            spyOn(utils, "performExec");
            client.invoke(client.APP_BROWSER, new client.BrowserArguments(url));
            expect(utils.performExec).toHaveBeenCalledWith(_ID, "invoke", { 'appType' : client.APP_BROWSER, args : { 'url' : url } });
        });
    });

    describe("BrowserArguments", function () {
        var url = "http://www.google.com", 
            browserArguments;

        it("should create a new BrowserArguments Object with url", function () {
            browserArguments = new client.BrowserArguments(url);

            expect(browserArguments.url).toBeDefined();
        });
    });
});