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
    var util = require(libRoot + "utils"),
        event = require(libRoot + "event"),
        webview = util.requireWebview();

    describe("trigger", function () {
        it("can invoke the webview execute javascript", function () {
            spyOn(webview, "executeJavascript");
            event.trigger("foo", {"id": 123});
            expect(webview.executeJavascript).toHaveBeenCalledWith("webworks.event.trigger('foo', '" + encodeURIComponent(JSON.stringify([{"id": 123}])) + "')");
        });

        it("can invoke the webview execute javascript", function () {
            spyOn(webview, "executeJavascript");
            event.trigger("foo");
            expect(webview.executeJavascript).toHaveBeenCalledWith("webworks.event.trigger('foo', '" + encodeURIComponent(JSON.stringify([])) + "')");
        });

        it("sends multiple arguments passed in across as a JSONified array", function () {
            spyOn(webview, "executeJavascript");
            event.trigger("foo", {"id": 123, "foo": "hello world", list: [1, 2, 3]}, "Grrrrrrr", "Arrrrg");
            expect(webview.executeJavascript).toHaveBeenCalledWith("webworks.event.trigger('foo', '" + encodeURIComponent(JSON.stringify([{"id": 123, foo: "hello world", list: [1, 2, 3]}, "Grrrrrrr", 'Arrrrg'])) + "')");
        });
    });

    describe("add/remove would invoke action context", function () {
        var action = {
            context: {
                addEventListener: jasmine.createSpy(),
                removeEventListener: jasmine.createSpy()
            },
            event: "HELLO",
            trigger: function () {}
        };

        it("can invoke action context add listener", function () {
            event.add(action);
            expect(action.context.addEventListener).toHaveBeenCalledWith(action.event, action.trigger);
        });

        it("can invoke action context remove listener", function () {
            event.remove(action);
            expect(action.context.removeEventListener).toHaveBeenCalledWith(action.event, action.trigger);
        });
    });
});
