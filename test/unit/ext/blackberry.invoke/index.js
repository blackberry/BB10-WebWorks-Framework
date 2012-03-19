describe("browser.invoke index", function () {
    var index = require('../../../../ext/blackberry.invoke/index'),
        jnext = require('../../../../lib/jnext'),
        _jnext = {
            invoke: jasmine.createSpy()
        };

    describe("invoke", function () {
        var mock_args = {
                appType: 11,
                args: encodeURIComponent(JSON.stringify({
                    url: 'http://www.rim.com'
                }))
            };
        
        xit("should call jnext", function () {
            spyOn(jnext, "invoke").andReturn(_jnext);
            //spyOn(objJSExt, "sendCmd").andCallFake();
            index.invoke(function () {}, function () {}, mock_args);

            expect(_jnext.invoke).toHaveBeenCalled();
            // expect(_jnext.invoke).toHaveBeenCalledWith();
        });
    });
});