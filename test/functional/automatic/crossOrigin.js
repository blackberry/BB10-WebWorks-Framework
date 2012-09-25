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

    function testExternalBlacklistedWebAPIScript(domain) {
        var url = "http://" + domain + "/webapi_blacklisted.js?v=" + generateSerial(),
            script;
        runs(function () {
            delete window.Blacklisted;
            script = testHtmlElementLoads('script', {type: "text/javascript", src: url});
        });
        runs(function () {
            expect(window.Blacklisted).toBeDefined();
            expect(window.Blacklisted.getAppId).toBeDefined();
            expect(window.Blacklisted.getAppId()).not.toBeDefined();
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
                if (iframe) {
                    if (e.data === 'wwready') {
                        var messageToSend = message || 'ping';
                        iframe.contentWindow.postMessage(messageToSend, origin);
                    } else {
                        reply = e.data;
                    }
                } else {
                    window.removeEventListener('message', this);
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
        var messageReceived = false,
            whitelistedApiMessageReceived = false,
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
                testXhrGetThrowsAlert("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/index.html?a=b&c=d&v=" + generateSerial());
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
                testXhrGetLoadsUrl("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/a/index.html");
            });
            //This is NOT blocked by webkit so no exception will be throw, but an alert will still be called
            it("cannot access sibling folder /b/index.html", function () {
                testXhrGetThrowsAlert("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/b/index.html");
            });
            // This IS blocked since we don't have an access element for the parent directory
            it("cannot access the parent resource index.html", function () {
                testXhrGetThrowsAlert("http://smoketest4-vmyyz.labyyz.testnet.rim.net:8080/parent/index.html");
            });
        });
    });

    // 04. Allowed access from local startup page to external resources through URI subdomains
    describe("allowing access to subdomains", function () {

        var whitelistedSubdomain = "www.smoketest9-vmyyz.labyyz.testnet.rim.net:8080";

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
        xit("cannot access a non-whitelisted file:// path", function () {
            return testHtmlElementFailsToLoad('iframe', {src: 'file:///etc/passwd' });
        });
    });

});
