var _apiDir = __dirname + "./../../../../ext/blackberry.invoke/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    _ppsUtils,
    events = require(_libDir + "event"),
    jsdom = require("jsdom"),
    jnext,
    mockedPPS;

describe("blackberr.invoke index", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.document = jsdom.jsdom("<html><body></body></html>");
        GLOBAL.window = GLOBAL.document.createWindow();
        GLOBAL.navigator = window.navigator;
        GLOBAL.JNEXT = {
            invoke : function () {},
            registerEvents: function () {},
            unregisterEvents: function () {},
            createObject: function () {},
            require: function () {}
        };
        _ppsUtils = require(_libDir + "pps/ppsUtils");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.document;
        delete GLOBAL.window;
        delete GLOBAL.navigator;
        delete GLOBAL.JNEXT;
        index = null;
    });

    describe("Browser Invoke", function () {
        var mock_args = {
                appType: 11,
                args: encodeURIComponent(JSON.stringify({
                    url: 'http://www.rim.com'
                }))
            },
            expectedOpenMethodArgs = {
                path: '/pps/services/navigator/control?server',
                mode: 2
            };
            expectedWriteMethodArgs = {
                id: '',
                dat: 'http://www.rim.com', 
                msg: 'invoke'
            };

        beforeEach(function () {
            mockedPPS = { 
                init: jasmine.createSpy(),
                open: jasmine.createSpy(),
                read: jasmine.createSpy(),
                write: jasmine.createSpy(),
                close: jasmine.createSpy()
            };
            spyOn(_ppsUtils, "pps").andReturn(mockedPPS);
        });
        
        xit("should call jnext", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.invoke).toHaveBeenCalled();
        });

        xit("should require pps", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.require).toHaveBeenCalledWith('pps');
        });

        xit("should createObject pps.PPS", function () {         
            index.invoke(function () {}, function () {}, mock_args);
            expect(jnext.createObject).toHaveBeenCalledWith('pps.PPS');
        });
        
        
        it("should generate expected invokeArgs output", function () {
            index.invoke(function () {}, function () {}, mock_args);            
            expect(mockedPPS.init).toHaveBeenCalled();
            //expect(_ppsUtilsInst, "open").toHaveBeenCalledWith(expectedOpenMethodArgs.path, expectedOpenMethodArgs.mode);
            //expect(_ppsUtilsInst, "write").toHaveBeenCalledWith(expectedWriteMethodArgs);
            //expect(_ppsUtilsInst, "close").toHaveBeenCalled();
        });
    });
    
});
