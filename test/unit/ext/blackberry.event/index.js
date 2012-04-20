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

describe("blackberry.event index", function () {
    describe("battery events", function () {
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

        it("responds to 'batterycritical' events", function () {
            var eventName = "batterycritical",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "on");
            index.on(null, null, args);
            expect(events.on).toHaveBeenCalled();
            expect(events.on.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(events.on.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });

        it("removes 'batterycritical' events", function () {
            var eventName = "batterycritical",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "remove");
            index.remove(null, null, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
        });

        it("responds to 'batterylow' events", function () {
            var eventName = "batterylow",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "on");
            index.on(null, null, args);
            expect(events.on).toHaveBeenCalled();
            expect(events.on.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(events.on.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });

        it("removes 'batterylow' events", function () {
            var eventName = "batterylow",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "remove");
            index.remove(null, null, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
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
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("removes 'batterystatus' events", function () {
            var eventName = "batterystatus",
                args = {eventName: encodeURIComponent(eventName)}; 

            spyOn(events, "remove");
            index.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("invokes success callback when battery event name with not defined", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "on");
            index.on(successCB, failCB, args);
            expect(events.on).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("invokes success callback when tring to remove battery event with name not defined", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "remove");
            index.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });
        
        it("invokes fail callback when exception occured", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "on").andCallFake(function () {
                throw "";
            });
            
            index.on(successCB, failCB, args);
            expect(events.on).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();            
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
        });

        it("invokes fail callback when exception occured", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "remove").andCallFake(function () {
                throw "";
            });
            index.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();            
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));

        });
    });

    describe("pause/resume", function () {
        beforeEach(function () {
            index = require(_apiDir + "index");
        });

        afterEach(function () {
            index = null;
        });

        it("can register 'pause' and 'resume' event", function () {
            var evts = ["pause", "resume"],
                args;
            spyOn(events, "on");

            evts.forEach(function (e) {
                args = {eventName : encodeURIComponent(e)}; 
                index.on(null, null, args);
                expect(events.on).toHaveBeenCalled();
                expect(events.on.mostRecentCall.args[0].event).toEqual(e);
                expect(events.on.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));                
            });
        });

        it("can un-register 'pause' and 'resume' event", function () {
            var evts = ["pause", "resume"],
                args;
            spyOn(events, "remove");

            evts.forEach(function (e) {
                args = {eventName : encodeURIComponent(e)}; 
                index.remove(null, null, args);
                expect(events.remove).toHaveBeenCalled();
                expect(events.remove.mostRecentCall.args[0].event).toEqual(e);
                expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            });
        });
    });
});
