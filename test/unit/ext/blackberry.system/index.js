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
    Whitelist = require(root + "lib/policy/whitelist").Whitelist,
    events = require(root + "lib/event"),
    eventExt = require(root + "ext/blackberry.event/index"),
    sysIndex,
    successCB,
    failCB;

beforeEach(function () {
    GLOBAL.JNEXT = {};
    sysIndex = require(root + "ext/blackberry.system/index");
});

afterEach(function () {
    delete GLOBAL.JNEXT;
    sysIndex = null;
});

describe("blackberry.system index", function () {
    it("hasPermission", function () {
        var success = jasmine.createSpy(),
            env = {
                "request": {
                    "origin": "blah"
                },
                "response": {
                }
            };

        spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

        sysIndex.hasPermission(success, undefined, {"module": "blackberry.system"}, env);

        expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(0);
    });

    it("hasCapability", function () {
        var success = jasmine.createSpy();

        sysIndex.hasCapability(success, undefined, {"capability": "network.wlan"}, undefined);

        expect(success).toHaveBeenCalledWith(true);
    });

    describe("battery events", function () {
        beforeEach(function () {
            successCB = jasmine.createSpy("Success Callback");
            failCB = jasmine.createSpy("Fail Callback");
        });

        afterEach(function () {
            successCB = null;
            failCB = null;
        });

        it("responds to 'batterycritical' events", function () {
            var eventName = "batterycritical",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalled();
            expect(events.add.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });

        it("removes 'batterycritical' events", function () {
            var eventName = "batterycritical",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "remove");
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
        });

        it("responds to 'batterylow' events", function () {
            var eventName = "batterylow",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(null, null, args);
            expect(events.add).toHaveBeenCalled();
            expect(events.add.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });

        it("removes 'batterylow' events", function () {
            var eventName = "batterylow",
                args = {eventName : encodeURIComponent(eventName)}; 
            spyOn(events, "remove");            
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
        });

        it("responds to 'batterystatus' events", function () {
            var eventName = "batterystatus",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(successCB, failCB, args);
            expect(events.add).toHaveBeenCalled();
            expect(events.add.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("removes 'batterystatus' events", function () {
            var eventName = "batterystatus",
                args = {eventName: encodeURIComponent(eventName)}; 

            spyOn(events, "remove");
            eventExt.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event.eventName).toEqual(eventName);
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("invokes success callback when battery event name with not defined", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "add");
            sysIndex.registerEvents(jasmine.createSpy());
            eventExt.add(successCB, failCB, args);
            expect(events.add).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });

        it("invokes success callback when tring to remove battery event with name not defined", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "remove");
            eventExt.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).toHaveBeenCalled();            
            expect(failCB).not.toHaveBeenCalled();            
        });
        
        it("invokes fail callback when exception occured", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "add").andCallFake(function () {
                throw "";
            });
            
            sysIndex.registerEvents(jasmine.createSpy());            
            eventExt.add(successCB, failCB, args);
            expect(events.add).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();            
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
        });

        it("invokes fail callback when exception occured", function () {
            var eventName = "batteryeventnotdefined",
                args = {eventName: encodeURIComponent(eventName)};
                 
            spyOn(events, "remove").andCallFake(function () {
                throw "";
            });
            eventExt.remove(successCB, failCB, args);
            expect(events.remove).toHaveBeenCalled();
            expect(successCB).not.toHaveBeenCalled();            
            expect(failCB).toHaveBeenCalledWith(-1, jasmine.any(String));
        });
    });
});