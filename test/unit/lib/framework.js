/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var srcPath = __dirname + '/../../../lib/',
    framework = require(srcPath + 'framework'),
    config = require(srcPath + "config"),
    util = require(srcPath + "utils"),
    webview,
    overlayWebView,
    controllerWebView,
    Whitelist = require(srcPath + 'policy/whitelist').Whitelist,
    mockedWebview,
    mockedApplicationWindow,
    mockedApplication,
    mockedBlackberry,
    mock_request = {
        url: "http://www.dummy.com",
        allow: jasmine.createSpy(),
        deny: jasmine.createSpy()
    };

describe("framework", function () {
    beforeEach(function () {
        mockedWebview = {
            id: 42,
            enableCrossSiteXHR: undefined,
            visible: undefined,
            active: undefined,
            zOrder: undefined,
            url: undefined,
            setGeometry: jasmine.createSpy(),
            onNetworkResourceRequested: undefined,
            destroy: jasmine.createSpy(),
            executeJavaScript: jasmine.createSpy(),
            windowGroup: undefined,
            addEventListener: jasmine.createSpy(),
            uiWebView: undefined
        };
        mockedApplicationWindow = {
            visible: undefined
        };
        mockedApplication = {
            addEventListener: jasmine.createSpy()
        };
        GLOBAL.window = {
            qnx: {
                callExtensionMethod : function () {
                    return 42;
                },
                webplatform : {
                    getController : function () {
                        return mockedWebview;
                    },
                    getApplication : function () {
                        return mockedApplication;
                    },
                    getApplicationWindow : function () {
                        return mockedApplicationWindow;
                    }
                }
            }
        };
        mockedBlackberry = {
            invoke: {
                invoke: jasmine.createSpy()
            }
        };
        GLOBAL.blackberry = mockedBlackberry;

        webview = util.requireWebview();
        overlayWebView = require(srcPath + "overlayWebView");
        controllerWebView = require(srcPath + "controllerWebView");
        spyOn(webview, "create").andCallFake(function (done) {
            done();
        });
        spyOn(overlayWebView, "create").andCallFake(function (done) {
            done();
        });
        spyOn(controllerWebView, "init");
        spyOn(controllerWebView, "dispatchEvent");
        spyOn(webview, "destroy");
        spyOn(webview, "executeJavascript");
        spyOn(webview, "setURL");
        spyOn(webview, "setUIWebViewObj");
        spyOn(overlayWebView, "setURL");
        spyOn(overlayWebView, "renderContextMenuFor");
        spyOn(overlayWebView, "handleDialogFor");
        spyOn(overlayWebView, "addEventListener").andCallFake(function (eventName, callback) {
            callback();
        });
        spyOn(overlayWebView, "removeEventListener");
        spyOn(overlayWebView, "bindAppWebViewToChildWebViewControls");
        spyOn(console, "log");
    });

    it("can start a webview instance", function () {
        framework.start();
        expect(controllerWebView.init).toHaveBeenCalled();
        expect(webview.create).toHaveBeenCalled();
    });

    it("on start passing callback and setting object parameters to create method of webview", function () {
        framework.start();
        expect(webview.create).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
    });

    it("setting object should have debugEnabled to be defined", function () {
        framework.start();
        expect((webview.create.mostRecentCall.args)[1].debugEnabled).toBeDefined();
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

    describe('creating the overlay webview', function () {
        beforeEach(function () {
            framework.start();
        });
        it('calls overlayWebView.create', function () {
            expect(overlayWebView.create).toHaveBeenCalled();
        });

        it('sets the overlayWebView URL', function () {
            expect(overlayWebView.setURL).toHaveBeenCalledWith("local:///chrome/ui.html");
        });

        it('calls renderContextMenuFor passing the webview', function () {
            expect(overlayWebView.renderContextMenuFor).toHaveBeenCalledWith(webview);
        });

        it('calls handleDialogFor passing the webview', function () {
            expect(overlayWebView.handleDialogFor).toHaveBeenCalledWith(webview);
        });

        it('dispatches the ui.init event on the controllerWebView', function () {
            expect(controllerWebView.dispatchEvent).toHaveBeenCalledWith('ui.init', null);
        });
    });

    describe('configuring OpenChildWindow events', function () {
        it('delegates to childWebViewControls on the overlay webview', function () {
            config.enableChildWebView = true;
            framework.start();
            expect(overlayWebView.bindAppWebViewToChildWebViewControls).toHaveBeenCalledWith(webview);
        });

        it('binds to OpenChildWindow and invokes the browser', function () {
            var openChildWindowHandler;
            webview.__defineSetter__('onChildWindowOpen', function (input) {
                openChildWindowHandler = input;
            });
            config.enableChildWebView = false;
            framework.start();
            expect(openChildWindowHandler).toEqual(jasmine.any(Function));
            openChildWindowHandler({url: 'http://www.google.com'});
            expect(mockedBlackberry.invoke.invoke).toHaveBeenCalledWith(
                {uri: 'http://www.google.com', target: "sys.browser" },
                jasmine.any(Function),
                jasmine.any(Function)
            );
        });
    });
});
