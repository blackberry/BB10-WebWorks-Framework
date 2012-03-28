describe("blackberry.invoke client", function () {
    var client = require('../../../../ext/blackberry.invoke/client'),
        utils = require('../../../../lib/utils');

    describe("appType", function () {
        it("should return constant for appropriate appType", function () {
            expect(client.APP_CAMERA).toEqual(4);
            expect(client.APP_MAPS).toEqual(5);
            expect(client.APP_BROWSER).toEqual(11);
            expect(client.APP_MUSIC).toEqual(13);
            expect(client.APP_PHOTOS).toEqual(14);
            expect(client.APP_VIDEOS).toEqual(15);
            expect(client.APP_APPWORLD).toEqual(16);
        });
    });

    describe("Browser Invoke", function () {
        var url = "http://www.google.com";
        xit("invoke should performExec", function () {
            spyOn(utils, "performExec").andReturn(true);
            client.invoke(client.APP_BROWSER, new client.BrowserArguments(url));
            expect(utils.performExec).toHaveBeenCalled();
        });
    });

    describe("BrowserArguments", function () {
        var url = "http://www.google.com", 
            browserArguments;

        it("should create a new BrowserArguments Object with url", function () {
            browserArguments = new client.BrowserArguments(url);

            expect(browserArguments.url).toBeDefined();
        });

        it("should create a new BrowserArguments Object with url", function () {
            browserArguments = new client.BrowserArguments(url);

            expect(browserArguments.url).toBeDefined();
        });

        it("should create a new BrowserArguments Object with lowercase url protocol", function () {
            url = "HTTP://WWW.GOOGLE.COM";
            browserArguments = new client.BrowserArguments(url);
            
            expect(browserArguments.url).toEqual("http://WWW.GOOGLE.COM");
        });
    });

});