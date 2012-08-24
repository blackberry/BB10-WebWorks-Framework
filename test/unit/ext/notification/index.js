/*
 * Copyright 2012 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/notification/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    mockedPPS,
    successCB,
    failCB,
    getPPSForWrite;

describe("notification index", function () {
    beforeEach(function () {
        mockedPPS = {
            write : jasmine.createSpy("PPS 'write' method"),
            open: jasmine.createSpy("PPS 'open' Method"),
            onNewData: jasmine.createSpy("PPS 'onNewData' Method"),
            onOpenFailed: jasmine.createSpy("PPS 'onOpenFailed' Method"),
            onWriteFailed: jasmine.createSpy("PPS 'onWriteFailed' Method")
        };
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                pps: {
                    create: function () {
                        return mockedPPS;
                    },
                    PPSMode: {
                        FULL: 0
                    },
                    FileMode: {
                        RDWR: 2
                    }
                }
            }
        };

        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
        getPPSForWrite = jasmine.createSpy().andReturn(mockedPPS);
    });

    afterEach(function () {
        mockedPPS = null;
        GLOBAL.window.qnx = null;
        index = null;
        successCB = null;
        failCB = null;
        delete require.cache[require.resolve(_apiDir + "index")];
        getPPSForWrite = null;
    });

    describe("methods", function () {
        it("Should have 'notify' method defined", function () {
            expect(index.remove).toBeDefined();
            expect(typeof index.remove).toEqual("function");
        });

        it("Should have 'remove' method defined", function () {
            expect(index.remove).toBeDefined();
            expect(typeof index.remove).toEqual("function");
        });

        it("Should have 'close' method defined", function () {
            expect(index.close).toBeDefined();
            expect(typeof index.close).toEqual("function");
        });

        describe("notify method", function () {
            var config;

            beforeEach(function () {
                config = require(_libDir + "config");
            });

            afterEach(function () {
                delete require.cache[require.resolve(_libDir + "config")];
                config = null;
            });

            it("Should invoke write method for notify of pps when calling notification notify with required parameters", function () {
                var args = {
                    id : 100,
                    title : JSON.stringify(encodeURIComponent("TheTitle")),
                    options: JSON.stringify({tag: encodeURIComponent("TheTag")})
                };

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke write method for notify of pps when calling notification notify with all parameters", function () {
                var args = {
                    id : 100,
                    title : JSON.stringify(encodeURIComponent("TheTitle")),
                    options: JSON.stringify({tag: encodeURIComponent("TheTag"), 'body': encodeURIComponent("TheSubtitle"), 'target': encodeURIComponent("The.Target"), 'targetAction': encodeURIComponent("The.Target.Action"),
                          'payload': encodeURIComponent("Payload"), 'payloadType': encodeURIComponent("PayloadType"), 'payloadURI': encodeURIComponent("http://www.payload.uri")})
                };

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag, 'subtitle': args.options.body,
                'target': args.options.target, 'targetAction': args.options.targetAction, 'payload': args.options.payload, 'payloadType': args.options.payloadType, 'payloadURI': args.options.payloadURI}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke write with default targetAction if target is provided but no targetAction", function () {
                var args = {
                        id : 100,
                        title : JSON.stringify(encodeURIComponent("TheTitle")),
                        options: JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': encodeURIComponent("The.Target")})
                    },
                    defaultTargetAction = "bb.action.OPEN";

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag, 'target': args.options.target, 'targetAction': defaultTargetAction}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke write with no default targetAction if target is an empty string", function () {
                var args = {
                        id : 100,
                        title : JSON.stringify(encodeURIComponent("TheTitle")),
                        options: JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': ""})
                    };

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag, 'target' : args.options.target}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke write with no default targetAction if target is not provided", function () {
                var args = {
                        id : 100,
                        title : JSON.stringify(encodeURIComponent("TheTitle")),
                        options: JSON.stringify({tag: encodeURIComponent("TheTag")})
                    };

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should set target from first occurence of applicaiton type target in config and pass to write", function () {
                var args = {
                        id : 100,
                        title : JSON.stringify(encodeURIComponent("TheTitle")),
                        options: JSON.stringify({tag: encodeURIComponent("TheTag")})
                    };

                config["invoke-target"] = [{
                    "@": {"id": "bb.notification.index.unittest"},
                    "type": "APPLICATION"
                }];

                index.notify(successCB, failCB, args);
                expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'notify', 'id': args.id, dat: {'title': args.title, 'itemid': args.options.tag, 'target': config["invoke-target"][0]["@"].id, 'targetAction': "bb.action.OPEN"}});
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });
        });

        it("Should invoke write for delete method of pps when calling notification notify", function () {
            var args = {
                id : 100,
                title : JSON.stringify(encodeURIComponent("TheTitle")),
                options: JSON.stringify({tag: encodeURIComponent("TheTag")})
            };

            index.notify(successCB, failCB, args);
            expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'delete', dat: {'itemid': args.options.tag}});
            expect(failCB).not.toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
        });

        it("Should invoke write method for delete of pps when calling notification remove", function () {
            var args = {
                id : 100,
                tag : JSON.stringify(encodeURIComponent("TheTag"))
            };

            index.remove(successCB, failCB, args);

            expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'delete', dat: {'itemid': args.tag}});
            expect(failCB).not.toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
        });

        it("Should invoke write for delete method of pps when calling notification close", function () {
            var args = {
                id : 100,
                tag : JSON.stringify(encodeURIComponent("TheTag"))
            };

            index.close(successCB, failCB, args);

            expect(mockedPPS.write).toHaveBeenCalledWith({'msg': 'delete', 'id': args.id, dat: {'itemid': args.tag}});
            expect(failCB).not.toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();
        });
    });
});
