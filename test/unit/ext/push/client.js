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
var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/push",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {},
    constants = {
        "SUCCESS" : 0,
        "INTERNAL_ERROR" : 500,
        "INVALID_DEVICE_PIN" : 10001,
        "INVALID_PROVIDER_APPLICATION_ID" : 10002,
        "CHANNEL_ALREADY_DESTROYED" : 10004,
        "CHANNEL_ALREADY_DESTROYED_BY_PROVIDER" : 10005,
        "INVALID_PPG_SUBSCRIBER_STATE" : 10006,
        "PPG_SUBSCRIBER_NOT_FOUND" : 10007,
        "EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG" : 10008,
        "INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG" : 10009,
        "PPG_SUBSCRIBER_LIMIT_REACHED" : 10010,
        "INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER" : 10011,
        "CHANNEL_SUSPENDED_BY_PROVIDER" : 10012,
        "CREATE_SESSION_NOT_DONE" : 10100,
        "MISSING_PPG_URL" : 10102,
        "PUSH_TRANSPORT_UNAVAILABLE" : 10103,
        "OPERATION_NOT_SUPPORTED" : 10105,
        "CREATE_CHANNEL_NOT_DONE" : 10106,
        "MISSING_PORT_FROM_PPG" : 10107,
        "MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG" : 10108,
        "PPG_SERVER_ERROR" : 10110,
        "MISSING_INVOKE_TARGET_ID" : 10111,
        "SESSION_ALREADY_EXISTS" : 10112,
        "INVALID_PPG_URL" : 10114,
        "CREATE_CHANNEL_OPERATION" : 1,
        "DESTROY_CHANNEL_OPERATION" : 2
    },
    constantsLength = 0,
    defineROFieldArgs = [];

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("push", function () {
    beforeEach(function () {
        mockedWebworks.execSync = jasmine.createSpy().andReturn(2);
        mockedWebworks.event = { once : jasmine.createSpy().andReturn(3),
                                 isOn : jasmine.createSpy().andReturn(4) };
        mockedWebworks.defineReadOnlyField = jasmine.createSpy();
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        // client needs to be required for each test
        client = require(_apiDir + "/client");
        Object.getOwnPropertyNames(constants).forEach(function (c) {
            defineROFieldArgs.push([client.PushService, c, constants[c]]);
            constantsLength += 1;
        });
        spyOn(console, "error");
    });

    afterEach(function () {
        unloadClient();
        defineROFieldArgs = [];
        delete GLOBAL.window;
    });

    describe("push constants", function () {
        it("call defineReadOnlyField for each constant", function () {
            expect(mockedWebworks.defineReadOnlyField.callCount).toEqual(constantsLength);
        });

        it("call defineReadOnlyField with right params", function () {
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SUCCESS")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INTERNAL_ERROR")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_DEVICE_PIN")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_PROVIDER_APPLICATION_ID")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CHANNEL_ALREADY_DESTROYED")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CHANNEL_ALREADY_DESTROYED_BY_PROVIDER")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_PPG_SUBSCRIBER_STATE")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("PPG_SUBSCRIBER_NOT_FOUND")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("EXPIRED_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_AUTHENTICATION_TOKEN_PROVIDED_TO_PPG")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("PPG_SUBSCRIBER_LIMIT_REACHED")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_OS_VERSION_OR_DEVICE_MODEL_NUMBER")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CHANNEL_SUSPENDED_BY_PROVIDER")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CREATE_SESSION_NOT_DONE")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("MISSING_PPG_URL")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("PUSH_TRANSPORT_UNAVAILABLE")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("OPERATION_NOT_SUPPORTED")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CREATE_CHANNEL_NOT_DONE")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("MISSING_PORT_FROM_PPG")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("MISSING_SUBSCRIPTION_RETURN_CODE_FROM_PPG")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("PPG_SERVER_ERROR")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("MISSING_INVOKE_TARGET_ID")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SESSION_ALREADY_EXISTS")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("INVALID_PPG_URL")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CREATE_CHANNEL_OPERATION")]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("DESTROY_CHANNEL_OPERATION")]);
        });
    });


    describe("PushService", function () {
        it("has only one static method: create", function () {
            expect(client.PushService.create).toBeDefined();
            expect(client.PushService.createChannel).toBeUndefined();
            expect(client.PushService.destroyChannel).toBeUndefined();
            expect(client.PushService.extractPushPayload).toBeUndefined();
            expect(client.PushService.launchApplicationOnPush).toBeUndefined();
        });

        it("has several instance methods", function () {
            var pushService = new client.PushService();
            expect(pushService.createChannel).toBeDefined();
            expect(pushService.destroyChannel).toBeDefined();
            expect(pushService.extractPushPayload).toBeDefined();
            expect(pushService.launchApplicationOnPush).toBeDefined();
        });

        describe("create", function () {
            var invokeTargetIdError = "push.PushService.create: cannot call create() multiple times with different invokeTargetId's",
                appIdError = "push.PushService.create: cannot call create() multiple times with different appId's";

            it("sets up the create callback", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "push.create.callback", jasmine.any(Function));
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "startService", options);
            });

            it("allows multiple calls with the same parameters", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                });

                runs(function () {
                    options.appId = "";
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                    expect(mockedWebworks.event.once.callCount).toEqual(2);
                    expect(mockedWebworks.execSync.callCount).toEqual(2);
                });
            });

            it("throws an error when it is called again with a different invokeTargetId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                });

                runs(function () {
                    options.invokeTargetId = "differentInvokeTargetId";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(invokeTargetIdError);
                    expect(mockedWebworks.event.once.callCount).toEqual(1);
                    expect(mockedWebworks.execSync.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called again with a different appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                });

                runs(function () {
                    options.appId = "differentAppId";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(mockedWebworks.event.once.callCount).toEqual(1);
                    expect(mockedWebworks.execSync.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called twice, with an empty then non-empty appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                });

                runs(function () {
                    options.appId = "hello";

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(mockedWebworks.event.once.callCount).toEqual(1);
                    expect(mockedWebworks.execSync.callCount).toEqual(1);
                });
            });

            it("throws an error when it is called twice, with a non-empty then empty appId", function () {
                var options = { "invokeTargetId" : "invokeTargetId",
                                "appId" : "appId",
                                "ppgUrl" : "ppgUrl" },
                    successCallback,
                    failCallback,
                    simChangeCallback,
                    pushTransportReadyCallback;

                runs(function () {
                    expect(client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback)).toEqual(2);
                });

                runs(function () {
                    options = { "invokeTargetId" : "invokeTargetId",
                                "ppgUrl" : "ppgUrl" };

                    function createPushService() {
                        client.PushService.create(options, successCallback, failCallback, simChangeCallback, pushTransportReadyCallback);
                    }

                    expect(createPushService).toThrow(appIdError);
                    expect(mockedWebworks.event.once.callCount).toEqual(1);
                    expect(mockedWebworks.execSync.callCount).toEqual(1);
                });
            });
        });

        describe("createChannel", function () {
            it("sets up the createChannel callback", function () {
                var createChannelCallback,
                    pushService = new client.PushService();

                expect(pushService.createChannel(createChannelCallback)).toEqual(2);
                expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "push.createChannel.callback", jasmine.any(Function));
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "createChannel", null);
            });
        });

        describe("destroyChannel", function () {
            it("sets up the destroyChannel callback", function () {
                var destroyChannelCallback,
                    pushService = new client.PushService();

                expect(pushService.destroyChannel(destroyChannelCallback)).toEqual(2);
                expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "push.destroyChannel.callback", destroyChannelCallback);
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "destroyChannel", null);
            });
        });

        describe("extractPushPayload", function () {
            var extractPayloadError = "push.PushService.extractPushPayload: the invoke object was invalid and no PushPayload could be extracted from it";

            it("returns a PushPayload object", function () {
                var invokeObject = { "data" : "ABC", "action" : "bb.action.PUSH" },
                    calledObject = { "data" : "ABC" },
                    returnPayload = { "valid" : true },
                    pushService = new client.PushService(),
                    pushPayload;

                mockedWebworks.execSync = jasmine.createSpy().andReturn(returnPayload);
                pushPayload = pushService.extractPushPayload(invokeObject);

                expect(pushPayload).toBeDefined();
                expect(pushPayload).toEqual(jasmine.any(client.PushPayload));
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "extractPushPayload", calledObject);
            });

            it("checks that there is a data field in the invoke object", function () {
                var invokeObject = { "action" : "bb.action.PUSH" },
                    pushService = new client.PushService();

                mockedWebworks.execSync = jasmine.createSpy();

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(mockedWebworks.execSync).not.toHaveBeenCalled();
            });

            it("checks that the invoke action is bb.action.PUSH", function () {
                var invokeObject = { "data" : "ABC" },
                    pushService = new client.PushService();

                mockedWebworks.execSync = jasmine.createSpy();

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(mockedWebworks.execSync).not.toHaveBeenCalled();
            });

            it("checks that the returned payload is valid", function () {
                var invokeObject = { "data" : "ABC", "action" : "bb.action.PUSH" },
                    calledObject = { "data" : "ABC" },
                    returnPayload = { "valid" : false },
                    pushService = new client.PushService();

                mockedWebworks.execSync = jasmine.createSpy().andReturn(returnPayload);

                function extractPayload() {
                    pushService.extractPushPayload(invokeObject);
                }

                expect(extractPayload).toThrow(extractPayloadError);
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "extractPushPayload", calledObject);
            });
        });

        describe("launchApplicationOnPush", function () {
            it("sets up the launchApplicationOnPush callback", function () {
                var shouldLaunch = true,
                    shouldLaunchObj = {"shouldLaunch" : shouldLaunch},
                    launchApplicationCallback,
                    pushService = new client.PushService();

                expect(pushService.launchApplicationOnPush(shouldLaunch, launchApplicationCallback)).toEqual(2);
                expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, "push.launchApplicationOnPush.callback", launchApplicationCallback);
                expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "launchApplicationOnPush", shouldLaunchObj);
            });
        });
    });

    describe("PushPayload", function () {
        it("contains only instance members and methods", function () {
            expect(client.PushPayload.data).toBeUndefined();
            expect(client.PushPayload.headers).toBeUndefined();
            expect(client.PushPayload.id).toBeUndefined();
            expect(client.PushPayload.isAcknowledgeRequired).toBeUndefined();
            expect(client.PushPayload.acknowledge).toBeUndefined();
        });

        it("calls defineReadOnlyField on the instance members", function () {
            var payloadObject = {},
                pushPayload;

            payloadObject.data = "world";
            payloadObject.headers = { webworks : "blackberry" };
            payloadObject.id = "hello";
            payloadObject.isAcknowledgeRequired = false;

            pushPayload = new client.PushPayload(payloadObject);

            expect(pushPayload).toBeDefined();
            expect(pushPayload).toEqual(jasmine.any(client.PushPayload));

            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain([pushPayload, "data", payloadObject.data]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain([pushPayload, "headers", payloadObject.headers]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain([pushPayload, "id", payloadObject.id]);
            expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain([pushPayload, "isAcknowledgeRequired", payloadObject.isAcknowledgeRequired]);
        });

        it("can acknowledge the push notification", function () {
            var shouldAcceptPush = true,
                pushPayload = new client.PushPayload("hello"),
                args = { "id": "id", "shouldAcceptPush": shouldAcceptPush };

            pushPayload.id = "id";
            expect(pushPayload.acknowledge(shouldAcceptPush)).toEqual(2);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "acknowledge", args);
        });
    });
});

