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

var _apiDir = __dirname + "./../../../../ext/app/",
    _libDir = __dirname + "./../../../../lib/",
    appEvents,
    mockedApplication;

describe("app appEvents", function () {
    beforeEach(function () {
        mockedApplication = {
            addEventListener: jasmine.createSpy("application addEventListener"),
            removeEventListener: jasmine.createSpy("application removeEventListener")
        };
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                }
            }
        };

        var name = require.resolve(_apiDir + "appEvents");
        delete require.cache[name];
        appEvents = require(_apiDir + "appEvents");
    });

    afterEach(function () {
        mockedApplication = null;
        GLOBAL.window.qnx = null;
    });

    describe("addEventListener", function () {
        var trigger = jasmine.createSpy("trigger");

        it("should be called in webplatform.getApplication for 'pause' events", function () {
            appEvents.addEventListener("pause", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.pause', trigger);
        });

        it("should be called in webplatform.getApplication for 'resume' events", function () {
            appEvents.addEventListener("resume", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.resume', trigger);
        });

        it("should be called in webplatform.getApplication for 'swipedown' events", function () {
            appEvents.addEventListener("swipedown", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.swipedown', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardOpening' events", function () {
            appEvents.addEventListener("keyboardOpening", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.keyboardOpening', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardOpened' events", function () {
            appEvents.addEventListener("keyboardOpened", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.keyboardOpened', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardClosing' events", function () {
            appEvents.addEventListener("keyboardClosing", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.keyboardClosing', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardClosed' events", function () {
            appEvents.addEventListener("keyboardClosed", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.keyboardClosed', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardPosition' events", function () {
            appEvents.addEventListener("keyboardPosition", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith('application.keyboardPosition', trigger);
        });
    });

    describe("removeEventListener", function () {
        var trigger = jasmine.createSpy("trigger");

        it("should be called in webplatform.getApplication for 'pause' events", function () {
            appEvents.removeEventListener("pause", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.pause', trigger);
        });

        it("should be called in webplatform.getApplication for 'resume' events", function () {
            appEvents.removeEventListener("resume", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.resume', trigger);
        });

        it("should be called in webplatform.getApplication for 'swipedown' events", function () {
            appEvents.removeEventListener("swipedown", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.swipedown', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardOpening' events", function () {
            appEvents.removeEventListener("keyboardOpening", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.keyboardOpening', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardOpened' events", function () {
            appEvents.removeEventListener("keyboardOpened", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.keyboardOpened', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardClosing' events", function () {
            appEvents.removeEventListener("keyboardClosing", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.keyboardClosing', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardClosed' events", function () {
            appEvents.removeEventListener("keyboardClosed", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.keyboardClosed', trigger);
        });

        it("should be called in webplatform.getApplication for 'keyboardPosition' events", function () {
            appEvents.removeEventListener("keyboardPosition", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith('application.keyboardPosition', trigger);
        });
    });
});
