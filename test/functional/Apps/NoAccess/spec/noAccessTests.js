describe("No Access Element Tests", function () {
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

    function testExternalWebApiRuns(domain, path) {
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
            expect(reply).toBe(blackberry.app.id);
            window.removeEventListener('message', receiveMessage);
        });

        return iframe;
    }

    beforeEach(function () {
        spyOn(window, "alert");
    });

    afterEach(function () {
        while (appendedElements.length > 0) {
            document.body.removeChild(appendedElements.pop());
        }
    });

    var blacklistedDomain = "smoketest-vmyyz.labyyz.testnet.rim.net:8080";

    it("cannot xhr request an external html page", function () {
        testXhrGetFailsToLoadDocument(blacklistedDomain);
    });

    //Cannot currently be tested because iframes will not fire onload, onerror or onabort
    xit('cannot navigate to external html page', function () {
        testIframeFailsToLoad(blacklistedDomain);
    });

    it('cannot load an image', function () {
        testImageFailsToLoad(blacklistedDomain);
    });

    it('cannot run external javascript function', function () {
        testExternalJsFailsToRun(blacklistedDomain);
    });
});
