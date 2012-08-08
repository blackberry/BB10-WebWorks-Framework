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
    var invokedArgs,
        pushService;

    it("should create a session and call the success callback", function () {
        var onSuccess,
            onFail,
            onSimChange;

        runs(function () {
            var options = { invokeTargetId : "com.webworks.test.functional.push.target",
                            appId : "1-RDce63it6363",
                            ppgUrl : "http://pushapi.eval.blackberry.com" };

            onSuccess = jasmine.createSpy();
            onFail = jasmine.createSpy();
            onSimChange = jasmine.createSpy();

            blackberry.push.PushService.create(options, onSuccess, onFail, onSimChange);
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

    it("should be invoked on a push notification", function () {
        var onInvoked;

        runs(function () {
            onInvoked = jasmine.createSpy();
            invokedArgs = null;
            blackberry.event.addEventListener("invoked", onInvoked);
            window.confirm("Please send a push notification with text data.");
        });

        waitsFor(function () {
            return onInvoked.callCount;
        }, "invoke callback was never called", 25000);
        
        runs(function () {
            invokedArgs = onInvoked.mostRecentCall.args[0];
            expect(invokedArgs).not.toBeNull();

            blackberry.event.removeEventListener("invoked", onInvoked);
        });
    });

    it("should extract the push payload from an invoked object", function () {
        var pushPayload,
            data = null,
            reader;

        runs(function () {
            var idConfirm = false,
                ackConfirm = false,
                headerConfirm = false;
    
            expect(invokedArgs.data).toBeDefined();
            pushPayload = pushService.extractPushPayload(invokedArgs);
           
            idConfirm = window.confirm("The push ID was:\n" + pushPayload.id + "\n\n" +
                                       "Click OK if this is correct.  If not, click Cancel.");
            expect(idConfirm).toEqual(true);

            ackConfirm = window.confirm("The push isAcknowledgeRequired was:\n" + pushPayload.isAcknowledgeRequired + "\n\n" +
                                        "Click OK if this is correct.  If not, click Cancel.");
            expect(ackConfirm).toEqual(true);
            
            headerConfirm = window.confirm("The push headers were:\n" + JSON.stringify(pushPayload.headers) + "\n\n" +
                                           "Click OK if this is correct.  If not, click Cancel.");
            expect(headerConfirm).toEqual(true);
            
            reader = new FileReader();
            reader.onloadend = function (evt) {
                if (evt.target.readyState === FileReader.DONE) {
                    data = evt.target.result;
                }
            };

            reader.readAsText(pushPayload.data);
        });

        waitsFor(function () {
            return (data !== null);
        }, "FileReader callback was never called", 10000);

        runs(function () {
            var dataConfirm = window.confirm("The push data was:\n" + data + "\n\n" +
                                             "Click OK if this is correct.  If not, click Cancel.");
            expect(dataConfirm).toEqual(true);
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

