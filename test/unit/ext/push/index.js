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
var _apiDir = __dirname + "./../../../../ext/push/",
    _libDir = __dirname + "./../../../../lib/",
    successCB,
    failCB,
    args = {},
    index,
    mockJNEXT;

describe("push index", function () {
    beforeEach(function () {
        mockJNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("0"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true)
        };
        GLOBAL.JNEXT = mockJNEXT;

        successCB = jasmine.createSpy();
        failCB = jasmine.createSpy();
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        index = null;
        args = {};
    });

    it("makes sure that JNEXT not is initalized", function () {
        expect(mockJNEXT.require).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke startService is called", function () {
        var expected_args = { invokeTargetId : "invokeTargetId", appId : "appId", ppgUrl : "ppgUrl" };

        args.invokeTargetId = encodeURIComponent(JSON.stringify("invokeTargetId"));
        args.appId = encodeURIComponent(JSON.stringify("appId"));
        args.ppgUrl = encodeURIComponent(JSON.stringify("ppgUrl"));

        index.startService(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "startService " + JSON.stringify(expected_args));
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke createChannel is called", function () {
        index.createChannel(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "createChannel");
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke destroyChannel is called", function () {
        index.destroyChannel(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "destroyChannel");
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke extractPushPayload is called", function () {
        var expected_args = { data : "hello world" };

        args.data = encodeURIComponent(JSON.stringify("hello world"));
        JNEXT.invoke = jasmine.createSpy().andReturn(" 123 " + JSON.stringify(expected_args));

        index.extractPushPayload(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "extractPushPayload " + JSON.stringify(expected_args));
        expect(successCB).toHaveBeenCalledWith(expected_args);
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke registerToLaunch is called", function () {
        args = {"shouldLaunch" : true};

        index.launchApplicationOnPush(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "registerToLaunch");
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke unregisterFromLaunch is called", function () {
        args = {"shouldLaunch" : false};

        index.launchApplicationOnPush(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "unregisterFromLaunch");
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });

    it("makes sure that JNEXT.invoke acknowledge is called", function () {
        var expected_args = { id : "payloadId", shouldAcceptPush : true };

        args.id = encodeURIComponent(JSON.stringify("payloadId"));
        args.shouldAcceptPush = encodeURIComponent(JSON.stringify(true));

        index.acknowledge(successCB, failCB, args);

        expect(mockJNEXT.invoke).toHaveBeenCalledWith("0", "acknowledge " + JSON.stringify(expected_args));
        expect(successCB).toHaveBeenCalledWith();
        expect(failCB).not.toHaveBeenCalled();
    });
});
