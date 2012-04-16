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

var _apiDir = __dirname + "./../../../../ext/blackberry.event/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    events = require(_libDir + "event"),
    successCB,
    failCB;

describe("blackberr.event index", function () {

    beforeEach(function () {
        GLOBAL.JNEXT = {};
        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("Success Callback");
        failCB = jasmine.createSpy("Fail Callback");

    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        index = null;
        successCB = null;
        failCB = null;
    });

    it("responds to 'batterystatus' events", function () {
        var eventName = "batterystatus",
            args = {eventName: encodeURIComponent(eventName)}; 
        spyOn(events, "on");
        index.on(successCB, failCB, args);
        expect(events.on).toHaveBeenCalled();
        expect(events.on.mostRecentCall.args[0].event.eventName).toEqual(eventName);
        expect(events.on.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        expect(successCB).toHaveBeenCalled();            
    });

    it("removes 'batterystatus' events", function () {
        var eventName = "batterystatus",
            args = {eventName: encodeURIComponent(eventName)}; 
        spyOn(events, "remove");
        index.remove(successCB, failCB, args);
        expect(events.remove).toHaveBeenCalled();
        expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
        expect(successCB).toHaveBeenCalled();            
    });
});
