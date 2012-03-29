var _apiDir = __dirname + "./../../../../ext/blackberry.event/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    events = require(_libDir + "event"),
    jsdom = require("jsdom");

describe("blackberr.event index", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.document = jsdom.jsdom("<html><body></body></html>");
        GLOBAL.window = GLOBAL.document.createWindow();
        GLOBAL.navigator = window.navigator;
        GLOBAL.JNEXT = require(_libDir + "jnext");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.document;
        delete GLOBAL.window;
        delete GLOBAL.navigator;
        delete GLOBAL.JNEXT;
        index = null;
    });

    it("responds to 'batterystatus' events", function () {
        var event = "batterystatus",
            args = {eventName : encodeURIComponent(event)}; 
        spyOn(events, "on");
        index.on(null, null, args);
        expect(events.on).toHaveBeenCalled();
        expect(events.on.mostRecentCall.args[0].event.eventName).toEqual("batterystatus");
    });

    it("removes 'batterystatus' events", function () {
        var event = "batterystatus",
            args = {eventName : encodeURIComponent(event)}; 
        spyOn(events, "remove");
        index.remove(null, null, args);
        expect(events.remove).toHaveBeenCalled();
        expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual("batterystatus");
    });

});
