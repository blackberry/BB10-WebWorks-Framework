describe("Cross Origin Wildcard", function () {
    var appendedElements = [];

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

    function writeTestFile() {
        var errorHandler = jasmine.createSpy().andCallFake(function (e) {
                console.log(e);
            }),
            fileWritten = false,
            dir = "/accounts/1000/shared/documents/",
            fileName = "textData.txt",
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
                fs.root.getFile(dir + fileName, {create: true}, gotFile, errorHandler);
            }

            window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs, errorHandler);
        });

        waitsFor(function () {
            return fileWritten;
        }, "File write never completed", 5000);

        runs(function () {
            expect(errorHandler).wasNotCalled();
            expect(fileWritten).toBe(true);

            testHtmlElementLoads('iframe', {src: 'file:///accounts/1000/shared/documents/textData.txt' });
        });
    }

    beforeEach(function () {
        spyOn(window, "alert");
    });

    afterEach(function () {
        while (appendedElements.length > 0) {
            document.body.removeChild(appendedElements.pop());
        }
    });

    // 15. Access resources on device file system from external server, where startup page is local
    describe("wildcard access device from local startup page", function () {
        // 1. Startup page is local.
        it("can access whitelisted file:// path", function () {
            writeTestFile();

            runs(function () {
                testHtmlElementLoads('iframe', { src : 'file:///accounts/1000/shared/documents/textData.txt' });
            });
        });
    });
});