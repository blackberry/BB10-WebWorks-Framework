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
    BBMEvents;

describe("bbm.platform BBMEvents", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            BBM: function () {}
        };
        BBMEvents = require(_apiDir + "BBMEvents");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        BBMEvents = null;
    });

    it("checks that JNEXT was not initialized on require", function () {
        expect(JNEXT.require).not.toHaveBeenCalledWith("libbbm");
        expect(JNEXT.createObject).not.toHaveBeenCalledWith("libbbm.BBM");
    });

    describe("onaccesschanged event", function () {
        describe("addEventListener", function () {
            var trigger = function () {};

            it("invokes JNEXT startEvents for 'onaccesschanged' event", function () {
                BBMEvents.addEventListener("onaccesschanged", trigger);
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startEvents");
            });
        });

        describe("removeEventListener", function () {
            it("invokes JNEXT stopEvents for 'onaccesschanged' event", function () {
                BBMEvents.removeEventListener("onaccesschanged");
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopEvents");
            });
        });
    });

    describe("onupdate event", function () {
        describe("addEventListener", function () {
            var trigger = function () {};

            it("invokes JNEXT startContactEvents for 'onupdate' event", function () {
                BBMEvents.addEventListener("onupdate", trigger);
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startContactEvents");
            });
        });

        describe("removeEventListener", function () {
            it("invokes JNEXT stopContactEvents for 'onupdate' event", function () {
                BBMEvents.removeEventListener("onupdate");
                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopContactEvents");
            });
        });
    });
});

