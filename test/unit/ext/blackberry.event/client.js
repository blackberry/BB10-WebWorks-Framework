var _apiDir = __dirname + "./../../../../ext/blackberry.event/",
    _libDir = __dirname + "./../../../../lib/",
    window,
    client,
    mockedWindow = {
        webworks : {
            event : {
                on : jasmine.createSpy(), 
                remove : jasmine.createSpy()
            }
        }
    }; 

describe("Event Listener", function () {

    beforeEach(function () {
        window = require(_libDir + "public/window");
        spyOn(window, "window").andReturn(mockedWindow);
        client = require(_apiDir + "client");
    });

    it("adds event listeners", function () {
        var eventType = "GoldenEyeHijack",
            JamesBond = jasmine.createSpy();
        client.addEventListener(eventType, JamesBond);
        expect(mockedWindow.webworks.event.on).toHaveBeenCalledWith("blackberry.event", eventType, JamesBond);
    });

    it("removes event listeners", function () {
        var eventType = "",
            JamesBond = jasmine.createSpy();
        client.addEventListener(eventType);
        expect(mockedWindow.webworks.event.remove).toHaveBeenCalledWith("blackberry.event", eventType, undefined);
    });

});
