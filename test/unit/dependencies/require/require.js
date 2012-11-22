describe("webworks require", function () {
    var root = "../../../../",
    webworksRequire = require(root + "dependencies/require/require");

    it("will throw an error if the module is not defined", function () {
        expect(function () {
            webworksRequire.require("test");
        }).toThrow("module test cannot be found");
    });

    it("defines a module using module.exports", function () {
        var testObj = {test: "TEST"};
        webworksRequire.define("test", function (require, exports, module) {
            module.exports = testObj;
        });
        expect(webworksRequire.require("test")).toEqual(testObj);
    });

    it("can use relative paths from within a module define", function () {
        var testObj = {test: "TEST"};
        webworksRequire.define("namespace/test", function (require, exports, module) {
            module.exports = testObj;
        });
        webworksRequire.define("namespace/test2", function (require, exports, module) {
            var nsTest = require('./test');
            module.exports = nsTest;
        });
        expect(webworksRequire.require("namespace/test2")).toEqual(testObj);
    });

    it("can use relative paths from within a module define", function () {
        var testObj = {test: "TEST"};
        webworksRequire.define("namespace2/test/test", function (require, exports, module) {
            module.exports = testObj;
        });
        webworksRequire.define("namespace3/test/test", function (require, exports, module) {
            var nsTest = require('./../../namespace2/test/test');
            module.exports = nsTest;
        });
        expect(webworksRequire.require("namespace3/test/test")).toEqual(testObj);
    });

    it("can use require(deps, callback) signature", function () {
        var module1 = "GRRR",
            module2 = "ARRRG";
        webworksRequire.define("module1", function (require, exports, module) {
            module.exports = module1;
        });
        webworksRequire.define("module2", function (require, exports, module) {
            module.exports = module2;
        });
        webworksRequire.require(["module1", "module2"], function (mod1, mod2) {
            expect(mod1).toEqual(module1);
            expect(mod2).toEqual(module2);
        });
    });

    describe("js file tests", function () {
        var mockRequest;
        beforeEach(function () {
            mockRequest = {
                open: jasmine.createSpy(),
                send: jasmine.createSpy(),
                responseText: null
            };
            GLOBAL.XMLHttpRequest = jasmine.createSpy().andReturn(mockRequest);

        });

        afterEach(function () {
            delete GLOBAL.XMLHttpRequest;
        });
        it("will attempt to load the file when it ends with .js", function () {
            var moduleURI = "ext/blackberry.app/client.js",
                url = "ext/blackberry.app/client.js",
                appClient;
            mockRequest.responseText = "module.exports = { test: 'TEST'}";
            //spyOn(webworksRequire, "define").andCallThrough();
            appClient = webworksRequire.require(moduleURI);
            expect(mockRequest.open).toHaveBeenCalledWith("GET", url, false);
            expect(mockRequest.send).toHaveBeenCalled();
            //TODO: Figure out how to catch the define call
            //expect(webworksRequire.define).toHaveBeenCalled();
            expect(appClient.test).toEqual("TEST");
            expect(webworksRequire.require("ext/blackberry.app/client")).toEqual(appClient);
        });

        it("will load modules using localRequire", function () {
            var parentDefineName = "testBuilder",
                moduleURI = "ext/blackberry.connection/client",
                url = "ext/blackberry.connection/client.js";
            mockRequest.responseText = "module.exports = { test: 'TEST'}";

            webworksRequire.define(parentDefineName, function (require, exports, module) {
                require(moduleURI);
                module.exports = "NA";
            });
            webworksRequire.require(parentDefineName);
            expect(mockRequest.open).toHaveBeenCalledWith("GET", url, false);
            expect(mockRequest.send).toHaveBeenCalled();
            expect(webworksRequire.require(moduleURI).test).toEqual("TEST");
        });

        it("will go across the bridge when the module name starts with local:// and ends with .js", function () {
            var moduleURI = "local://ext/blackberry.system/client.js",
                url = "http://localhost:8472/extensions/load/blackberry.system",
                appClient;
            /*jshint multistr:true */
            mockRequest.responseText = "{\
                \"client\": \"module.exports = { test: 'TEST'};\",\
                \"dependencies\": []\
            }";
            /*jshint multistr:false */
            //spyOn(webworksRequire, "define").andCallThrough();
            appClient = webworksRequire.require(moduleURI);
            expect(mockRequest.open).toHaveBeenCalledWith("GET", url, false);
            expect(mockRequest.send).toHaveBeenCalled();
            //TODO: Figure out how to catch the define call
            //expect(webworksRequire.define).toHaveBeenCalled();
            expect(appClient.test).toEqual("TEST");
        });

        it("will load dependencies in client js", function () {
            var moduleURI = "local://ext/blackberry.xyz/client.js",
                url = "http://localhost:8472/extensions/load/blackberry.xyz",
                appClient;
            /*jshint multistr:true */
            mockRequest.responseText = "{\
                \"client\": \"module.exports = { id: require('./manifest.json').namespace };\",\
                \"dependencies\": [{\
                    \"moduleName\": \"ext/blackberry.xyz/manifest.json\",\
                    \"body\": \"{namespace: \\\"blackberry.xyz\\\" }\"\
                }]\
            }";
            /*jshint multistr:false */

            appClient = webworksRequire.require(moduleURI);
            expect(mockRequest.open).toHaveBeenCalledWith("GET", url, false);
            expect(mockRequest.send).toHaveBeenCalled();
            expect(appClient.id).toEqual("blackberry.xyz");
        });
    });
});
