describe("webview", function () {
    var webview = require('webview'),
        RIPPLE_LOCATION = '/Applications/Research In Motion/Ripple 0.9.0.11/Ripple.app/Contents/MacOS/Ripple',
        childProcess = require('child_process'),
        ripple;

    beforeEach(function () {
        ripple = {
            stdout: {
                on: jasmine.createSpy()
            },
            stderr: {
                on: jasmine.createSpy()
            },
            on: jasmine.createSpy(),
            kill: jasmine.createSpy()
        };
        spyOn(childProcess, "spawn").andReturn(ripple);
        spyOn(console, "log");
    });

    afterEach(function () {
        webview.destroy();
    });

    it("can create a webview", function () {
        webview.create();
        expect(childProcess.spawn).toHaveBeenCalled();
        expect(childProcess.spawn.argsForCall[0][0]).toEqual(RIPPLE_LOCATION);
        expect(ripple.on).toHaveBeenCalled();
        expect(ripple.on.argsForCall[0][0]).toEqual("exit");
    });

    it("can destroy a webview", function () {
        webview.create();
        webview.destroy();
        expect(ripple.kill).toHaveBeenCalled();
    });

    it("only spawns one webview at a time", function () {
        webview.create();
        webview.create();
        expect(childProcess.spawn.callCount).toEqual(1);
    });
});  
