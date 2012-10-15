describe("clientWebView", function () {
    var libPath = "./../../../",
        request = require(libPath + "lib/request"),
        utils = require(libPath + "lib/utils"),
        clientWebView,
        mockedController,
        mockedWebview,
        mockedApplication;

    beforeEach(function () {
        clientWebView = require(libPath + "lib/clientWebView");
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
        it("sets up the visible clientWebView", function () {
            spyOn(request, "init").andCallThrough();
            clientWebView.create();
            waits(1);
            runs(function () {
                expect(mockedWebview.visible).toEqual(true);
                expect(mockedWebview.active).toEqual(true);
                expect(mockedWebview.zOrder).toEqual(0);
                expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, screen.width, screen.height);
                expect(request.init).toHaveBeenCalledWith(mockedWebview);
                expect(mockedWebview.onNetworkResourceRequested).toEqual(request.init(mockedWebview).networkResourceRequestedHandler);

                //The default config.xml only has access to WIDGET_LOCAL
                //and has permission for two apis
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('clientWebView.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', 'local://', false);
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('clientWebView.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', utils.getURIPrefix(), true);
                expect(qnx.callExtensionMethod).toHaveBeenCalledWith('clientWebView.addOriginAccessWhitelistEntry', mockedWebview.id, 'local://', 'file://', true);
            });
        });

        it("calls the ready function", function () {
            var chuck = jasmine.createSpy();
            clientWebView.create(chuck);
            waits(1);
            runs(function () {
                expect(chuck).toHaveBeenCalled();
            });
        });

    });

    describe("file system sandbox", function () {
        it("setSandbox", function () {
            clientWebView.create();
            clientWebView.setSandbox(false);
            expect(mockedWebview.setFileSystemSandbox).toBeFalsy();
        });

        it("getSandbox", function () {
            clientWebView.create();
            clientWebView.setSandbox(false);
            expect(clientWebView.getSandbox()).toBeFalsy();
        });
    });

    describe("id", function () {
        it("can get the id for the webiew", function () {
            clientWebView.create();
            expect(clientWebView.id).toEqual(mockedWebview.id);
        });
    });

    describe("geometry", function () {
        it("can set geometry", function () {
            clientWebView.create();
            clientWebView.setGeometry(0, 0, 100, 200);
            expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, 100, 200);
        });
    });

    describe("application orientation", function () {
        it("can set application orientation", function () {
            clientWebView.create();
            clientWebView.setApplicationOrientation(90);
            expect(mockedWebview.setApplicationOrientation).toHaveBeenCalledWith(90);
        });

        it("can notifyApplicationOrientationDone", function () {
            clientWebView.create();
            clientWebView.notifyApplicationOrientationDone();
            expect(mockedWebview.notifyApplicationOrientationDone).toHaveBeenCalled();
        });
    });

    describe("plugins", function () {
        it("can set an extra plugin directory", function () {
            clientWebView.create();
            clientWebView.setExtraPluginDirectory('/usr/lib/browser/plugins');
            expect(mockedWebview.setExtraPluginDirectory).toHaveBeenCalledWith('/usr/lib/browser/plugins');
        });

        it("can enable plugins for the clientWebView", function () {
            clientWebView.create();
            clientWebView.setEnablePlugins(true);
            expect(mockedWebview.pluginsEnabled).toBeTruthy();
        });

        it("can retrieve whether plugins are enabled", function () {
            clientWebView.create();
            clientWebView.setEnablePlugins(true);
            expect(clientWebView.getEnablePlugins()).toBeTruthy();
        });
    });

    describe("SSL Exception Methods", function () {
        it("addKnownSSLException", function () {
            var url = 'https://bojaps.com',
                certificateInfo = {
                    test : 'test'
                };
            clientWebView.create();
            clientWebView.addKnownSSLCertificate(url, certificateInfo);
            expect(mockedWebview.addKnownSSLCertificate).toHaveBeenCalledWith(url, certificateInfo);
        });

        it("continue SSL Hanshaking", function () {
            var streamId = 8,
                SSLAction = 'SSLActionReject';
            clientWebView.create();
            clientWebView.continueSSLHandshaking(streamId, SSLAction);
            expect(mockedWebview.continueSSLHandshaking).toHaveBeenCalledWith(streamId, SSLAction);
        });
    });

    describe("methods other than create", function () {

        it("calls the underlying destroy", function () {
            clientWebView.create(mockedWebview);
            clientWebView.destroy();
            expect(mockedWebview.destroy).toHaveBeenCalled();
        });

        it("sets the url property", function () {
            var url = "http://AWESOMESAUCE.com";
            clientWebView.create(mockedWebview);
            clientWebView.setURL(url);
            expect(mockedWebview.url).toEqual(url);
        });

        it("calls the underlying executeJavaScript", function () {
            var js = "var awesome='Jasmine BDD'";
            clientWebView.create(mockedWebview);
            clientWebView.executeJavascript(js);
            expect(mockedWebview.executeJavaScript).toHaveBeenCalledWith(js);
        });
        it("calls the underlying windowGroup property", function () {
            clientWebView.create(mockedWebview);
            expect(clientWebView.windowGroup()).toEqual(mockedWebview.windowGroup);
        });
    });

});
