describe("Cross Origin Wildcard", function () {
    var appendedElements = [];

    function generateSerial() {
        return new Date().getTime().toString();
    }

    function mixin(from, to) {
        Object.getOwnPropertyNames(from).forEach(function (prop) {
            if (Object.hasOwnProperty.call(from, prop)) {
                to[prop] = from[prop];
            }
        });
        return to;
    }

    function _testHtmlElement(htmlElement, attributes, shouldFail) {
        var element = document.createElement(htmlElement);
        element.onload = jasmine.createSpy();
        element.onerror = jasmine.createSpy();
        mixin(attributes, element);
        document.body.appendChild(element);
        waitsFor(function () {
            return element.onerror.wasCalled || element.onload.wasCalled;
        }, "the element to load or error", 5000);
        runs(function () {
            if (shouldFail) {
                expect(window.alert).toHaveBeenCalled();
            }
            else {
                expect(window.alert).not.toHaveBeenCalled();
            }
        });
        appendedElements.push(element);
        return element;
    }

    function testHtmlElementLoads(htmlElement, attributes) {
        return _testHtmlElement(htmlElement, attributes);
    }

    function testHtmlElementFailsToLoad(htmlElement, attributes) {
        return _testHtmlElement(htmlElement, attributes, true);
    }

    function testXhrGetLoadsUrl(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        expect(xhr.readyState).toBe(4);
        expect(xhr.status).toBe(200);
        return xhr;
    }

    function testXhrGetLoadsDocument(domain) {
        return testXhrGetLoadsUrl("http://" + domain + "/index.html?v=" + generateSerial());
    }

    function testXhrGetThrowsAlert(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        expect(window.alert).toHaveBeenCalledWith('Access to "' + url + '" not allowed');
        return xhr;
    }

    function testXhrGetFailsToLoadUrl(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        expect(function () {
            xhr.send();
        }).toThrow({
            message: "NETWORK_ERR: XMLHttpRequest Exception 101"
        });
        return xhr;
    }

    function testXhrGetFailsToLoadDocument(domain) {
        testXhrGetFailsToLoadUrl("http://" + domain + "/index.html?v=" + generateSerial());
    }

    function testIframeLoads(domain) {
        var url = 'http://' + domain + '/index.html';
        return testHtmlElementLoads('iframe', {src: url });
    }

    function testIframeFailsToLoad(domain) {
        var url = 'http://' + domain + '/index.html';
        return testHtmlElementFailsToLoad('iframe', {src: url });
    }

    function testImageLoads(domain) {
        var url = 'http://' + domain + '/burger.png?v=' + generateSerial();
        return testHtmlElementLoads('img', {src: url });
    }

    function testImageFailsToLoad(domain) {
        var url = 'http://' + domain + '/burger.png?v=' + generateSerial();
        return testHtmlElementFailsToLoad('img', {src: url });
    }

    function testExternalJsRuns(domain) {
        var url = "http://" + domain + "/general_whitelisted.js?v=" + generateSerial(),
            script;
        runs(function () {
            delete window.Whitelisted;
            script = testHtmlElementLoads('script', {type: "text/javascript", src: url});
        });
        runs(function () {
            expect(window.Whitelisted).toBeDefined();
            expect(window.Whitelisted.onePlusOne).toBeDefined();
            expect(window.Whitelisted.onePlusOne()).toBe(2);
        });
        return script;
    }

    function testExternalJsFailsToRun(domain) {
        var url = "http://" + domain + "/general_blacklisted.js?v=" + generateSerial(),
            script;
        runs(function () {
            delete window.Blacklisted;
            script = testHtmlElementFailsToLoad('script', {type: "text/javascript", src: url});
        });
        runs(function () {
            expect(window.Blacklisted).not.toBeDefined();
        });
        return script;
    }

    function testExternalWebApi(domain, path, shouldFail) {
        var origin = 'http://' + domain,
            url = origin + (path || '/a/webworks.html'),
            iframe,
            reply = null,
            receiveMessage = function (e) {
                if (e.data === 'wwready') {
                    iframe.contentWindow.postMessage('ping', origin);
                } else {
                    reply = e.data;
                }
            };

        runs(function () {
            window.addEventListener('message', receiveMessage, false);
            iframe = testHtmlElementLoads('iframe', {src: url});
        });
        waitsFor(function () {
            return reply !== null;
        }, "the web api to responds", 10000);
        runs(function () {
            if (shouldFail){
                expect(reply).not.toBeDefined();
            } else {
                expect(reply).toBe(blackberry.app.id);
            }

            window.removeEventListener('message', receiveMessage);
        });

        return iframe;
    }

    function testExternalWebApiFailsToRun(domain, path) {
        testExternalWebApi(domain, path, true);
    }

    function testExternalWebApiRuns(domain, path) {
        testExternalWebApi(domain, path, false);
    }

    beforeEach(function () {
        spyOn(window, "alert");
    });

    afterEach(function () {
        while (appendedElements.length > 0) {
            document.body.removeChild(appendedElements.pop());
        }
    });

    // 07 Step 2: Start page is in a subfolder. It has the following tests: API declared to that subfolder;
    //    API declared for an external domain but not to this subfolder; navigate to first subdomain 
    //    and test whitelisted/not whitelisted APIs; navigate to second subdomain and test 
    //    whitelisted/not whitelisted APIs
    //    (Needs seperate app)
    describe("allows/disallows access to web apis from different subfolders", function () {
        var externalDomain = "smoketest1-vmyyz.labyyz.testnet.rim.net:8080";

        it("can access whitelisted subfolder apis", function () {
            expect(blackberry.app.id).toBeDefined();
        });

        it("cannot access non-whitelisted subfolder apis", function () {
            expect(blackberry.io).not.toBeDefined();
        });

        it("can access external whitelisted subfolder apis", function () {
            testExternalWebApiRuns(externalDomain);
        });

        it("cannot access external non-whitelisted subfolder apis", function () {
            testExternalWebApiFailsToRun(externalDomain, "/c/webworks.html");
        });
    });
});