var srcPath = __dirname + '/../../../lib/';
var framework = require(srcPath + 'framework'),
    util = require(srcPath + "utils"),
    webview = util.requireWebview(),
    Whitelist = require(srcPath + 'policy/whitelist').Whitelist,
    mock_request = {
        url: "http://www.dummy.com",
        allow: jasmine.createSpy(),
        deny: jasmine.createSpy()
    };

describe("framework", function () {
    beforeEach(function () {
        spyOn(webview, "create").andCallFake(function (done) {
            done();
        });
        spyOn(webview, "destroy");
        spyOn(webview, "setURL");
        spyOn(webview, "onRequest").andCallFake(function (handler) {
            handler(mock_request);
        });

        spyOn(console, "log");
    });

    it("can start a webview instance", function () {
        framework.start();
        expect(webview.create).toHaveBeenCalled();
    });

    it("can start a webview instance with a url", function () {
        var url = "http://www.google.com";
        framework.start(url);
        expect(webview.setURL).toHaveBeenCalledWith(url);
    });

    it("can stop a webview instance", function () {
        framework.start();
        framework.stop();
        expect(webview.destroy).toHaveBeenCalled();
    });

    it("can set the onRequest handler of the webview", function () {
        var url = "http://www.google.com";
        framework.start(url);
        expect(webview.onRequest).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it("can access the whitelist", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(true);
        var url = "http://www.google.com";
        framework.start(url);
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
    });

    it("can apply whitelist rules and allow valid urls", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(true);
        var url = "http://www.google.com";
        framework.start(url);
        expect(mock_request.allow).toHaveBeenCalled();
    });

    it("can apply whitelist rules and deny blocked urls", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(false);
        var url = "http://www.google.com";
        framework.start(url);
        expect(mock_request.deny).toHaveBeenCalled();
    });
});
