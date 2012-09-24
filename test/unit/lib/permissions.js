describe("permissions", function () {
    var webview,
        libPath = "./../../../",
        mockedController,
        mockedWebview,
        mockedApplication,
        permissions = require(libPath + "lib/permissions"),
        config = require(libPath + "lib/config");

    beforeEach(function () {
        webview = require(libPath + "lib/webview");
        mockedController = {
            enableWebInspector: undefined,
            enableCrossSiteXHR: undefined,
            visible: undefined,
            active: undefined,
            setGeometry: jasmine.createSpy()
        };
        mockedWebview = {
            id: 42,
            enableCrossSiteXHR: undefined,
            visible: undefined,
            active: undefined,
            zOrder: undefined,
            url: undefined,
            setFileSystemSandbox: undefined,
            setGeometry: jasmine.createSpy(),
            setApplicationOrientation: jasmine.createSpy(),
            notifyApplicationOrientationDone: jasmine.createSpy(),
            onContextMenuRequestEvent: undefined,
            onNetworkResourceRequested: undefined,
            destroy: jasmine.createSpy(),
            executeJavaScript: jasmine.createSpy(),
            windowGroup: undefined,
            addEventListener: jasmine.createSpy(),
            enableWebEventRedirect: jasmine.createSpy(),
            allowGeolocation: jasmine.createSpy(),
            disallowGeolocation: jasmine.createSpy()
        };
        mockedApplication = {
            windowVisible: undefined
        };
        GLOBAL.qnx = {
            callExtensionMethod: jasmine.createSpy(),
            webplatform: {
                getController: function () {
                    return mockedController;
                },
                createWebView: function (options, createFunction) {
                    //process.nextTick(createFunction);
                    //setTimeout(createFunction,0);
                    if (typeof options === 'function') {
                        runs(options);
                    }
                    else {
                        runs(createFunction);
                    }
                    return mockedWebview;
                },
                getApplication: function () {
                    return mockedApplication;
                }
            }
        };
        GLOBAL.window = {
            qnx: qnx
        };
        GLOBAL.screen = {
            width : 1024,
            height: 768
        };
    });

    describe("init", function () {
        it("can set up a permissions object", function () {
            webview.create();
            waits(1);
            expect(permissions.init).toBeDefined();
            permissions.init(mockedWebview);
        });

        it("can check whether the onGeolocationPermissionRequest is defined", function () {
            expect(permissions.onGeolocationPermissionRequest).toBeDefined();
        });
    });

    describe("permissons tests", function () {

        beforeEach(function () {
            webview.create();
            waits(1);
            expect(permissions.init).toBeDefined();
            permissions.init(mockedWebview);
        });

        it("can call the onGeolocationPermissionRequest with permission properly to allow", function () {
            var request = '{ "origin" : "test.com" }';
            if (config && config.permissions) {
                config.permissions.push("read_geolocation");
            } else {
                config.permissions = ["read_geolocation"];
            }
            permissions.onGeolocationPermissionRequest(request);
            expect(mockedWebview.allowGeolocation).toHaveBeenCalledWith("test.com");
        });

        it("can call the onGeolocationPermissionRequest with permission properly to disallow", function () {
            var request = '{ "origin" : "test.com" }';
            if (config && config.permissions) {
                config.permissions = null;
            }
            permissions.onGeolocationPermissionRequest(request);
            expect(mockedWebview.disallowGeolocation).toHaveBeenCalledWith("test.com");
        });
    });
});
