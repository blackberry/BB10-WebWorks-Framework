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
    index;

describe("blackberry.ui.dialog", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        
        GLOBAL.JNEXT = {
            invoke : jasmine.createSpy(),
            require : jasmine.createSpy()
        };
        
        index = require(root + "ext/blackberry.ui.dialog/index");
    });

    it("makes sure that JNEXT is initalized", function () {
        expect(GLOBAL.JNEXT.require).toHaveBeenCalled();
    });

    it("makes sure that JNEXT called properly", function () {
        var successCB = jasmine.createSpy(),
            failCB = jasmine.createSpy(),
            args = {};
        
        args.eventId = "12345";
        args.message = "Hello World";
        args.buttons = [ "Yes", "No" ];
        args.settings = { title: "Hi", size: "large", position: "stuff" };
        args.message = encodeURIComponent(args.message);
        args.buttons = encodeURIComponent(JSON.stringify(args.buttons));
        args.settings = encodeURIComponent(JSON.stringify(args.settings));
        
        index.customAskAsync(successCB, failCB, args);

        expect(GLOBAL.JNEXT.invoke).toHaveBeenCalled();
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
});
