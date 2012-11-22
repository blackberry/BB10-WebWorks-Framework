/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var srcPath = __dirname + '/../../../lib/';

describe("Utils", function () {
    var utils = require(srcPath + 'utils.js');

    describe("endsWith", function () {
        it("returns true when a string ends with another", function () {
            expect(utils.endsWith("www.smoketest9-vmyyz.labyyz.testnet.rim.net:8080", ".smoketest9-vmyyz.labyyz.testnet.rim.net:8080")).toEqual(true);
        });
    });

    it("Verify that the filenameToImageMIME is defined", function () {
        expect(utils.fileNameToImageMIME).toBeDefined();
    });

    it("Verify that the proper PNG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.png")).toEqual("image/png");
    });

    it("Verify that the proper period MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.t.png")).toEqual("image/png");
    });

    it("Verify that the proper JPG types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpg")).toEqual("image/jpeg");
    });

    it("Verify that the proper GIF types are returned", function () {
        expect(utils.fileNameToImageMIME("test.gif")).toEqual("image/gif");
    });

    it("Verify that the proper TIFF types are returned", function () {
        expect(utils.fileNameToImageMIME("test_test_.tif")).toEqual("image/tiff");
    });

    it("Verify that the proper TIFF types are returned", function () {
        expect(utils.fileNameToImageMIME("test_test_.tiff")).toEqual("image/tiff");
    });

    it("Verify that the proper JPE MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpe")).toEqual("image/jpeg");
    });

    it("Verify that the proper BMP MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.bmp")).toEqual("image/bmp");
    });

    it("Verify that the proper JPEG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.jpeg")).toEqual("image/jpeg");
    });

    it("Verify that the proper SVG MIME types are returned", function () {
        expect(utils.fileNameToImageMIME("test.svg")).toEqual("image/svg+xml");
    });

    // A cascading method invoker, kinda like jWorkflow
    describe("series", function () {
        var tasks,
            callbackObj,
            seriesComplete,
            callbackInvocations,
            invocationCounter,
            task;

        beforeEach(function () {
            tasks = [];
            callbackInvocations = [];
            invocationCounter = 0;
            seriesComplete = false;
            callbackObj = {
                func: function (args) {
                    callbackInvocations.push('done');
                    seriesComplete = true;
                },
                args: []
            };
            task = {
                func: function (callback) {
                    callbackInvocations.push(invocationCounter++);
                    callback();
                },
                args: []
            };
        });

        afterEach(function () {
            tasks = null;
            callbackObj = null;
            seriesComplete = null;
            callbackInvocations = null;
            invocationCounter = null;
            task = null;
        });

        it('should call callback right away when there are no tasks to execute', function () {
            spyOn(callbackObj, 'func');
            utils.series(tasks, callbackObj);
            expect(callbackObj.func).toHaveBeenCalled();
        });

        it('should invoke the task method before the callback', function () {
            tasks.push(task);
            utils.series(tasks, callbackObj);
            waitsFor(function () {
                return seriesComplete;
            });
           
            expect(callbackInvocations.length).toEqual(2);
            expect(callbackInvocations[0]).toEqual(0);
            expect(callbackInvocations[1]).toEqual('done');
        });

        it('should invocation the tasks in order with the callback being the last invocation', function () {
            var i;

            tasks.push(task);
            tasks.push(task);
            tasks.push(task);
            tasks.push(task);

            utils.series(tasks, callbackObj);

            waitsFor(function () {
                return seriesComplete;
            });
            
            expect(callbackInvocations.length).toEqual(5);

            for (i = 0; i < 4; i++) {
                expect(callbackInvocations[i]).toEqual(i);
            }

            expect(callbackInvocations[4]).toEqual('done');
        });
    });
});
