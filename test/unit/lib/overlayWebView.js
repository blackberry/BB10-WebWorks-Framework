/*
 *  Copyright 2012 Research In Motion Limited.
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
describe("Overlay Webview", function () {
    var overlayWebView,
        libPath = "./../../../",
        mockedController,
        mockedWebview,
        mockedApplication;

    beforeEach(function () {
        overlayWebView = require(libPath + "lib/overlayWebView");
        mockedWebview = {
            id: 42,
            enableCrossSiteXHR: undefined,
            visible: undefined,
            active: undefined,
            zOrder: undefined,
            url: undefined,
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
            notifyContextMenuCancelled: jasmine.createSpy(),
            allowQnxObject: undefined,
            allowRpc: undefined,
            contextMenu: {
                subscribeTo: jasmine.createSpy()
            }
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
                createUIWebView: function (createFunction) {
                    runs(createFunction);
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
        it("sets up the visible overlayWebView", function () {
            overlayWebView.create();
            waits(1);
            runs(function () {
                expect(mockedWebview.visible).toEqual(true);
                expect(mockedWebview.active).toEqual(true);
                expect(mockedWebview.zOrder).toEqual(1);
                expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, screen.width, screen.height);
                expect(mockedWebview.backgroundColor).toEqual(0x00FFFFFF);
                expect(mockedWebview.sensitivity).toEqual("SensitivityTest");
                expect(mockedWebview.allowQnxObject).toEqual(true);
                expect(mockedWebview.allowRpc).toEqual(true);
            });
        });

        it("calls the ready function", function () {
            var chuck = jasmine.createSpy();
            overlayWebView.create(chuck);
            waits(1);
            runs(function () {
                expect(chuck).toHaveBeenCalled();
            });
        });

    });

    describe("methods other than create", function () {

        it("calls the underlying destroy", function () {
            overlayWebView.create(mockedWebview);
            overlayWebView.destroy();
            expect(mockedWebview.destroy).toHaveBeenCalled();
        });

        it("sets the url property", function () {
            var url = "http://AWESOMESAUCE.com";
            overlayWebView.create(mockedWebview);
            overlayWebView.setURL(url);
            expect(mockedWebview.url).toEqual(url);
        });

        it("calls the underlying executeJavascript", function () {
            var js = "var awesome='Jasmine BDD'";
            overlayWebView.create(mockedWebview);
            overlayWebView.executeJavascript(js);
            expect(mockedWebview.executeJavaScript).toHaveBeenCalledWith(js);
        });
        it("calls the underlying windowGroup property", function () {
            overlayWebView.create(mockedWebview);
            expect(overlayWebView.windowGroup()).toEqual(mockedWebview.windowGroup);
        });

        it("can get the id for the webiew", function () {
            overlayWebView.create();
            expect(overlayWebView.id).toEqual(mockedWebview.id);
        });

        it("can set geometry", function () {
            overlayWebView.create();
            overlayWebView.setGeometry(0, 0, 100, 200);
            expect(mockedWebview.setGeometry).toHaveBeenCalledWith(0, 0, 100, 200);
        });

        it("can set application orientation", function () {
            overlayWebView.create();
            overlayWebView.setApplicationOrientation(90);
            expect(mockedWebview.setApplicationOrientation).toHaveBeenCalledWith(90);
        });

        it("can notifyApplicationOrientationDone", function () {
            overlayWebView.create();
            overlayWebView.notifyApplicationOrientationDone();
            expect(mockedWebview.notifyApplicationOrientationDone).toHaveBeenCalled();
        });

        it("can notifyContextMenuCancelled", function () {
            overlayWebView.create();
            overlayWebView.notifyContextMenuCancelled();
            expect(mockedWebview.notifyContextMenuCancelled).toHaveBeenCalled();
        });

        it("can render the ccm for another webview ", function () {
            overlayWebView.create();
            overlayWebView.renderContextMenuFor(overlayWebView);
            expect(mockedWebview.contextMenu.subscribeTo).toHaveBeenCalledWith(overlayWebView);
        });
    });
});
