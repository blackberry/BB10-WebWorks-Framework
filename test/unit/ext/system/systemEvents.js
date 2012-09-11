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

var _apiDir = __dirname + "./../../../../ext/system/",
    _libDir = __dirname + "./../../../../lib/",
    appEventPrefix = "application.",
    systemEvents,
    mockedApplication,
    trigger;

describe("system systemEvents", function () {
    beforeEach(function () {
        mockedApplication = {
            addEventListener: jasmine.createSpy("application addEventListener"),
            removeEventListener: jasmine.createSpy("application removeEventListener"),
        };
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                getApplication: function () {
                    return mockedApplication;
                }
            }
        };

        var name = require.resolve(_apiDir + "systemEvents");
        delete require.cache[name];
        systemEvents = require(_apiDir + "systemEvents");
        trigger = function () {};
    });

    afterEach(function () {
        mockedApplication = null;
        GLOBAL.window.qnx = null;
        trigger = null;
    });

    describe("fontchanged", function () {
        it("add proper event to application for 'fontchanged'", function () {
            systemEvents.addEventListener("fontchanged", trigger);
            expect(mockedApplication.addEventListener).toHaveBeenCalledWith(appEventPrefix + "fontchanged", trigger);
        });

        it("remove proper event from application for 'fontchanged", function () {
            systemEvents.removeEventListener("fontchanged", trigger);
            expect(mockedApplication.removeEventListener).toHaveBeenCalledWith(appEventPrefix + "fontchanged", trigger);
        });
    });
});
