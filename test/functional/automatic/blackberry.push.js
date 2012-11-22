/*
 * Copyright 2010-2012 Research In Motion Limited.
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

describe("blackberry.push.PushService", function () {
    var constants = { "SUCCESS" : 0,
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
                      "DESTROY_CHANNEL_OPERATION" : 2},
        pushService;


    it("blackberry.push.PushService should exist", function () {
        expect(blackberry.push).toBeDefined();
        expect(blackberry.push.PushService).toBeDefined();
    });
    
    it("blackberry.push.PushService.* should be defined", function () {
        var field;
        /*jshint forin: false */
        for (field in constants) {
            expect(blackberry.push.PushService[field]).toBeDefined();
            expect(blackberry.push.PushService[field]).toEqual(constants[field]);
        }
    });
    
    it("blackberry.push.PushService.* should be read-only", function () {
        var field,
            old_value;

        /*jshint forin: false */
        for (field in constants) {
            old_value = blackberry.push.PushService[field];
            blackberry.push.PushService[field] = "MODIFIED";
            expect(blackberry.push.PushService[field]).toEqual(old_value);
        }
    });
    
    it("should fail to create a session and call the fail callback", function () {
        var onSuccess,
            onFail,
            onSimChange,
            onPushTransportReady;

        runs(function () {
            var options = { invokeTargetId : "", 
                            appId : "1-RDce63it6363", 
                            ppgUrl : "http://pushapi.eval.blackberry.com" };
            
            onSuccess = jasmine.createSpy();
            onFail = jasmine.createSpy();
            onSimChange = jasmine.createSpy();
            onPushTransportReady = jasmine.createSpy();

            blackberry.push.PushService.create(options, onSuccess, onFail, onSimChange, onPushTransportReady);
        });

        waitsFor(function () {
            return onFail.callCount;
        }, "fail callback never fired", 15000);

        runs(function () {
            expect(onFail).toHaveBeenCalledWith(blackberry.push.PushService.MISSING_INVOKE_TARGET_ID);
            expect(onSuccess).not.toHaveBeenCalled();
        });
    });

    it("should create a session and call the success callback", function () {
        var onSuccess,
            onFail,
            onSimChange,
            onPushTransportReady;

        runs(function () {
            var options = { invokeTargetId : "com.webworks.test.functional.push.target",
                            appId : "1-RDce63it6363", 
                            ppgUrl : "http://pushapi.eval.blackberry.com" };

            onSuccess = jasmine.createSpy();
            onFail = jasmine.createSpy();
            onSimChange = jasmine.createSpy();
            onPushTransportReady = jasmine.createSpy();

            blackberry.push.PushService.create(options, onSuccess, onFail, onSimChange, onPushTransportReady);
        });

        waitsFor(function () {
            return onSuccess.callCount;
        }, "success callback never fired", 10000);

        runs(function () {
            expect(onSuccess).toHaveBeenCalledWith(jasmine.any(blackberry.push.PushService));
            expect(onFail).not.toHaveBeenCalled();
            pushService = onSuccess.mostRecentCall.args[0];
        });
    });

    it("should create a channel and call the createChannel callback", function () {
        var onCreateChannel;

        runs(function () {
            onCreateChannel = jasmine.createSpy();
            pushService.createChannel(onCreateChannel);
        });

        waitsFor(function () {
            return onCreateChannel.callCount;
        }, "createChannel callback never fired", 20000);

        runs(function () {
            expect(onCreateChannel).toHaveBeenCalledWith(blackberry.push.PushService.SUCCESS, jasmine.any(String));
        });
    });
    
    it("should call the launchApplicationOnPush callback", function () {
        var onLaunchOnPush;

        runs(function () {
            onLaunchOnPush = jasmine.createSpy();
            pushService.launchApplicationOnPush(true, onLaunchOnPush);
        });

        waitsFor(function () {
            return onLaunchOnPush.callCount;
        }, "launchApplicationOnPush callback never fired", 10000);

        runs(function () {
            expect(onLaunchOnPush).toHaveBeenCalledWith(blackberry.push.PushService.SUCCESS);
        });
    });

    it("should destroy the channel and call the destroyChannel callback", function () {
        var onDestroyChannel;

        runs(function () {
            onDestroyChannel = jasmine.createSpy();
            pushService.destroyChannel(onDestroyChannel);
        });

        waitsFor(function () {
            return onDestroyChannel.callCount;
        }, "destroyChannel callback never fired", 10000);

        runs(function () {
            expect(onDestroyChannel).toHaveBeenCalledWith(blackberry.push.PushService.SUCCESS);
        });
    });

    
});

