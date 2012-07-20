/*
 * Copyright 2012 Research In Motion Limited.
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
var _apiDir = __dirname + "./../../../../ext/app/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    index,
    mockedExit,
    config;

function testRegisterEvent(e) {
    var args = {eventName : encodeURIComponent(e)},
        success = jasmine.createSpy(),
        utils = require(_libDir + "utils");

    spyOn(utils, "loadExtensionModule").andCallFake(function () {
        return eventExt;
    });

    index.registerEvents(success);
    eventExt.add(null, null, args);
    expect(success).toHaveBeenCalled();
    expect(events.add).toHaveBeenCalled();
    expect(events.add.mostRecentCall.args[0].event).toEqual(e);
    expect(events.add.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
}

function testUnRegisterEvent(e) {
    var args = {eventName : encodeURIComponent(e)};
    
    eventExt.remove(null, null, args);
    expect(events.remove).toHaveBeenCalled();
    expect(events.remove.mostRecentCall.args[0].event).toEqual(e);
    expect(events.remove.mostRecentCall.args[0].trigger).toEqual(jasmine.any(Function));
}

describe("app index", function () {

    beforeEach(function () {
        config = require(_libDir + "config");
        index = require(_apiDir + "index");
        mockedExit = jasmine.createSpy("exit");
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                getApplication: function () {
                    return {
                        exit: mockedExit
                    };
                }
            }
        };
    });

    afterEach(function () {
        config = null;
        index = null;
        mockedExit = null;
    });

    describe("author", function () {
        it("can call success with author", function () {
            var success = jasmine.createSpy();
            index.author(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.author);
        });
    });

    describe("authorEmail", function () {
        it("can call success with authorEmail", function () {
            var success = jasmine.createSpy();
            index.authorEmail(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.authorEmail);
        });
    });

    describe("authorURL", function () {
        it("can call success with authorURL", function () {
            var success = jasmine.createSpy();
            index.authorURL(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.authorURL);
        });
    });

    describe("copyright", function () {
        it("can call success with copyright", function () {
            var success = jasmine.createSpy();
            index.copyright(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.copyright);
        });
    });

    describe("description", function () {
        it("can call success with description", function () {
            var success = jasmine.createSpy();
            index.description(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.description);
        });
    });

    describe("id", function () {
        it("can call success with id", function () {
            var success = jasmine.createSpy();
            index.id(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.id);
        });
    });

    describe("license", function () {
        it("can call success with license", function () {
            var success = jasmine.createSpy();
            index.license(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.license);
        });
    });

    describe("licenseURL", function () {
        it("can call success with licenseURL", function () {
            var success = jasmine.createSpy();
            index.licenseURL(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.licenseURL);
        });
    });

    describe("name", function () {
        it("can call success with name", function () {
            var success = jasmine.createSpy();
            index.name(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.name);
        });
    });

    describe("version", function () {
        it("can call success with version", function () {
            var success = jasmine.createSpy();
            index.version(success, null, null, null);
            expect(success).toHaveBeenCalledWith(config.version);
        });
    });

    describe("exit", function () {
        it("can call exit on the qnx.weblplatform Application", function () {
            var success = jasmine.createSpy();
            index.exit(success, null, null, null);
            expect(mockedExit).toHaveBeenCalled();
        });
    });
    
    describe("events", function () {
        beforeEach(function () {
            spyOn(events, "add");
            spyOn(events, "remove");
        });
        
        it("can register 'pause' event", function () {
            testRegisterEvent("pause");
        });
        
        it("can register 'resume' event", function () {
            testRegisterEvent("resume");
        });
        
        it("can register 'swipedown' event", function () {
            testRegisterEvent("swipedown");
        });

        it("can un-register 'pause' event", function () {
            testUnRegisterEvent("pause");
        });
        
        it("can un-register 'resume' event", function () {
            testUnRegisterEvent("resume");
        });
        
        it("can un-register 'swipedown' event", function () {
            testUnRegisterEvent("swipedown");
        });
    });
});
