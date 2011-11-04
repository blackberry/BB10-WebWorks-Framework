var srcPath = __dirname + '/../../lib/';

describe("framework", function () {
    var framework = require(srcPath + 'framework'),
        webview = require('../../dependencies/BBX-Emulator/lib/webview.js'),
        emulator_webview = {
            create: jasmine.createSpy(),
            destroy: jasmine.createSpy(),
            setURL: jasmine.createSpy()
        };

    beforeEach(function () {
        spyOn(webview, "create").andCallFake(function (done) {
            done();
        });
        spyOn(webview, "destroy").andReturn(emulator_webview);
        spyOn(webview, "setURL").andReturn(emulator_webview);
        spyOn(console, "log");
    });

    it("can start a webview instance", function () {
        framework.startWebview();
        expect(webview.create).toHaveBeenCalled();
    });

    it("can start a webview instance with a url", function () {
        var url = 'http://www.google.com';
        framework.startWebview(url);
        expect(webview.setURL).toHaveBeenCalledWith(url);
    });

    it("can stop a webview instance", function () {
        framework.startWebview();
        framework.stopWebview();
        expect(webview.destroy).toHaveBeenCalled();
    });
});
