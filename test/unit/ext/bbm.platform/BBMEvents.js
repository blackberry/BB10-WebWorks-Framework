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
            BBM: function () {},
        };
        BBMEvents = require(_apiDir + "BBMEvents");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        BBMEvents = null;
    });

    it("can access bbm module in JNEXT", function () {
        expect(JNEXT.require).toHaveBeenCalledWith("bbm");
        expect(JNEXT.createObject).toHaveBeenCalledWith("bbm.BBM");
    });

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
