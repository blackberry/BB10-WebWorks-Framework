describe("request", function () {
    var request,
        libPath = "./../../../",
        Whitelist = require(libPath + 'lib/policy/whitelist').Whitelist,
        server = require(libPath + 'lib/server'),
        utils = require(libPath + 'lib/utils'),
        mockedWebview;

    beforeEach(function () {
        request = require(libPath + "lib/request");
        mockedWebview = {
            originalLocation : "http://www.origin.com",
            executeJavaScript : jasmine.createSpy(),
            id: 42,
            uiWebView: {
                childwebviewcontrols: {
                    open: jasmine.createSpy()
                }
            }
        };
    });

    it("creates a callback for yous", function () {
        var requestObj = request.init();
        expect(requestObj.networkResourceRequestedHandler).toBeDefined();
    });


    it("can access the whitelist", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(true);
        var url = "http://www.google.com",
            requestObj = request.init(mockedWebview);
        requestObj.networkResourceRequestedHandler(JSON.stringify({url: url}));
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
    });

    it("checks whether the request is for an iframe when accessing the whitelist", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(true);
        var url = "http://www.google.com",
            requestObj = request.init(mockedWebview);
        requestObj.networkResourceRequestedHandler(JSON.stringify({url: url, targetType: "TargetIsXMLHTTPRequest"}));
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalledWith(url, true);
    });

    it("can apply whitelist rules and allow valid urls", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(true);
        var url = "http://www.google.com",
            requestObj = request.init(mockedWebview),
            returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url}));
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
        expect(JSON.parse(returnValue).setAction).toEqual("ACCEPT");
    });

    it("can apply whitelist rules and deny blocked urls", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(false);
        spyOn(utils, "invokeInBrowser");

        var url = "http://www.google.com",
            requestObj = request.init(mockedWebview),
            returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url}));
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
        expect(JSON.parse(returnValue).setAction).toEqual("DENY");
        expect(utils.invokeInBrowser).not.toHaveBeenCalledWith(url);
        expect(mockedWebview.uiWebView.childwebviewcontrols.open).not.toHaveBeenCalledWith(url);
        expect(mockedWebview.executeJavaScript).toHaveBeenCalledWith("alert('Access to \"" + url + "\" not allowed')");
    });

    it("can apply whitelist rules and deny blocked urls and route to a uiWebView when target is main frame", function () {
        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(false);
        spyOn(utils, "invokeInBrowser");

        var url = "http://www.google.com",
            requestObj = request.init(mockedWebview),
            returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url, targetType: "TargetIsMainFrame"}));
        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
        expect(mockedWebview.uiWebView.childwebviewcontrols.open).toHaveBeenCalledWith(url);
        expect(mockedWebview.executeJavaScript).not.toHaveBeenCalledWith("alert('Access to \"" + url + "\" not allowed')");
        expect(utils.invokeInBrowser).not.toHaveBeenCalledWith(url);
        expect(JSON.parse(returnValue).setAction).toEqual("DENY");
    });

    it("can apply whitelist rules and deny blocked urls and route to the browser when target is main frame and childWebView is disabled", function () {
        var url = "http://www.google.com",
            config = require(libPath + "lib/config"),
            requestObj,
            returnValue;

        spyOn(Whitelist.prototype, "isAccessAllowed").andReturn(false);
        spyOn(utils, "invokeInBrowser");
        config.enableChildWebView = false;

        this.after(function () {
            delete require.cache[require.resolve(libPath + "lib/config")];
        });

        requestObj = request.init(mockedWebview);
        returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url, targetType: "TargetIsMainFrame"}));

        expect(Whitelist.prototype.isAccessAllowed).toHaveBeenCalled();
        expect(mockedWebview.uiWebView.childwebviewcontrols.open).not.toHaveBeenCalledWith(url);
        expect(mockedWebview.executeJavaScript).not.toHaveBeenCalledWith("alert('Access to \"" + url + "\" not allowed')");
        expect(utils.invokeInBrowser).toHaveBeenCalledWith(url);
        expect(JSON.parse(returnValue).setAction).toEqual("DENY");
    });

    it("can call the server handler when certain urls are detected", function () {
        spyOn(server, "handle");
        var url = "http://localhost:8472/roomService/kungfuAction/customExt/crystalMethod?blargs=yes",
            requestObj = request.init(mockedWebview),
            returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url, referrer: "http://www.origin.com" })),
            expectedRequest = {
                params: {
                    service: "roomService",
                    action: "kungfuAction",
                    ext: "customExt",
                    method: "crystalMethod",
                    args: "blargs=yes"
                },
                body: undefined,
                origin: "http://www.origin.com"
            },
            expectedResponse = {
                send: jasmine.any(Function)
            };
        expect(JSON.parse(returnValue).setAction).toEqual("SUBSTITUTE");
        expect(server.handle).toHaveBeenCalledWith(expectedRequest, expectedResponse);
    });

    it("can call the server handler correctly with a multi-level method", function () {
        spyOn(server, "handle");
        var url = "http://localhost:8472/roomService/kungfuAction/customExt/crystal/Method?blargs=yes",
            requestObj = request.init(mockedWebview),
            returnValue = requestObj.networkResourceRequestedHandler(JSON.stringify({url: url, referrer: "http://www.origin.com" })),
            expectedRequest = {
                params: {
                    service: "roomService",
                    action: "kungfuAction",
                    ext: "customExt",
                    method: "crystal/Method",
                    args: "blargs=yes"
                },
                body: undefined,
                origin: "http://www.origin.com"
            },
            expectedResponse = {
                send: jasmine.any(Function)
            };
        expect(JSON.parse(returnValue).setAction).toEqual("SUBSTITUTE");
        expect(server.handle).toHaveBeenCalledWith(expectedRequest, expectedResponse);
    });

});
