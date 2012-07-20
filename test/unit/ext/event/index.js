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

var root = __dirname + "/../../../../",
    index = require(root + "ext/event/index");

describe("blackberry.event index", function () {
    describe("registerEvents", function () {
        it("throws error when map is not specified", function () {
            expect(function () {
                index.registerEvents();
            }).toThrow("map is null or undefined");
        });

        it("throws error when map contains invalid action", function () {
            var map = {
                "Bad": null
            };

            expect(function () {
                index.registerEvents(map);
            }).toThrow("map contains invalid action: 'Bad'");
        });

        it("throws error when action does not have all required attributes", function () {
            var map = {
                "MyEvent": {
                    "event": "MyEvent",
                    "context": null
                }
            };

            expect(function () {
                index.registerEvents(map);
            }).toThrow("action 'MyEvent' does not have valid context");
        });

        it("does not throw error when all actions in map are valid", function () {
            var map = {
                "MyEvent": {
                    "event": "MyEvent",
                    "context": {
                        addEventListener: function () {},
                        removeEventListener: function () {}
                    }
                },
                "MyEvent2": {
                    "event": "MyEvent2",
                    "context": {
                        addEventListener: function () {},
                        removeEventListener: function () {}
                    }
                }
            };

            expect(function () {
                index.registerEvents(map);
            }).not.toThrow();
        });
    });

    describe("isEventRegistered", function () {
        it("returns false for unregistered event", function () {
            expect(index.isEventRegistered("Blah")).toBeFalsy();
        });

        it("returns true for registered event", function () {
            expect(index.isEventRegistered("MyEvent")).toBeTruthy();
            expect(index.isEventRegistered("MyEvent2")).toBeTruthy();
        });
    });
});
