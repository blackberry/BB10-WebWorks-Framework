/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var libDir = __dirname + "./../../../../lib/",
    extDir = __dirname + "./../../../../ext/",
    ID = "system",
    apiDir = extDir + ID + "/",
    Whitelist = require(libDir + "policy/whitelist").Whitelist,
    events = require(libDir + "event"),
    eventExt = require(extDir + "event/index"),
    utils = require(libDir + "utils"),
    sysIndex,
    successCB,
    failCB;


describe("system index", function () {
    beforeEach(function () {
        sysIndex = require(apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.window;
        sysIndex = null;
    });

    it("hasPermission", function () {
        var success = jasmine.createSpy(),
            env = {
                "request": {
                    "origin": "blah"
                },
                "response": {
                }
            };

        spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

        sysIndex.hasPermission(success, undefined, {"module": "blackberry.system"}, env);

        expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(0);
    });

    it("hasCapability", function () {
        var success = jasmine.createSpy();

        sysIndex.hasCapability(success, undefined, {"capability": "network.wlan"}, undefined);

        expect(success).toHaveBeenCalledWith(true);
    });

    describe("qnx.webplatform.device properties", function () {
        beforeEach(function () {
            sysIndex = require(apiDir + "index");
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        device: {
                        }
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            sysIndex = null;
        });

        it("can call fail if a property isn't present", function () {
            ["hardwareid", "scmbundle", "devicename"].forEach(function (propertyName) {
                var fail = jasmine.createSpy();
                sysIndex.getDeviceProperties(null, fail, null, null);
                expect(fail).toHaveBeenCalledWith(-1, jasmine.any(String));
            });
        });

        it("can call success with getDeviceProperties", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                hardwareId = "0x8500240a",
                softwareVersion = "10.0.6.99",
                name = "Device";

            window.qnx.webplatform.device.hardwareId = hardwareId;
            window.qnx.webplatform.device.scmBundle = softwareVersion;
            window.qnx.webplatform.device.deviceName = name;

            sysIndex.getDeviceProperties(success, fail, null, null);

            expect(success).toHaveBeenCalledWith({
                "hardwareId" : hardwareId,
                "softwareVersion" : softwareVersion,
                "name": name
            });
        });

    });


    describe("device region", function () {
        var mockApplication;
        beforeEach(function () {
            sysIndex = require(apiDir + "index");
            mockApplication = {};
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            sysIndex = null;
        });

        it("calls success when there is no error retrieving data", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            mockApplication.systemRegion = (new Date()).getTime();

            sysIndex.region(success, fail);
            expect(success).toHaveBeenCalledWith(window.qnx.webplatform.getApplication().systemRegion);
            expect(fail).not.toHaveBeenCalled();
        });

        it("calls fail when there is an error", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                errMsg = "Something bad happened";

            Object.defineProperty(mockApplication, "systemRegion", {
                get: function () {
                    throw new Error(errMsg);
                }
            });

            sysIndex.region(success, fail);
            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith(-1, errMsg);
        });
    });

    describe("languagechanged event", function () {
        var appEvents;
        beforeEach(function () {
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
            appEvents = require(libDir + "events/applicationEvents");
        });

        it("responds to 'languagechanged' events", function () {
            var clientEventName = "languagechanged",
                eventName = "systemLanguageChange",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalledWith({
                context: appEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });

        it("removes 'languagechanged' event", function () {
            var clientEventName = "languagechanged",
                eventName = "systemLanguageChange",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalledWith({
                context: appEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });
    });

    describe("regionchanged event", function () {
        var appEvents;
        beforeEach(function () {
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
            appEvents = require(libDir + "events/applicationEvents");
        });

        it("responds to 'regionchanged' events", function () {
            var clientEventName = "regionchanged",
                eventName = "systemRegionChange",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalledWith({
                context: appEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });

        it("removes 'regionchanged' event", function () {
            var clientEventName = "regionchanged",
                eventName = "systemRegionChange",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalledWith({
                context: appEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });
    });

    describe("batterystatus event", function () {
        var deviceEvents;

        beforeEach(function () {
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
            deviceEvents = require(libDir + "events/deviceEvents");
        });

        it("responds to 'batterystatus' events", function () {
            var clientEventName = "batterystatus",
                eventName = "battery.statusChange",
                args = { eventName : encodeURIComponent(clientEventName) };

            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });

        it("removes 'batterystatus' event", function () {
            var clientEventName = "batterystatus",
                eventName = "battery.statusChange",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });
    });

    describe("batterylow event", function () {
        var deviceEvents;

        beforeEach(function () {
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
            deviceEvents = require(libDir + "events/deviceEvents");
        });

        it("responds to 'batterylow' events", function () {
            var clientEventName = "batterylow",
                eventName = "battery.chargeLow",
                args = { eventName : encodeURIComponent(clientEventName) };

            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });

        it("removes 'batterylow' event", function () {
            var clientEventName = "batterylow",
                eventName = "battery.chargeLow",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });
    });

    describe("batterycritical event", function () {
        var deviceEvents;

        beforeEach(function () {
            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });
            deviceEvents = require(libDir + "events/deviceEvents");
        });

        it("responds to 'batterycritical' events", function () {
            var clientEventName = "batterycritical",
                eventName = "battery.chargeCritical",
                args = { eventName : encodeURIComponent(clientEventName) };

            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });

        it("removes 'batterycritical' event", function () {
            var clientEventName = "batterycritical",
                eventName = "battery.chargeCritical",
                args = {eventName : encodeURIComponent(clientEventName)};
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalledWith({
                context: deviceEvents,
                event: eventName,
                trigger: jasmine.any(Function)
            });
        });
    });

    describe("font", function () {
        describe("font methods", function () {
            var fontFamily = "courier",
                fontSize = 10,
                mockedFontFamily,
                mockedFontSize,
                ERROR_ID = -1;

            beforeEach(function () {
                successCB = jasmine.createSpy("Success Callback");
                failCB = jasmine.createSpy("Fail Callback");
                mockedFontFamily = jasmine.createSpy("getSystemFontFamily").andReturn(fontFamily);
                mockedFontSize = jasmine.createSpy("getSystemFontSize").andReturn(fontSize);
                GLOBAL.window = GLOBAL;
                GLOBAL.window.qnx = {
                    webplatform: {
                        getApplication: function () {
                            return {
                                getSystemFontFamily: mockedFontFamily,
                                getSystemFontSize: mockedFontSize
                            };
                        }
                    }
                };
            });

            afterEach(function () {
                delete GLOBAL.window;
                successCB = null;
                failCB = null;
                mockedFontFamily = null;
                mockedFontSize = null;
            });

            it("can call fontFamily and fontSize the qnx.weblplatform Application", function () {
                sysIndex.getFontInfo(successCB, null, null, null);
                expect(mockedFontFamily).toHaveBeenCalled();
                expect(mockedFontSize).toHaveBeenCalled();
            });

            it("can call success callback when getFontInfo call succeed", function () {
                sysIndex.getFontInfo(successCB, failCB, null, null);
                expect(successCB).toHaveBeenCalledWith({'fontFamily': fontFamily, 'fontSize': fontSize});
                expect(failCB).not.toHaveBeenCalled();
            });

            it("can call fail callback when getFontInfo call failed", function () {
                sysIndex.getFontInfo(null, failCB, null, null);
                expect(successCB).not.toHaveBeenCalledWith({'fontFamily': fontFamily, 'fontSize': fontSize});
                expect(failCB).toHaveBeenCalledWith(ERROR_ID, jasmine.any(Object));
            });
        });

        describe("fontchanged event", function () {
            var appEvents;
            beforeEach(function () {
                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });
                appEvents = require(libDir + "events/applicationEvents");
            });

            it("responds to 'fontchanged' events", function () {
                var eventName = "fontchanged",
                    args = {eventName : encodeURIComponent(eventName)};

                spyOn(events, "add");
                sysIndex.registerEvents(jasmine.createSpy());
                eventExt.add(null, null, args);
                expect(events.add).toHaveBeenCalledWith({
                    context: appEvents,
                    event: eventName,
                    trigger: jasmine.any(Function)
                });
            });

            it("removes 'fontchanged' event", function () {
                var eventName = "fontchanged",
                    args = {eventName : encodeURIComponent(eventName)};

                spyOn(events, "remove");
                eventExt.remove(null, null, args);
                expect(events.remove).toHaveBeenCalledWith({
                    context: appEvents,
                    event: eventName,
                    trigger: jasmine.any(Function)
                });
            });
        });
    });

    describe("getCurrentTimezone", function () {
        beforeEach(function () {
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        device: {
                            timezone: "hello123"
                        }
                    }
                }
            };
        });

        it("return timezone from PPS", function () {
            var successCb = jasmine.createSpy();

            sysIndex.getCurrentTimezone(successCb);

            expect(successCb).toHaveBeenCalledWith("hello123");
        });
    });

    describe("getTimezones", function () {
        beforeEach(function () {
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        device: {
                            getTimezones: jasmine.createSpy().andCallFake(function (callback) {
                                callback(["America/New_York", "America/Los_Angeles"]);
                            })
                        }
                    }
                }
            };
        });

        it("return timezones from native", function () {
            var successCb = jasmine.createSpy();

            sysIndex.getTimezones(successCb);

            expect(successCb).toHaveBeenCalledWith(["America/New_York", "America/Los_Angeles"]);
        });
    });

    describe("setWallpaper", function () {
        var mockApplication;

        beforeEach(function () {
            mockApplication = {};

            mockApplication.newWallpaper = jasmine.createSpy("newWallpaper method");
            mockApplication.getEnv = function (envName) {
                if (envName === "HOME") {
                    return "/accounts/1000/appdata/data";
                }
            };
            GLOBAL.window = {
                qnx: {
                    webplatform: {
                        getApplication: jasmine.createSpy().andReturn(mockApplication)
                    }
                }
            };
            successCB = jasmine.createSpy("Success Callback");
            failCB = jasmine.createSpy("Fail Callback");
        });
        
        afterEach(function () {
            mockApplication.newWallpaper = null;
            mockApplication = null;
            delete GLOBAL.window;

            successCB = null;
            failCB = null;
        });

        it("calls setWallpaper with success callback at the end for NOT local path", function () {
            var filePath = "/accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(filePath))};

            sysIndex.setWallpaper(successCB, failCB, request);

            expect(mockApplication.newWallpaper).toHaveBeenCalledWith(filePath);
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("calls setWallpaper with success callback at the end for local path", function () {
            var imageName = "IMG_00000001.jpg",
                localPath = "local:///" + imageName,
                request = {wallpaper: encodeURIComponent(JSON.stringify(localPath))},
                tranlatedPath;

            sysIndex.setWallpaper(successCB, failCB, request);
            tranlatedPath = mockApplication.newWallpaper.mostRecentCall.args[0];

            // Checking if the image name is at the end of translated path
            expect(tranlatedPath.indexOf(imageName)).toEqual(tranlatedPath.length - imageName.length);

            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();
        });

        it("calls setWallpaper with path no prefixed 'file://' for NOT local path", function () {
            var filePathPrefix = "file://",
                filePath = "/accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(filePathPrefix + filePath))};

            sysIndex.setWallpaper(successCB, failCB, request);

            expect(mockApplication.newWallpaper).toHaveBeenCalledWith(filePath);
        });

        it("calls setWallpaper with path no prefixed 'file://' for local path", function () {
            var excludedPrefix = "file://",
                localPath = "local:///accounts/1000/shared/camera/IMG_00000001.jpg",
                request = {wallpaper: encodeURIComponent(JSON.stringify(localPath))},
                tranlatedPath;

            sysIndex.setWallpaper(successCB, failCB, request);
            tranlatedPath = mockApplication.newWallpaper.mostRecentCall.args[0];

            // Checking the tranlated path not prefixed with 'file://'
            expect(tranlatedPath.indexOf(excludedPrefix)).toEqual(-1);
        });
    });
});
