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
    client = null,
    mockedWebworks = {
        execAsync: jasmine.createSpy(),
        defineReadOnlyField: jasmine.createSpy(),
        event: { once : jasmine.createSpy() }
    },
    constants = {
        "SIZE_FULL": "full",
        "SIZE_LARGE": "large",
        "SIZE_MEDIUM": "medium",
        "SIZE_SMALL": "small",
        "SIZE_TALL": "tall",
        "BOTTOM": "bottomCenter",
        "CENTER": "middleCenter",
        "TOP": "topCenter"
    },
    defineROFieldArgs = [];

describe("blackberry.ui.dialog", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;
        client = require(root + "ext/blackberry.ui.dialog/client");
    });

    it("should return constant for appropriate dialog styles", function () {
        // fill up the constants map
        Object.getOwnPropertyNames(constants).forEach(function (c) {
            defineROFieldArgs.push([client, c, constants[c]]);
        });
            
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SIZE_FULL")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SIZE_LARGE")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SIZE_MEDIUM")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SIZE_SMALL")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("SIZE_TALL")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("BOTTOM")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("CENTER")]);
        expect(mockedWebworks.defineReadOnlyField.argsForCall).toContain(defineROFieldArgs[Object.getOwnPropertyNames(constants).indexOf("TOP")]);
    });
    
    it("creates a dialog", function () {
        var message = "hello world",
            buttons = [ ],
            callback,
            settings = {};
            
        client.customAskAsync(message, buttons, callback, settings);
        expect(mockedWebworks.event.once).toHaveBeenCalledWith("blackberry.ui.dialog", jasmine.any(Number), callback);
        expect(mockedWebworks.execAsync).toHaveBeenCalledWith("blackberry.ui.dialog", "customAskAsync", { "eventId" : jasmine.any(Number), "message" : message, "buttons" : buttons, "callback" : callback, "settings" : settings });
    });
    
});
