describe("webview", function () {
    var libPath = "./../../../",
        request = require(libPath + "lib/request"),
        utils = require(libPath + "lib/utils"),
        webview,
        mockedController,
        mockedWebview,
        mockedApplication;

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
            setExtraPluginDirectory: jasmine.createSpy(),
            setEnablePlugins: jasmine.createSpy(),
            getEnablePlugins: jasmine.createSpy(),
            notifyApplicationOrientationDone: jasmine.createSpy(),
            onContextMenuRequestEvent: undefined,
            onNetworkResourceRequested: undefined,
            destroy: jasmine.createSpy(),
            executeJavaScript: jasmine.createSpy(),
            windowGroup: undefined,
            addEventListener: jasmine.createSpy(),
            enableWebEventRedirect: jasmine.createSpy(),
            addKnownSSLCertificate: jasmine.createSpy(),
            continueSSLHandshaking: jasmine.createSpy()
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

    describe("create", function () {
        it("sets up the visible webview", function () {
            spyOn(request, "init").andCallThrough();
            webview.create();
            waits(1);
            runs(function () {
                expect(mockedWebview.visible).toEqual(true);
                expect(mockedWebview.active).toEqual(true);
                expect(mockedWebview.zOrder).toEqual(0);
                expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, screen.width, screen.height);
                expect(mockedWebview.enableWebEventRedirect.argsForCall[0]).toEqual(['ContextMenuRequestEvent', 3]);
                expect(mockedWebview.enableWebEventRedirect.argsForCall[1]).toEqual(['ContextMenuCancelEvent', 3]);
                expect(mockedWebview.enableWebEventRedirect.argsForCall[2]).toEqual(['PropertyCurrentContextEvent', 3]);
                expect(request.init).toHaveBeenCalledWith(mockedWebview);
                expect(mockedWebview.onNetworkResourceRequested).toEqual(request.init(mockedWebview).networkResourceRequestedHandler);

                //The default config.xml only has access to WIDGET_LOCAL
                //and has permission for two apis
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', 'local://', false);
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', utils.getURIPrefix(), true);
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('webview.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', 'file://', true);
            });
        });

        it("calls the ready function", function () {
            var chuck = jasmine.createSpy();
            webview.create(chuck);
            waits(1);
            runs(function () {
                expect(chuck).toHaveBeenCalled();
            });
        });

    });

    describe("file system sandbox", function () {
        it("setSandbox", function () {
            webview.create();
            webview.setSandbox(false);
            expect(mockedWebview.setFileSystemSandbox).toBeFalsy();
        });

        it("getSandbox", function () {
            webview.create();
            webview.setSandbox(false);
            expect(webview.getSandbox()).toBeFalsy();
        });
    });

    describe("id", function () {
        it("can get the id for the webiew", function () {
            webview.create();
            webview.id();
            expect(mockedWebview.id).toEqual(42);
        });
    });

    describe("geometry", function () {
        it("can set geometry", function () {
            webview.create();
            webview.setGeometry(0, 0, 100, 200);
            expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, 100, 200);
        });
    });

    describe("application orientation", function () {
        it("can set application orientation", function () {
            webview.create();
            webview.setApplicationOrientation(90);
            expect(mockedWebview.setApplicationOrientation).toHaveBeenCalledWith(90);
        });

        it("can notifyApplicationOrientationDone", function () {
            webview.create();
            webview.notifyApplicationOrientationDone();
            expect(mockedWebview.notifyApplicationOrientationDone).toHaveBeenCalled();
        });
    });

    describe("plugins", function () {
        it("can set an extra plugin directory", function () {
            webview.create();
            webview.setExtraPluginDirectory('/usr/lib/browser/plugins');
            expect(mockedWebview.setExtraPluginDirectory).toHaveBeenCalledWith('/usr/lib/browser/plugins');
        });

        it("can enable plugins for the webview", function () {
            webview.create();
            webview.setEnablePlugins(true);
            expect(mockedWebview.pluginsEnabled).toBeTruthy();
        });

        it("can retrieve whether plugins are enabled", function () {
            webview.create();
            webview.setEnablePlugins(true);
            expect(webview.getEnablePlugins()).toBeTruthy();
        });
    });

    describe("SSL Exception Methods", function () {
        it("addKnownSSLException", function () {
            var url = 'https://bojaps.com',
                certificateInfo = {
                    test : 'test'
                };
            webview.create();
            webview.addKnownSSLCertificate(url, certificateInfo);
            expect(mockedWebview.addKnownSSLCertificate).toHaveBeenCalledWith(url, certificateInfo);
        });

        it("continue SSL Hanshaking", function () {
            var streamId = 8,
                SSLAction = 'SSLActionReject';
            webview.create();
            webview.continueSSLHandshaking(streamId, SSLAction);
            expect(mockedWebview.continueSSLHandshaking).toHaveBeenCalledWith(streamId, SSLAction);
        });
    });

    describe("methods other than create", function () {

        it("calls the underlying destroy", function () {
            webview.create(mockedWebview);
            webview.destroy();
            expect(mockedWebview.destroy).toHaveBeenCalled();
        });

        it("sets the url property", function () {
            var url = "http://AWESOMESAUCE.com";
            webview.create(mockedWebview);
            webview.setURL(url);
            expect(mockedWebview.url).toEqual(url);
        });

        it("calls the underlying executeJavaScript", function () {
            var js = "var awesome='Jasmine BDD'";
            webview.create(mockedWebview);
            webview.executeJavascript(js);
            expect(mockedWebview.executeJavaScript).toHaveBeenCalledWith(js);
        });
        it("calls the underlying windowGroup property", function () {
            webview.create(mockedWebview);
            expect(webview.windowGroup()).toEqual(mockedWebview.windowGroup);
        });
    });

});
