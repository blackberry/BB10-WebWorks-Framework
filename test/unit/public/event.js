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
var libRoot = __dirname + "/../../../lib/",
    event = require(libRoot + "public/event"),
    cb0 = jasmine.createSpy(),
    cb1 = jasmine.createSpy();

describe("event", function () {
    describe("registerCallback", function () {
        it("can return an id if a function is passed", function () {
            expect(event.registerCallback(cb0)).toBe(0);
        });

        it("can return undefined if a non-function is passed", function () {
            expect(event.registerCallback("abc")).toBeUndefined();
        });
    });

    describe("removeCallback", function () {
        it("does not shorten callback array", function () {
            event.removeCallback(0);
            expect(event.registerCallback(cb1)).toBe(1);
        });
    });

    describe("trigger", function () {
        it("does nothing if callback has been removed", function () {
            event.trigger(0, {a: "1"});
            expect(cb0).not.toHaveBeenCalled();
        });

        it("does nothing if an invalid id is passed", function () {
            event.trigger(123, {a: "1"});
            expect(cb0).not.toHaveBeenCalled();
			expect(cb1).not.toHaveBeenCalled();
        });

        it("can invoke the correct callback given a valid id", function () {
            event.trigger(1, {a: "1"});
            expect(cb1).toHaveBeenCalledWith({a: "1"});
        });
    });
});