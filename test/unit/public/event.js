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
var libRoot = __dirname + "/../../../lib/";

describe("event", function () {
    var event = require(libRoot + "public/event"),
        windowObj = require(libRoot + "public/window"),
        _window;

    beforeEach(function () {
        _window = {
            webworks: {
                exec: jasmine.createSpy("window.webworks.exec")
            }
        };

        spyOn(windowObj, "window").andReturn(_window);
    });

    describe("on", function () {
        it("it can call webworks.exec action 'on' given valid featureId, eventName and callback", function () {
            event.on("blackberry.system.event", "foo", jasmine.createSpy());
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "on", {"eventName": "foo"});
        });
    });

    describe("remove", function () {
        it("it can call webworks.exec action 'remove' given valid featureId, eventName and callback", function () {
            var cb = jasmine.createSpy();
            event.on("blackberry.system.event", "a", cb);
            event.remove("blackberry.system.event", "a", cb);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "remove", {"eventName": "a"});
        });
    });

    describe("trigger", function () {
        it("can invoke the correct callback given a valid id", function () {
            var cb = jasmine.createSpy();
            event.on("blackberry.system.event", "b", cb);
            event.trigger("b", {"id": 1});
            expect(cb).toHaveBeenCalledWith({"id": 1});
        });
    });
});
