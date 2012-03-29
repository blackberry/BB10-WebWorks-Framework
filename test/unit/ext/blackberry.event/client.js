var _apiDir = __dirname + "./../../../../ext/blackberry.event/",
    _libDir = __dirname + "./../../../../lib/",
    client,
    mockedWebworks = {
        event : {
            on : jasmine.createSpy(), 
            remove : jasmine.createSpy()
        }
    }; 

describe("Event Listener", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window  = {webworks : mockedWebworks};
        client = require(_apiDir + "client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });

    it("adds event listeners", function () {
        var eventType = "GoldenEye",
            JamesBond = jasmine.createSpy();
        client.addEventListener(eventType, JamesBond);
        expect(mockedWebworks.event.on).toHaveBeenCalledWith("blackberry.event", eventType, JamesBond);
    });

    it("removes event listeners", function () {
        var eventType = "GoldenEyeHijack",
            JamesBond = jasmine.createSpy();
        client.removeEventListener(eventType, JamesBond);
        expect(mockedWebworks.event.remove).toHaveBeenCalledWith("blackberry.event", eventType, JamesBond);
    });

});
