var srcPath = __dirname + '/../../lib/';

describe("framework", function () {
    var framework = require(srcPath + 'framework'),
        webview = require('../../dependencies/BBX-Emulator/lib/webview.js'),
        mock_request = {
            url: "http://www.dummy.com",
            allow: jasmine.createSpy(),
            deny: jasmine.createSpy()
        };
        
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
        framework.startWebview();
        expect(webview.create).toHaveBeenCalled();
    });

    it("can start a webview instance with a url", function () {
        var url = "http://www.google.com";
        framework.startWebview(url);
        expect(webview.setURL).toHaveBeenCalledWith(url);
    });

    it("can stop a webview instance", function () {
        framework.startWebview();
        framework.stopWebview();
        expect(webview.destroy).toHaveBeenCalled();
    });

    it("can set the onRequest handler of the webview", function () {
        var url = "http://www.google.com";
        framework.startWebview(url);
        expect(webview.onRequest).toHaveBeenCalledWith(jasmine.any(Function));
    });
    
    it("can apply whitelist rules to allow requests", function () {
        var url = "http://www.google.com";
        framework.startWebview(url);
        expect(mock_request.allow).toHaveBeenCalled();
    });
});
