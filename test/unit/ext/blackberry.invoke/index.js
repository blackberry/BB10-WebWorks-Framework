describe("blackberry.invoke index", function () {
    var index = require('../../../../ext/blackberry.invoke/index'),
        jnext = require('../../../../lib/jnext');

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
});