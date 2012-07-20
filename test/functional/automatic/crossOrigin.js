describe("White listing", function () {

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
            url = origin + (path || '/webworks.html'),
            iframe,
            reply = null,
            receiveMessage = function (e) {
                reply = e.data;
            };

        runs(function () {
            window.addEventListener('message', receiveMessage, false);
            iframe = testHtmlElementLoads('iframe', {src: url});
        });
        runs(function () {
            iframe.contentWindow.postMessage('ping', origin);
        });
        waitsFor(function () {
            return reply !== null;
        });
        runs(function () {
            expect(reply).toBe(blackberry.app.id);
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

    // 02. Allowed access from local startup page to external resources through URI domains
    xdescribe("allowing access to domains", function () {

        var whitelistedDomain = "Smoketest8-vmyyz.labyyz.testnet.rim.net";

        // Step 1: Validate that if URI domain is provided in config.xml,
        // access from widget to external html page, image, Javascript and Web API functions
        // can occur through this URI
        describe("by various methods", function () {

            it("can xhr request an external html page", function () {
                testXhrGetLoadsDocument(whitelistedDomain);
            });

            it('can navigate to external html page', function () {
                testIframeLoads(whitelistedDomain);
            });

            it('can load an image', function () {
                testImageLoads(whitelistedDomain);
            });

            it('can run external javascript function', function () {
                testExternalJsRuns(whitelistedDomain);
            });

            it('can externally access the web api', function () {
                testExternalWebApiRuns(whitelistedDomain);
            });
        });

        // Step 2: When submiting request from html form, query string is
        // appended directly to URI specified in the <access> field.
        describe("with url parameters", function () {

            it("can append params to a path whitelisted with ?*", function () {
                testXhrGetLoadsUrl("http://Smoketest3-vmyyz.labyyz.testnet.rim.net/index.html?a=b&c=d&v=" + generateSerial());
            });

            it("cannot append params to a path whitelisted without ?*", function () {
                //Will not throw an exception because its not blocked by webkit
                testXhrGetThrowsAlert("http://Smoketest4-vmyyz.labyyz.testnet.rim.net/index.html?a=b&c=d&v=" + generateSerial());
            });
        });

        // Step 3: Widget has links that include port number. Validate that clicking the link
        // opens an expected page (page with a link "Display current time").
        it("can follow a link including a port number", function () {
            var url = 'http://' + whitelistedDomain + ':80/index.html';
            return testHtmlElementLoads('iframe', {src: url });
        });

    });

    // 03. Disallowed access from local startup page to external resources through URI domains
    describe("disallowing access to domains", function () {

        var blacklistedDomain = "Smoketest2-vmyyz.labyyz.testnet.rim.net";

        // Step 1: Validate that access to external html page, image, Javascript, Web API functions
        // is not allowed from the widget, if this particular URI domain is not provided in config.xml,
        // while it is provided for another domain:
        describe("by various methods", function () {
            it("cannot xhr request an external html page", function () {
                testXhrGetFailsToLoadDocument(blacklistedDomain);
            });

            it('cannot navigate to external html page', function () {
                testIframeFailsToLoad(blacklistedDomain);
            });

            it('cannot load an image', function () {
                testImageFailsToLoad(blacklistedDomain);
            });

            it('cannot run external javascript function', function () {
                testExternalJsFailsToRun(blacklistedDomain);
            });
        });

        // Step 3: Validate that widget does not have access to resources in parent or parallel directories
        // of URI specified in the <access> element in config.xml.
        describe("at specific paths", function () {
            it("can access /a/index.html", function () {
                testXhrGetLoadsUrl("http://Smoketest4-vmyyz.labyyz.testnet.rim.net/a/index.html");
            });
            //This is NOT blocked by webkit so no exception will be throw, but an alert will still be called
            it("cannot access sibling folder /b/index.html", function () {
                testXhrGetThrowsAlert("http://Smoketest4-vmyyz.labyyz.testnet.rim.net/b/index.html");
            });
        });
    });

    // 04. Allowed access from local startup page to external resources through URI subdomains
    describe("allowing access to subdomains", function () {

        var whitelistedSubdomain = "www.Smoketest8-vmyyz.labyyz.testnet.rim.net";

        // Step 1: Validate that if URI domain is provided in config.xml where subdomain=true,
        // access from widget to html page, image, javascript,  Web API on external server,
        // that has subdomain of URI specified, can occur
        describe("by various methods", function () {
            it("can xhr request an external html page", function () {
                testXhrGetLoadsDocument(whitelistedSubdomain);
            });

            it('can navigate to external html page', function () {
                testIframeLoads(whitelistedSubdomain);
            });

            it('can load an image', function () {
                testImageLoads(whitelistedSubdomain);
            });

            it('can run external javascript function', function () {
                testExternalJsRuns(whitelistedSubdomain);
            });

            it('can externally access the web api', function () {
                testExternalWebApiRuns(whitelistedSubdomain);
            });
        });

        // Step 2: Validate that website that has redirection URLs can be accessed, if all
        // redirects are listed in the <access> elements and subdomains=true, e.g.
        // for http://www.gmail.com the following elements should appear in config.xml:
        it("can follow a redirect", function () {
            testXhrGetLoadsUrl('http://Smoketest8-vmyyz.labyyz.testnet.rim.net/redirect.php?url=' + encodeURIComponent('http://smoketest1-vmyyz.labyyz.testnet.rim.net:8080/index.html'));
        });
    });

    // 05. Disallowed access from local startup page to external resources through URI subdomains
    describe("disallowing access to subdomains", function () {

        var blacklistedSubdomain = "www.Smoketest1-vmyyz.labyyz.testnet.rim.net";

        // Step 1: Validate that access to external html page / image / javascript,
        // which URIs include subdomains, is not allowed, if subdomains=false, e.g.,
        // if access element is specified in the following way:
        describe("by various methods", function () {
            it("cannot xhr request an external html page", function () {
                testXhrGetFailsToLoadDocument(blacklistedSubdomain);
            });

            it('cannot navigate to external html page', function () {
                testIframeFailsToLoad(blacklistedSubdomain);
            });

            it('cannot load an image', function () {
                testImageFailsToLoad(blacklistedSubdomain);
            });

            it('cannot run external javascript function', function () {
                testExternalJsFailsToRun(blacklistedSubdomain);
            });
        });

        // Step 2: Validate that rules of access to URI where the subdomain
        // attribute is not included in config.xml are identical to the case where
        // subdomain=false, that is if access element is specified in the following way:
        // <access uri="rim.net" >
        // then access to http://xyz.rim.net is disallowed
        it("defaults to disallowing subdomains", function () {
            testXhrGetFailsToLoadDocument('www.Smoketest5-vmyyz.labyyz.testnet.rim.net');
        });

        // Step 3
        describe("explicitly allowed subdomains", function () {
            // 1: Validate that if subdomains=false in config.xml for a certain domain,
            // that does not affect another explicitely provided URI with same domain
            // and different subdomain , e.g.
            // <access uri="http://abc.com" subdomains="false" /> </access>
            // <access uri="http://xyz.abc.com"/></access>
            it("explicitly allows subdomains", function () {
                testXhrGetLoadsDocument('www.Smoketest6-vmyyz.labyyz.testnet.rim.net');
            });

            // 2: Validate that access to http://another.abc.com should be disallowed
            // and access to http://xyz.abc.com allowed
            it("disallows subdomains not explicitly permitted", function () {
                testXhrGetFailsToLoadDocument('www2.Smoketest6-vmyyz.labyyz.testnet.rim.net');
            });
        });
    });

    // 07: Web APIs accessed from an external server, where subdomains=true and startup page is local
    describe("allowing access to web api on subdomains", function () {
        // 2: 1.Config.xml has declaration of different Web APIs to different subdomains of the same domain:
        // <access uri="http://rim.net" subdomains="true" >
        //         <feature id=... />
        // </access>
        // <access uri="http://atg06-yyz.devlab2k.testnet.rim.net" subdomains="true">
        //         <feature id=... />
        // </access>
        // The second URI (with subdomain specified) overloads the first.
        it("allows web api access explicitly set on a subdomain", function () {
            testExternalWebApiRuns('www.Smoketest7-vmyyz.labyyz.testnet.rim.net');
        });

        // 4: Start page of the widget is local and has link to external html page,
        // where Web API functions are called from.
        // Config.xml has declaration of Web APIs for certain domain that includes
        // path to a folder in web server directory structure:
        // <access uri="http://rim.net/FFMB_OTA" subdomains="true">
        //         <feature id=... />
        // </access>
        // Verify that access to Web API functions declared to this folder is allowed,
        // whereas access to Web API functions declared to different folder is not.
        it("allows web api access explicitly set on a folder", function () {
            testHtmlElementLoads('iframe', {src: 'http://Smoketest8-vmyyz.labyyz.testnet.rim.net/a/webworks.html' });
            testExternalWebApiRuns('Smoketest8-vmyyz.labyyz.testnet.rim.net', '/a/webworks.html');
        });
    });

    // 15: Access resources on device file system from external server, where startup page is local
    describe("accessing the filesystem", function () {
        // 2: Validate that access to device filesystem from remote server can be
        // allowed only for filesystem paths declared in config.xml, e.g.
        // if declared <access uri="file:///store/home/user"></access>,
        // then access to files in /store/home should be disallowed.
        it("can access whitelisted file:// path", function () {
            return testHtmlElementLoads('iframe', {src: 'file:///accounts/1000/shared/photos/blackberry10.jpg' });
        });
        it("cannot access arbitrary file:// path", function () {
            return testHtmlElementFailsToLoad('iframe', {src: 'file:///accounts/1000/shared/documents/textData.txt' });
        });

        // 3: Validate that if path to parent directory is declared in config.xml,
        // access to files in child directories will be allowed.
        // Use the widget attached in step 2, where config.xml:
        // <access uri='"/store/home/user/documents">
        // Validate that access to files in /store/home/user/documents/html is allowed.
        it("can access whitelisted file:// subdirectory", function () {
            return testHtmlElementLoads('iframe', {src: 'file:///accounts/1000/shared/photos/subdirectory/rainbow.gif' });
        });

        // 4: Validate that if path to file on device filesystem is not declared in the
        // ACCESS field in config.xml, access to this file is dislallowed  - user
        // is getting error "The resorce cannot be retrieved because it was not found in config.xml".
        it("cannot access a non-whitelisted file:// path", function () {
            return testHtmlElementFailsToLoad('iframe', {src: 'file:///etc/passwd' });
        });
    });

});
