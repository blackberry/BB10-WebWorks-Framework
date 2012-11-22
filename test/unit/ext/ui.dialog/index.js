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
    webview = require(root + "lib/webview"),
    overlayWebView = require(root + "lib/overlayWebView"),
    events = require(root + "lib/event"),
    index;

describe("ui.dialog index", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock

        GLOBAL.JNEXT = {
            invoke : jasmine.createSpy(),
            require : jasmine.createSpy()
        };
        spyOn(events, "trigger");
        index = require(root + "ext/ui.dialog/index");
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
    });

    it("makes sure that the dialog is called properly", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        spyOn(webview, "windowGroup").andReturn(42);
        args.eventId = "12345";
        args.message = "Hello World";
        args.buttons = [ "Yes", "No" ];
        args.settings = { title: "Hi" };
        args.message = encodeURIComponent(args.message);
        args.buttons = encodeURIComponent(JSON.stringify(args.buttons));
        args.settings = encodeURIComponent(JSON.stringify(args.settings));

        spyOn(overlayWebView, "showDialog");
        index.customAskAsync(successCB, failCB, args);

        expect(overlayWebView.showDialog).toHaveBeenCalled();
    });

    it("makes sure that a message is specified", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        args.eventId = "12345";
        index.customAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalled();
    });

    it("makes sure that buttons are specified", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        args.eventId = "12345";
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.customAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalled();
    });
    it("makes sure that buttons is an array", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {buttons : 3};

        args.eventId = "12345";
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.customAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalledWith(-1, "buttons is not an array");
    });

    it("makes sure that the dialog is called properly for standard dialogs", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        spyOn(webview, "windowGroup").andReturn(42);
        args.eventId = "12345";
        args.message = "Hello World";
        args.type = 0;
        args.settings = { title: "Hi" };
        args.eventId = encodeURIComponent(JSON.stringify(args.eventId));
        args.message = encodeURIComponent(args.message);
        args.type = encodeURIComponent(args.type);
        args.settings = encodeURIComponent(JSON.stringify(args.settings));

        spyOn(overlayWebView, "showDialog").andCallFake(function (messageObj, callback) {
            callback({
                "ok": true
            });
        });
        index.standardAskAsync(successCB, failCB, args);

        expect(overlayWebView.showDialog).toHaveBeenCalled();
        expect(successCB).toHaveBeenCalledWith();
        expect(events.trigger).toHaveBeenCalledWith("12345", {
            "return": escape("Ok")
        });
    });

    it("makes sure that a message is specified for standard dialogs", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        args.eventId = "12345";
        args.type = 1;
        args.type = encodeURIComponent(args.type);
        index.standardAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalledWith(-1, "message is undefined");
    });

    it("makes sure the type is specified for standard dialogs", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        args.eventId = "12345";
        args.message = "Hello World";
        args.message = encodeURIComponent(args.message);
        index.standardAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalledWith(-1, "type is undefined");
    });

    it("makes sure the type is valid for standard dialogs", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};

        args.eventId = "12345";
        args.message = "Hello World";
        args.type = 6;
        args.message = encodeURIComponent(args.message);
        args.type = encodeURIComponent(args.type);

        index.standardAskAsync(successCB, failCB, args);

        expect(failCB).toHaveBeenCalledWith(-1, "invalid dialog type: 6");
    });
});
