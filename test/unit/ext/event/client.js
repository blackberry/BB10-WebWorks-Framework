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

var _apiDir = __dirname + "./../../../../ext/event/",
    _libDir = __dirname + "./../../../../lib/",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks = {
        event : {
            add : jasmine.createSpy(), 
            remove : jasmine.createSpy()
        }
    }; 

describe("Event Listener", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window  = {webworks : mockedWebworks};
        client = require(_apiDir + "client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        client = null;
    });

    it("adds event listeners", function () {
        var eventType = "GoldenEye",
            JamesBond = jasmine.createSpy();
        client.addEventListener(eventType, JamesBond);
        expect(mockedWebworks.event.add).toHaveBeenCalledWith(_ID, eventType, JamesBond);
    });

    it("removes event listeners", function () {
        var eventType = "GoldenEyeHijack",
            JamesBond = jasmine.createSpy();
        client.removeEventListener(eventType, JamesBond);
        expect(mockedWebworks.event.remove).toHaveBeenCalledWith(_ID, eventType, JamesBond);
    });

});
