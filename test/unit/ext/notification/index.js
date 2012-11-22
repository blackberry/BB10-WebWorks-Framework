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
    mockNotification,
    successCB,
    failCB;

describe("notification index", function () {
    beforeEach(function () {
        mockNotification = {
            notify: jasmine.createSpy("Notification 'notify' method"),
            remove: jasmine.createSpy("Notification 'remove' method")
        };
        GLOBAL.qnx = {
            webplatform: {
                notification: mockNotification
            }
        };
        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
    });

    afterEach(function () {
        delete GLOBAL.qnx;
        mockNotification = null;
        index = null;
        successCB = null;
        failCB = null;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("methods", function () {
        var args;

        beforeEach(function () {
            args = {
                id : 100,
                title : JSON.stringify(encodeURIComponent("TheTitle")),
                options: JSON.stringify({tag: encodeURIComponent("TheTag")})
            };
        });

        afterEach(function () {
            args = null;
        });

        it("Should have 'notify' method defined", function () {
            expect(index.notify).toBeDefined();
            expect(typeof index.notify).toEqual("function");
        });

        it("Should have 'remove' method defined", function () {
            expect(index.remove).toBeDefined();
            expect(typeof index.remove).toEqual("function");
        });

        describe("notify method", function () {
            afterEach(function () {
                expect(mockNotification.remove).toHaveBeenCalledWith(args.options);
                delete require.cache[require.resolve(_libDir + "config")];
            });

            it("Should invoke notification notify method when making a call with required parameters", function () {
                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke notification notify method when making a call with all parameters", function () {
                args.options = JSON.stringify({tag: encodeURIComponent("TheTag"), 'body': encodeURIComponent("TheSubtitle"), 'target': encodeURIComponent("The.Target"), 'targetAction': encodeURIComponent("The.Target.Action"),
                      'payload': encodeURIComponent("Payload"), 'payloadType': encodeURIComponent("PayloadType"), 'payloadURI': encodeURIComponent("http://www.payload.uri")});

                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke notification notify with default targetAction if target is provided but no targetAction wasn't", function () {
                var defaultTargetAction = "bb.action.OPEN";

                args.options = JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': encodeURIComponent("The.Target")});

                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(args.options.targetAction).toEqual(defaultTargetAction);
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke notificatoin notify with no default targetAction if target is an empty string", function () {
                args.options = JSON.stringify({tag: encodeURIComponent("TheTag"), 'target': ""});

                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(args.options.target).toBeDefined();
                expect(args.options.target).toEqual("");
                expect(args.options.targetAction).not.toBeDefined();
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should invoke notification notify with no default targetAction if target is not provided", function () {
                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(args.options.target).not.toBeDefined();
                expect(args.options.targetAction).not.toBeDefined();
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should set target from first occurrence of applicaiton type target in config and pass it to notify method", function () {
                var viewerTarget = "bb.notification.target.viewer",
                    appTargetFirst = "bb.notification.target.app.first",
                    appTargetSecond = "bb.notification.target.app.second",
                    defaultTargetAction = "bb.action.OPEN",
                    config = require(_libDir + "config");


                config["invoke-target"] = [{
                    "@": {"id": viewerTarget},
                    "type": "VIEWER"
                },
                {
                    "@": {"id": appTargetFirst},
                    "type": "APPLICATION"
                },
                {
                    "@": {"id": appTargetSecond},
                    "type": "APPLICATION"
                }];

                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(args.options.target).toEqual(appTargetFirst);
                expect(args.options.targetAction).toEqual(defaultTargetAction);
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });

            it("Should not set target and targetAction if not provided and no in config", function () {
                index.notify(successCB, failCB, args);
                expect(mockNotification.notify).toHaveBeenCalledWith(args, jasmine.any(Function));
                expect(args.options.target).not.toBeDefined();
                expect(args.options.targetAction).not.toBeDefined();
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });
        });
        describe("remove method", function () {
            it("Should call notification remove method when remove is called.", function () {
                args.tag = JSON.stringify(encodeURIComponent("TheTag"));
                index.remove(successCB, failCB, args);
                expect(mockNotification.remove).toHaveBeenCalledWith(args.tag);
                expect(failCB).not.toHaveBeenCalled();
                expect(successCB).toHaveBeenCalled();
            });
        });
    });
});
