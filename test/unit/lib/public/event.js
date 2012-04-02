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
var libRoot = __dirname + "/../../../../lib/";

describe("event", function () {
    var event = require(libRoot + "public/event"),
        _window,
        callback;

    beforeEach(function () {
        _window = {
            webworks: {
                exec: jasmine.createSpy("window.webworks.exec")
            }
        };
        GLOBAL.window = _window;
        callback = jasmine.createSpy();
    });

    afterEach(function () {
        event.remove("blackberry.system.event", "foo", callback);
        delete GLOBAL.window;
    });

    describe("on", function () {

        it("it can call webworks.exec action 'on' given valid featureId, eventName and callback", function () {
            event.on("blackberry.system.event", "foo", callback);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "on", {"eventName": "foo"});
        });
        
        it("it will not call webworks.exec for multiple callbacks", function () {
            var callback2 = jasmine.createSpy();
            event.on("blackberry.system.event", "foo", callback);
            event.on("blackberry.system.event", "foo", callback2);
            expect(_window.webworks.exec).toHaveBeenCalledWith(undefined, undefined, "blackberry.system.event", "on", {"eventName": "foo"});
            expect(_window.webworks.exec.callCount).toEqual(1);
            event.remove("blackberry.system.event", "foo", callback2);
        });

        it("will not register duplicate callbacks", function () {
            event.on("blackberry.system.event", "foo", callback);
            event.on("blackberry.system.event", "foo", callback);
            event.trigger("foo", '{"id": 1}');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback.callCount).toEqual(1);
        });

        it("will register two distinct callbacks", function () {
            var callback2 = jasmine.createSpy();
            event.on("blackberry.system.event", "foo", callback);
            event.on("blackberry.system.event", "foo", callback2);
            event.trigger("foo", '{"id": 1}');
            expect(callback).toHaveBeenCalledWith({"id": 1});
            expect(callback2).toHaveBeenCalledWith({"id": 1});
            event.remove("blackberry.system.event", "foo", callback2);
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
        it("will invoke callback if event has been added", function () {
            event.on("blackberry.system.event", "foo", callback);
            event.trigger("foo", '{"id": 1}');
            expect(callback).toHaveBeenCalledWith({"id": 1});
        });

        it("will not invoke callback if event has been removed", function () {
            var cb = jasmine.createSpy();
            event.on("blackberry.system.event", "c", cb);
            event.remove("blackberry.system.event", "c", cb);
            event.trigger("c", {"id": 1});
            expect(cb).not.toHaveBeenCalled();
        });
    });
});
