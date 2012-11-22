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
    _apiDir = _extDir + "/notification",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    Notification,
    mockedWebworks;

function unloadClient() {
    // explicitly unload client for it to be loaded again
    delete require.cache[require.resolve(_apiDir + "/client")];
    client = null;
}

describe("notification client creates Notification object attached to window", function () {
    var onShow,
        onError;

    beforeEach(function () {
        mockedWebworks = {
            execAsync: jasmine.createSpy("webworks.execAsync"),
            defineReadOnlyField: jasmine.createSpy("webworks.defineReadOnlyField"),
            event: {
                isOn : jasmine.createSpy("webworks.event.isOn"),
                once : jasmine.createSpy("webworks.event.once")
            }
        };
        GLOBAL.window = {
            webworks: mockedWebworks,
            isFinite: isFinite
        };
        client = require(_apiDir + "/client");
        Notification = window.Notification;
        onShow = jasmine.createSpy("Notification onshow");
        onError = jasmine.createSpy("Notification onerror");
    });

    afterEach(function () {
        mockedWebworks = null;
        Notification = null;
        unloadClient();
        onShow = null;
        onError = null;
        delete GLOBAL.window;
    });

    describe("Namespace, methods and properties", function () {
        it("should have a Notification object attached to window", function () {
            expect(Notification).toBeDefined();
        });

        it("should have static permission field that equal to 'granted'", function () {
            var permission = "granted";
            expect(mockedWebworks.defineReadOnlyField).toHaveBeenCalledWith(jasmine.any(Function), "permission", permission);
        });

        it("should have static 'requestPermission' method", function () {
            expect(Notification.requestPermission).toBeDefined();
            expect(typeof Notification.requestPermission).toEqual("function");
        });

        it("should have static 'remove' method", function () {
            expect(Notification.remove).toBeDefined();
            expect(typeof Notification.remove).toEqual("function");
        });

        it("should have 'close' method belongs to instance", function () {
            var notification = new Notification("N Title");
            expect(notification.close).toBeDefined();
            expect(typeof notification.close).toEqual("function");
        });
    });

    describe("Constructor", function () {
        it("should be able to construct Notification object", function () {
            var notification = new Notification("N Title");
            expect(notification).toBeDefined();
            expect(typeof notification).toEqual("object");
        });

        it("should have 'close' method belongs to Notification instance", function () {
            var notification = new Notification("N Title");
            expect(notification.close).toBeDefined();
            expect(typeof notification.close).toEqual("function");
        });

        it("should call execAync when Notification object is created", function () {
            new Notification("N Title");

            expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "notify", jasmine.any(Object));
            expect(window.webworks.execAsync.mostRecentCall.args[2].id).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].title).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].options).toBeDefined();
            expect(typeof window.webworks.execAsync.mostRecentCall.args[2].options).toEqual("object");
            expect(window.webworks.execAsync.mostRecentCall.args[2].options.tag).toBeDefined();
        });

        it("should call execAync with all required fields when calling Notification constructor", function () {
            new Notification("N Title");

            expect(window.webworks.execAsync.mostRecentCall.args[2].id).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].title).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].options).toBeDefined();
            expect(typeof window.webworks.execAsync.mostRecentCall.args[2].options).toEqual("object");
            expect(window.webworks.execAsync.mostRecentCall.args[2].options.tag).toBeDefined();
        });

        it("should notify by calling 'once' event when there is a callback(s) provided", function () {
            new Notification("N Title", {'onshow': onShow, 'onerror': onError});

            expect(mockedWebworks.event.once).toHaveBeenCalledWith(_ID, jasmine.any(String), jasmine.any(Function));
        });

        it("should throw an exception when title is not provided", function () {
            expect(function () {
                new Notification();
            }).toThrow();
        });

        it("should throw an exception when title is not a string", function () {
            expect(function () {
                new Notification(1);
            }).toThrow();
        });
    });

    describe("'remove' method", function () {
        it("should call execAsync when 'remove' method called", function () {
            Notification.remove("TheTag");

            expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "remove", jasmine.any(Object));
        });

        it("should call execAsync with tag when 'remove' method called", function () {
            var tag = "TheTag";

            Notification.remove(tag);

            expect(window.webworks.execAsync.mostRecentCall.args[2].tag).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].tag).toEqual(tag);
        });


        it("should not call execAsync when not tag passed to 'remove'", function () {
            Notification.remove();

            expect(window.webworks.execAsync).not.toHaveBeenCalled();
        });
    });

    describe("'close' method", function () {
        it("should call execAsync with for method 'remove' when 'close' method is called", function () {
            var notification = new Notification("TheTitle");

            notification.close();

            expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "remove", jasmine.any(Object));
        });

        it("should call execAsync with corresponding tag when 'close' method called", function () {
            var tag = "TheTag",
                notification = new Notification("TheTitle", {'tag': tag});

            notification.close();

            expect(window.webworks.execAsync.mostRecentCall.args[2].tag).toBeDefined();
            expect(window.webworks.execAsync.mostRecentCall.args[2].tag).toEqual(tag);
        });

        it("should always call execAsync with tag set even if no tag was provided to 'close' method", function () {
            var notification = new Notification("TheTitle");
            window.webworks.execAsync.reset();

            notification.close();
            expect(window.webworks.execAsync).toHaveBeenCalledWith(_ID, "remove", jasmine.any(Object));
            expect(window.webworks.execAsync.mostRecentCall.args[2].tag).toBeDefined();
        });
    });
});
