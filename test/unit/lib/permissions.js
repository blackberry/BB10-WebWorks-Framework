describe("permissions", function () {
    var webview,
        libPath = "./../../../",
        mockedController,
        mockedWebview,
        mockedApplication,
        permissions = require(libPath + "lib/permissions");

    beforeEach(function () {
        webview = require(libPath + "lib/webview");
        mockedController = {
            enableWebInspector: undefined,
            enableCrossSiteXHR: undefined,
            visible: undefined,
            active: undefined,
            setGeometry: jasmine.createSpy(),
            dispatchEvent : jasmine.createSpy(),
            addEventListener : jasmine.createSpy()
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
            disallowGeolocation: jasmine.createSpy(),
            allowWebEvent: jasmine.createSpy(),
            addOriginAccessWhitelistEntry: jasmine.createSpy()
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

        it("can call the onGeolocationPermissionRequest", function () {
            var request = '{ "origin" : "test.com" }';
            permissions.onGeolocationPermissionRequest(request);
            expect(mockedWebview.allowGeolocation).toHaveBeenCalledWith("test.com");
        });

    });
});
