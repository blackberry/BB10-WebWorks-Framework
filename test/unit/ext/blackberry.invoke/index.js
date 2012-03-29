var _apiDir = __dirname + "./../../../../ext/blackberry.invoke/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    events = require(_libDir + "event"),
    jsdom = require("jsdom");

describe("blackberr.invoke index", function () {

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
/*
    describe("Browser Invoke", function () {
        var mock_args = {
                appType: 11,
                args: encodeURIComponent(JSON.stringify({
                    url: 'http://www.rim.com'
                }))
            },
            expected_invokeArgs = {
                id: 1,
                cmd: 'Open',
                params: '/pps/services/navigator/control?server 2'
            };

        beforeEach(function () {
            spyOn(jnext, "require").andReturn(true);
            spyOn(jnext, "createObject").andReturn(1);
            spyOn(jnext, "invoke").andReturn('Ok');
        });
        
        it("should call jnext", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.invoke).toHaveBeenCalled();
        });

        it("should require pps", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.require).toHaveBeenCalledWith('pps');
        });

        it("should createObject pps.PPS", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.createObject).toHaveBeenCalledWith('pps.PPS');
        });
        
        
        it("should generate expected invokeArgs output", function () {
            index.invoke(function () {}, function () {}, mock_args);            
            expect(jnext.invoke).toHaveBeenCalledWith(expected_invokeArgs);
        });
    });
    */
});