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
var _apiDir = __dirname + "./../../../../ext/bbm.platform/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    index = null,
    BBM_DISPLAY_NAME = 0,
    BBM_STATUS = 1,
    BBM_STATUS_MESSAGE = 2,
    BBM_PERSONAL_MESSAGE = 3,
    BBM_PPID = 4,
    BBM_HANDLE = 5,
    BBM_APP_VERSION = 6,
    BBM_SDK_VERSION = 7;

describe("bbm.platform index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            getgid: jasmine.createSpy().andReturn(jasmine.any(String))
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        index = null;
        delete require.cache[require.resolve(_apiDir + "index")];
    });

    describe("bbm.platform", function () {
        describe("register", function () {
            it("can call success", function () {
                var success = jasmine.createSpy(),
                args,
                options;

                options = { uuid : "464d3ba0-caba-11e1-9b23-0800200c9a66" };
                args = { "options" : JSON.stringify(options) };

                index.register(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "register " + JSON.stringify(options));
                expect(success).toHaveBeenCalled();
            });

            it("can call fail", function () {
                var fail = jasmine.createSpy(),
                args,
                options;

                options = { uuid : "9b23-0800200c9a66" };
                args = { "options" : JSON.stringify(options) };

                index.register(null, fail, args, null);

                expect(fail).toHaveBeenCalledWith(-1, "options are not valid");
            });
        });
    });

    describe("bbm.platform.self", function () {
        describe("self profile", function () {

            it("appVersion", function () {
                var success = jasmine.createSpy();

                index.self.appVersion(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_APP_VERSION);
                expect(success).toHaveBeenCalled();
            });

            it("bbmsdkVersion", function () {
                var success = jasmine.createSpy();

                index.self.bbmsdkVersion(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_SDK_VERSION);
                expect(success).toHaveBeenCalled();
            });

            it("displayName", function () {
                var success = jasmine.createSpy();

                index.self.displayName(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_DISPLAY_NAME);
                expect(success).toHaveBeenCalled();
            });

            it("handle", function () {
                var success = jasmine.createSpy();

                index.self.handle(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_HANDLE);
                expect(success).toHaveBeenCalled();
            });

            it("personalMessage", function () {
                var success = jasmine.createSpy();

                index.self.personalMessage(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_PERSONAL_MESSAGE);
                expect(success).toHaveBeenCalled();
            });

            it("ppid", function () {
                var success = jasmine.createSpy();

                index.self.ppid(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_PPID);
                expect(success).toHaveBeenCalled();
            });

            it("status", function () {
                var success = jasmine.createSpy();

                index.self.status(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_STATUS);
                expect(success).toHaveBeenCalled();
            });

            it("statusMessage", function () {
                var success = jasmine.createSpy();

                index.self.statusMessage(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getProfile " + BBM_STATUS_MESSAGE);
                expect(success).toHaveBeenCalled();
            });
        });

        describe("getDisplayPicture", function () {
            it("can call getDisplayPicture", function () {
                var success = jasmine.createSpy(),
                    args,
                    eventId;

                eventId = { eventId : encodeURIComponent("bbm.self.displayPicture") };
                args = { eventId : JSON.stringify(eventId) };

                index.self.getDisplayPicture(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.getDisplayPicture");
                expect(success).toHaveBeenCalled();
            });

        });

        describe("setStatus", function () {
            it("can call setStatus", function () {
                var success = jasmine.createSpy(),
                    args,
                    status = "available",
                    statusMessage = "Hello World";

                status = encodeURIComponent(status);
                statusMessage = encodeURIComponent(statusMessage);
                args = { status : JSON.stringify(status), statusMessage : JSON.stringify(statusMessage) };

                index.self.setStatus(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setStatus " + JSON.stringify(args));
                expect(success).toHaveBeenCalled();
            });
        });

        describe("setPersonalMessage", function () {
            it("can call setPersonalMessage", function () {
                var success = jasmine.createSpy(),
                    args,
                    personalMessage = "Hello World";

                personalMessage = { displayPicture : encodeURIComponent(personalMessage) };
                args = { personalMessage : JSON.stringify(personalMessage) };

                index.self.setPersonalMessage(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setPersonalMessage " + personalMessage);
                expect(success).toHaveBeenCalled();
            });
        });

        describe("setDisplayPicture", function () {
            it("can call setDisplayPicture", function () {
                var success = jasmine.createSpy(),
                    args,
                    displayPicture = "/tmp/avatar.gif";

                displayPicture = { displayPicture : encodeURIComponent(displayPicture) };
                args = { displayPicture : JSON.stringify(displayPicture) };

                index.self.setDisplayPicture(success, null, args, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "self.setDisplayPicture " + displayPicture);
                expect(success).toHaveBeenCalled();
            });
        });

    });

    describe("bbm.platform.users", function () {
        beforeEach(function () {
            GLOBAL.window = {};
            GLOBAL.qnx = {
                webplatform: {
                    getApplication: function () {
                        return {
                            cards: {
                                bbm: {
                                    inviteToDownload: {
                                        open: function (details, done, cancel, callback) {
                                            callback();
                                        }
                                    }
                                }
                            }
                        };
                    }
                }
            };
        });

        afterEach(function () {
            delete GLOBAL.window;
            delete GLOBAL.qnx;
        });

        it("calls users inviteToDownload", function () {
            var success = jasmine.createSpy("success"),
                fail = jasmine.createSpy("fail");

            index.users.inviteToDownload(success, fail, null);
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "users.inviteToDownload");
        });
    });

    describe("bbm.platform events", function () {
        describe("onaccesschanged", function () {

            it("can register the 'onaccesschanged' event", function () {
                var eventName = "onaccesschanged",
                args = { eventName : encodeURIComponent(eventName) },
                env = {webviewId: 42},
                success = jasmine.createSpy(),
                utils = require(_libDir + "utils");

                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });

                spyOn(events, "add");
                index.registerEvents(success);
                eventExt.add(null, null, args, env);
                expect(success).toHaveBeenCalled();
                expect(events.add).toHaveBeenCalled();
                expect(events.add.mostRecentCall.args[0].event).toEqual(eventName);
                expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });

            it("can un-register the 'onaccesschanged' event", function () {
                var eventName = "onaccesschanged",
                args = {eventName : encodeURIComponent(eventName)},
                env = {webviewId: 42};

                spyOn(events, "remove");
                eventExt.remove(null, null, args, env);
                expect(events.remove).toHaveBeenCalled();
                expect(events.remove.mostRecentCall.args[0].event).toEqual(eventName);
                expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });
        });
    });
});
