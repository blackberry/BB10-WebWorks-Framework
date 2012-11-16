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
        element.onabort = jasmine.createSpy();
        mixin(attributes, element);
        document.body.appendChild(element);
        waitsFor(function () {
            return element.onerror.wasCalled || element.onload.wasCalled || element.onabort.wasCalled;
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

    function testBase64ImageLoads() {
        var url = "data:image/jpeg;base64,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";
        return testHtmlElementLoads('img', {src: url });
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

    function testExternalWhitelistedWebAPIScript(domain) {
        var url = "http://" + domain + "/webapi_whitelisted.js?v=" + generateSerial(),
            script;
        runs(function () {
            delete window.Whitelisted;
            script = testHtmlElementLoads('script', {type: "text/javascript", src: url});
        });
        runs(function () {
            expect(window.Whitelisted).toBeDefined();
            expect(window.Whitelisted.getAppId).toBeDefined();
            expect(window.Whitelisted.getAppId()).toBeDefined();
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

    function testExternalWebApi(domain, path, shouldFail, message) {
        var origin = 'http://' + domain,
            url = origin + (path || '/a/webworks.html'),
            iframe,
            reply = null,
            receiveMessage = function (e) {
                if (e.data === 'wwready') {
                    var messageToSend = message || 'ping';
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage(messageToSend, origin);
                    } else {
                        window.removeEventListener('message', this);
                    }
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
            if (shouldFail) {
                expect(reply).not.toBeDefined();
            } else {
                expect(reply).toBe(blackberry.app.id);
            }

            window.removeEventListener('message', receiveMessage);
        });

        return iframe;
    }

    function testExternalWebApiFailsToRun(domain, path, messageToSend) {
        testExternalWebApi(domain, path, true, messageToSend);
    }

    function testExternalWebApiRuns(domain, path, messageToSend) {
        testExternalWebApi(domain, path, false, messageToSend);
    }

    function testWebApisForIframe(iframe, origin, whitelistedApi) {
        var whitelistedApiMessageReceived = false,
            nonWhitelistedApiMessageReceived = false,
            reply = null,
            receiveMessage = function (e) {
                var data = JSON.parse(e.data);

                if (data.message === 'whitelistedApi') {
                    reply = data.reply;
                    whitelistedApiMessageReceived = true;
                } else if (data.message === 'nonWhitelistedApi') {
                    reply = data.reply;
                    nonWhitelistedApiMessageReceived = true;
                } else if (data.message === 'wwready') {
                    iframe.contentWindow.postMessage('whitelistedApi', origin);
                }
            };

        runs(function () {
            window.addEventListener('message', receiveMessage, false);
            iframe.contentWindow.postMessage('whitelistedApi', origin);
        });

        // Wait for the response from the whitelist api invocation
        waitsFor(function () {
            return whitelistedApiMessageReceived;
        }, "waiting for first external whitelist api response", 10000);
        runs(function () {
            // If we are on the second frame it should fail
            expect(reply).toBe(whitelistedApi);

            // Reset to previous states
            whitelistedApiMessageReceived = false;
        });

        runs(function () {
            iframe.contentWindow.postMessage('nonWhitelistedApi', origin);
        });

        // Wait for the response from the non-whtelist api invocation
        waitsFor(function () {
            return nonWhitelistedApiMessageReceived;
        }, "wating for second external non-whitelist api response", 10000);

        runs(function () {
            expect(reply).not.toBeDefined();
            nonWhitelistedApiMessageReceived = false;
        });

        // Remove previous message handler to make way for a new one for the new page
        runs(function () {
            window.removeEventListener('message', receiveMessage);
        });
    }

    function testExternalToExternalWebApiFails(domain, path1, path2) {
        var origin = 'http://' + domain,
            url = origin + path1,
            iframe,
            secondPageLoaded = false,
            wwReady = false,
            wwReadyHandler = function (e) {
                if (e.data === 'wwready') {
                    wwReady = true;
                }
            };

        runs(function () {
            window.addEventListener('message', wwReadyHandler, false);
            iframe = testHtmlElementLoads('iframe', {src: url});
        });

        waitsFor(function () {
            return wwReady;
        }, "first external wwready event", 10000);

        runs(function () {
            wwReady = false;
            window.removeEventListener('message', wwReadyHandler);
        });

        runs(function () {
            testWebApisForIframe(iframe, origin, blackberry.app.id);
        });

        // Load the second page from the first external page
        runs(function () {
            window.addEventListener('message', wwReadyHandler, false);
            iframe.onload = function () {
                secondPageLoaded = true;
            };
            iframe.src = "http://" + domain + path2;
        });

        waitsFor(function () {
            return secondPageLoaded && wwReady;
        }, "second external page to load && wwready event fired", 10000);

        runs(function () {
            window.removeEventListener('message', wwReadyHandler);
            testWebApisForIframe(iframe, origin, blackberry.system.language);
        });
    }

    function createTestDirectory(dirName) {
        var errorHandler = jasmine.createSpy().andCallFake(function (e) {
                console.log('Directory write failure', JSON.stringify(e));
            }),
            directoryMade = false;

        runs(function () {
            window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {
                fs.root.getDirectory(dirName, {create : true}, function (dirEntry) {
                    directoryMade = true;
                }, errorHandler);
            });
        });

        waitsFor(function () {
            return directoryMade;
        }, "waited for directory to get made", 5000);

        runs(function () {
            expect(errorHandler).not.toHaveBeenCalled();
        });
    }

    function writeTestFile(fileName) {
        var errorHandler = jasmine.createSpy().andCallFake(function (e) {
                console.log('File write failure', JSON.stringify(e));
            }),
            fileWritten = false,
            bb = new window.WebKitBlobBuilder();

        runs(function () {
            blackberry.io.sandbox = false;

            function gotWriter(fileWriter) {
                fileWriter.onwriteend = function (e) {
                    fileWritten = true;
                };
                bb.append('this is text data');
                fileWriter.write(bb.getBlob('text/plain'));
            }

            function gotFile(fileEntry) {
                fileEntry.createWriter(gotWriter, errorHandler);
            }

            function onInitFs(fs) {
                fs.root.getFile(fileName, {create: true}, gotFile, errorHandler);
            }

            window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs, errorHandler);
        });

        waitsFor(function () {
            return fileWritten;
        }, "File write never completed", 5000);

        runs(function () {
            expect(errorHandler).wasNotCalled();
            expect(fileWritten).toBe(true);
        });
    }


    beforeEach(function () {
        spyOn(window, "alert").andCallFake(function (m) {
            console.log(m);
        });
    });

    afterEach(function () {
        while (appendedElements.length > 0) {
            document.body.removeChild(appendedElements.pop());
        }
    });

    // 02. Allowed access from local startup page to external resources through URI domains
    describe("allowing access to domains", function () {

        var whitelistedDomain = "smoketest1-vmyyz.labyyz.testnet.rim.net:8080";

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

            it('can load an image using data-uris', function () {
                testBase64ImageLoads();
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
                testXhrGetLoadsUrl("http://smoketest3-vmyyz.labyyz.testnet.rim.net:8080/index.html?a=b&c=d&v=" + generateSerial());
            });

            it("cannot append params to a path whitelisted without ?*", function () {
                //Will not throw an exception because its not blocked by webkit
                //BUT will now throw an exception for being a denied synchronous request
                testXhrGetFailsToLoadUrl("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/index.html?a=b&c=d&v=" + generateSerial());
            });
        });

        // Step 3: Widget has links that include port number. Validate that clicking the link
        // opens an expected page (page with a link "Display current time").
        //
        //THIS TEST SHOULD BE REVERSED AND EXPANDED.
        //Currently all pages are using a port number so in fact we need the negative of this highly tested
        //
        //
        //
        //
        it("can follow a link including a port number", function () {
            var url = 'http://' + whitelistedDomain + '/index.html';
            return testHtmlElementLoads('iframe', {src: url });
        });

    });

    // 03. Disallowed access from local startup page to external resources through URI domains
    describe("disallowing access to domains", function () {

        var blacklistedDomain = "smoketest2-vmyyz.labyyz.testnet.rim.net:8080";

        // Step 1: Validate that access to external html page, image, Javascript, Web API functions
        // is not allowed from the widget, if this particular URI domain is not provided in config.xml,
        // while it is provided for another domain:
        describe("by various methods", function () {
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

        // Step 3: Validate that widget does not have access to resources in parent or parallel directories
        // of URI specified in the <access> element in config.xml.
        describe("at specific paths", function () {
            it("can access /a/index.html", function () {
                testXhrGetLoadsUrl("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/a/index.html");
            });
            //This is NOT blocked by webkit, but an exception will be thrown because it was denied
            it("cannot access sibling folder /b/index.html", function () {
                testXhrGetFailsToLoadUrl("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/b/index.html");
            });
            // This IS blocked since we don't have an access element for the parent directory
            it("cannot access the parent resource index.html", function () {
                testXhrGetFailsToLoadUrl("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/parent/index.html");
            });
        });
    });

    // 04. Allowed access from local startup page to external resources through URI subdomains
    describe("allowing access to subdomains", function () {

        var whitelistedSubdomain = "www.smoketest7-vmyyz.labyyz.testnet.rim.net:8080";

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
            testXhrGetLoadsUrl('http://smoketest8-vmyyz.labyyz.testnet.rim.net:8080/redirect.php?url=' + encodeURIComponent('http://smoketest1-vmyyz.labyyz.testnet.rim.net:8080/index.html'));
        });
    });

    // 05. Disallowed access from local startup page to external resources through URI subdomains
    describe("disallowing access to subdomains", function () {

        var blacklistedSubdomain = "www.smoketest1-vmyyz.labyyz.testnet.rim.net:8080";

        // Step 1: Validate that access to external html page / image / javascript,
        // which URIs include subdomains, is not allowed, if subdomains=false, e.g.,
        // if access element is specified in the following way:
        describe("by various methods", function () {
            it("cannot xhr request an external html page", function () {
                testXhrGetFailsToLoadDocument(blacklistedSubdomain);
            });

            //Cannot currently be tested because iframes will not fire onload, onerror or onabort
            xit('cannot navigate to external html page', function () {
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
            testXhrGetFailsToLoadDocument('www.smoketest5-vmyyz.labyyz.testnet.rim.net:8080');
        });

        // Step 3
        describe("explicitly allowed subdomains", function () {
            // 1: Validate that if subdomains=false in config.xml for a certain domain,
            // that does not affect another explicitely provided URI with same domain
            // and different subdomain , e.g.
            // <access uri="http://abc.com" subdomains="false" /> </access>
            // <access uri="http://xyz.abc.com"/></access>
            it("explicitly allows subdomains", function () {
                testXhrGetLoadsDocument('www.smoketest6-vmyyz.labyyz.testnet.rim.net:8080');
            });

            // 2: Validate that access to http://another.abc.com should be disallowed
            // and access to http://xyz.abc.com allowed
            it("disallows subdomains not explicitly permitted", function () {
                testXhrGetFailsToLoadDocument('www2.smoketest6-vmyyz.labyyz.testnet.rim.net:8080');
            });
        });
    });

    // 07: Web APIs accessed from an external server, where subdomains=true and startup page is local
    describe("allowing access to web api on subdomains from external subdomains", function () {
        var externalDomain = "smoketest9-vmyyz.labyyz.testnet.rim.net:8080";

        // 2: Start page is local and has a link to an external page with Web API permissions.
        //    The external page has a link to another external page _on a seperate subdomain_ but
        //    same domain. This second external page also has Web API permissions.
        describe("access apis from local->external->external", function () {
            it("can access whitelisted wep apis on local page", function () {
                expect(blackberry.app.id).toBeDefined();
            });

            it("can access web apis from external page 1 which was linked from previous local page", function () {
                testExternalWebApiRuns(externalDomain, "/d/webworks.html", "whitelistedApi");
            });

            it("cannot access non-whitelisted web apis from external page 1", function () {
                testExternalWebApiFailsToRun(externalDomain, "/d/webworks.html", "nonWhitelistedApi");
            });

            it("cannot access whitelisted web api from previous page on second external page", function () {
                testExternalToExternalWebApiFails(externalDomain, "/e/webworks.html", "/e/webworks2.html");
            });
        });

        // 3: Same as previous test case but external page 1 is hosted on a proxy server
        //    (Currently don't have a proxy server so we can't test this)

        // 4: Ignore, handled in previous cases

        // 5: Same as previous test cases but external pages have different subfolder access / location
        //    (Pretty pointless to test since we already test different subfolder access and locations)

        // 6: Start page is local and has links to 5 external pages which have different properties such as different
        //    subdomains, different subfolders etc.
        //    (Already cover a lot of the test cases)

        // 8: Same as previous steps but web api calls are defined in a file located on an external server
        //    (Not really needed)

        // 9: Start up page is local and has links to 2 external pages which belong to different subfolders and
        //    have different web api permissions. Also has a link to 2 local pages which are in different subfolders

        // 10: Start up page is local and trys to execute an external script which includes an web api call
        describe("local page executing an external script with web api calls", function () {
            it("allows execution of external script which contains whitelisted web api call", function () {
                testExternalWhitelistedWebAPIScript(externalDomain);
            });
        });
    });

    // 08: Access resources from external server through URI subdomains=false, where startup page is local
    describe("accessing resources from external server, subdomains=false", function () {
        var whitelistedSubdomain = "smoketest10-vmyyz.labyyz.testnet.rim.net:8080";

        // 1: Verify access to resources
        describe("can accessing resources on external page", function () {
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

        // 2: Check access of web api invocations from external scripts as well as external pages
        describe("explicitly allowed subdomains", function () {
            it("explicitly allows subdomains", function () {
                testXhrGetLoadsDocument(whitelistedSubdomain);
            });

            it("disallows subdomains not explicitly permitted", function () {
                testXhrGetFailsToLoadDocument('www2.' + whitelistedSubdomain);
            });

            it("can access web apis from external page 1 which was linked from previous local page", function () {
                testExternalWebApiRuns(whitelistedSubdomain, "/d/webworks.html", "whitelistedApi");
            });

            it("cannot access non-whitelisted web apis from external page 1", function () {
                testExternalWebApiFailsToRun(whitelistedSubdomain, "/d/webworks.html", "nonWhitelistedApi");
            });
        });

        // 3: Similar to a test I do in 07 (Tests local->external and accessing whitelisted/blacklisted apis)
    });

    // 09: Web APIs accessed from an external server, where subdomains=false and startup page is local
    // (Similar to test case 07 but subdomains=false)
    describe("web apis access from external server", function () {
        var externalDomain = "smoketest8-vmyyz.labyyz.testnet.rim.net:8080";

        describe("access apis from local->external->external", function () {
            it("can access whitelisted wep apis on local page", function () {
                expect(blackberry.app.id).toBeDefined();
            });

            it("can access web apis from external page 1 which was linked from previous local page", function () {
                testExternalWebApiRuns(externalDomain, "/d/webworks.html", "whitelistedApi");
            });

            it("cannot access non-whitelisted web apis from external page 1", function () {
                testExternalWebApiFailsToRun(externalDomain, "/d/webworks.html", "nonWhitelistedApi");
            });

            it("cannot access whitelisted web api from previous page on second external page", function () {
                testExternalToExternalWebApiFails(externalDomain, "/e/webworks.html", "/e/webworks2.html");
            });
        });

        describe("local page executing an external script with web api calls", function () {
            it("allows execution of external script which contains whitelisted web api call", function () {
                testExternalWhitelistedWebAPIScript(externalDomain);
            });
        });
    });

    // 15: Access resources on device file system from external server, where startup page is local
    describe("accessing the filesystem", function () {
        // 2: Validate that access to device filesystem from remote server can be
        // allowed only for filesystem paths declared in config.xml, e.g.
        // if declared <access uri="file:///store/home/user"></access>,
        // then access to files in /store/home should be disallowed.
        it("can access whitelisted file:// path", function () {
            writeTestFile("/accounts/1000/shared/documents/textData.txt");

            runs(function () {
                console.log(blackberry.io.sharedFolder + '/documents/textData.txt');
                testHtmlElementLoads('iframe', {src: 'file:///accounts/1000/shared/documents/textData.txt' });
            });
        });

        //Not true on an insecure device
        xit("cannot access arbitrary file:// path", function () {
            return testHtmlElementFailsToLoad('iframe', {src: 'file:///etc/passwd' });
        });

        // 3: Validate that if path to parent directory is declared in config.xml,
        // access to files in child directories will be allowed.
        // Use the widget attached in step 2, where config.xml:
        // <access uri='"/store/home/user/documents">
        // Validate that access to files in /store/home/user/documents/html is allowed.
        it("can access whitelisted file:// subdirectory", function () {
            createTestDirectory("/accounts/1000/shared/documents/subdir");
            writeTestFile("/accounts/1000/shared/documents/subdir/textData.txt");

            runs(function () {
                testHtmlElementLoads('iframe', {src: 'file:///accounts/1000/shared/documents/subdir/textData.txt' });
            });
        });

        // 4: Validate that if path to file on device filesystem is not declared in the
        // ACCESS field in config.xml, access to this file is dislallowed  - user
        // is getting error "The resorce cannot be retrieved because it was not found in config.xml".
        it("cannot access a non-whitelisted file:// path", function () {
            return testXhrGetFailsToLoadUrl('file:///etc/passwd');
        });
    });

});
