var srcPath = __dirname + '/../../lib/';

describe("framework", function () {
    var framework = require(srcPath + 'framework'),
        webview = require('../../dependencies/BBX-Emulator/lib/webview.js'),
        emulator_webview;

    beforeEach(function () {
        emulator_webview = {
            create: jasmine.createSpy(),
            destroy: jasmine.createSpy(),
            setURL: jasmine.createSpy()
        };
   
        spyOn(webview, "create").andReturn(emulator_webview.create);
        spyOn(webview, "destroy").andReturn(emulator_webview.destroy);
        spyOn(webview, "setURL").andReturn(emulator_webview.location);
        spyOn(console, "log");
    });

    afterEach(function () {
        framework.stopWebview();
    });

    it("can start a webview instance", function () {
        framework.startWebview();
        expect(webview.create).toHaveBeenCalled();
    });

    it("can start a webview instance with a url", function () {
        var url = 'http://www.google.com';
        framework.startWebview();
        framework.setURL(url);
        expect(webview.setURL).toHaveBeenCalledWith(url);
    });

    it("can stop a webview instance", function () {
        framework.startWebview();
        framework.stopWebview();
        expect(webview.destroy).toHaveBeenCalled();
    });
});  
