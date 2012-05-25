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
var _apiDir = __dirname + "./../../../../ext/blackberry.connection/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/blackberry.event/index"),
    index;

describe("blackberry.connection index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            Connection: function () {}
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });

    describe("blackberry.connection", function () {
        describe("type", function () {
            it("can call success", function () {
                var success = jasmine.createSpy();

                index.type(success, null, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getType");
                expect(success).toHaveBeenCalledWith(2);
            });

            it("can call fail", function () {
                var fail = jasmine.createSpy();

                spyOn(JSON, "parse").andThrow("Parse error");

                index.type(null, fail, null, null);

                expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "getType");
                expect(fail).toHaveBeenCalledWith(-1, "Parse error");
            });
        });

        describe("connectionchange", function () {
            it("can register the 'connectionchange' event", function () {
                var eventName = "connectionchange",
                    args = {eventName : encodeURIComponent(eventName)},
                    success = jasmine.createSpy();

                spyOn(events, "add");
                index.registerEvents(success);
                eventExt.add(null, null, args);
                expect(success).toHaveBeenCalled();
                expect(events.add).toHaveBeenCalled();
                expect(events.add.mostRecentCall.args[0].event).toEqual(eventName);
                expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });

            it("can un-register the 'connectionchange' event", function () {
                var eventName = "connectionchange",
                    args = {eventName : encodeURIComponent(eventName)};

                spyOn(events, "remove");
                eventExt.remove(null, null, args);
                expect(events.remove).toHaveBeenCalled();
                expect(events.remove.mostRecentCall.args[0].event).toEqual(eventName);
                expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });
        });
    });
});
