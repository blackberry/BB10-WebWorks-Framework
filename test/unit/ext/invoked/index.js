/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/invoked/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    mockedInvocation,
    index;

describe("invoked index", function () {

    beforeEach(function () {
        mockedInvocation = {
            getRequest: jasmine.createSpy("invocation.getRequest"),
            getStartupMode: jasmine.createSpy("invocation.getStartupMode").andCallFake(function () {
                return 0;
            }),
            LAUNCH: 0
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };

        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        index = null;
    });

    it("can register for 'invoked' event", function () {
        var evts = ["invoked"],
            args,
            success = jasmine.createSpy(),
            utils = require(_libDir + "utils");

        spyOn(events, "add");

        evts.forEach(function (e) {
            args = {eventName : encodeURIComponent(e)};

            spyOn(utils, "loadExtensionModule").andCallFake(function () {
                return eventExt;
            });

            index.registerEvents(success);
            eventExt.add(null, null, args);
            expect(success).toHaveBeenCalled();
            expect(events.add).toHaveBeenCalled();
            expect(events.add.mostRecentCall.args[0].event).toEqual(e);
            expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });
    });

    it("can un-register from 'invoked' event", function () {
        var evts = ["invoked"],
            args;
        spyOn(events, "remove");

        evts.forEach(function (e) {
            args = {eventName : encodeURIComponent(e)}; 
            eventExt.remove(null, null, args);
            expect(events.remove).toHaveBeenCalled();
            expect(events.remove.mostRecentCall.args[0].event).toEqual(e);
            expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
        });
    });
});

