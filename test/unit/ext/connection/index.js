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
var _apiDir = __dirname + "./../../../../ext/connection/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    mockedQnx,
    index;

describe("connection index", function () {
    beforeEach(function () {
        GLOBAL.qnx = mockedQnx = {
            webplatform: {
                device: {
                    activeConnection: {
                        type: 'wifi',
                        technology: ''
                    }
                }
            }
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        delete GLOBAL.qnx;
    });

    describe("connection", function () {
        describe("type", function () {
            it("can call success", function () {
                var success = jasmine.createSpy();

                index.type(success, null, null, null);

                expect(success).toHaveBeenCalledWith("wifi");
            });

            it("can call fail", function () {
                var fail = jasmine.createSpy();
                delete mockedQnx.webplatform.device;

                index.type(null, fail, null, null);

                expect(fail).toHaveBeenCalledWith(-1, jasmine.any(Object));
                expect(fail.calls[0].args[1].message).toEqual("Cannot read property 'activeConnection' of undefined");
            });

            it('maps device connection types to constants', function () {
                var map = {
                    'wired': 'ethernet',
                    'wifi': 'wifi',
                    'bluetooth_dun': 'bluetooth_dun',
                    'usb': 'usb',
                    'vpn': 'vpn',
                    'bb': 'rim-bb',
                    'unknown': 'unknown',
                    'none': 'none',
                };
                Object.getOwnPropertyNames(map).forEach(function (type) {
                    var success = jasmine.createSpy();
                    mockedQnx.webplatform.device.activeConnection.type = type;
                    index.type(success);
                    expect(success).toHaveBeenCalledWith(map[type]);
                });
            });

            it('maps cellular technologies to appropriate constants', function () {
                var map = {
                    'edge': '2g',
                    'evdo': '3g',
                    'umts': '3g',
                    'lte': '4g'
                };

                mockedQnx.webplatform.device.activeConnection.type = 'cellular';
                Object.getOwnPropertyNames(map).forEach(function (technology) {
                    var success = jasmine.createSpy();
                    mockedQnx.webplatform.device.activeConnection.technology = technology;
                    index.type(success);
                    expect(success).toHaveBeenCalledWith(map[technology]);
                });
            });
        });

        describe("connectionChange", function () {
            it("can register the 'connectionChange' event", function () {
                var success = jasmine.createSpy(),
                    utils = require(_libDir + "utils");

                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });

                spyOn(eventExt, 'registerEvents');

                index.registerEvents(success);

                expect(eventExt.registerEvents).toHaveBeenCalledWith({
                    connectionchange: {
                        context: jasmine.any(Object),
                        event: "connectionChange",
                        trigger: jasmine.any(Function)
                    }
                });
            });

            it('is triggered with an object containing oldType and newType props', function () {
                var success = jasmine.createSpy(),
                    utils = require(_libDir + "utils"),
                    connectionchangeTrigger,
                    mockeventdata = {};

                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });

                spyOn(events, 'trigger').andCallFake(function () {});

                spyOn(eventExt, 'registerEvents');
                index.registerEvents(success);

                mockedQnx.webplatform.device.activeConnection.type = 'usb';

                connectionchangeTrigger = eventExt.registerEvents.calls[0].args[0].connectionchange.trigger;
                connectionchangeTrigger(mockeventdata);
                expect(mockeventdata.oldType).toEqual('wifi');
                expect(mockeventdata.newType).toEqual('usb');
            });

            it('does not trigger if the active connection type has not changed', function () {
                var success = jasmine.createSpy(),
                    utils = require(_libDir + "utils"),
                    connectionchangeTrigger,
                    mockeventdata = {};

                spyOn(utils, "loadExtensionModule").andCallFake(function () {
                    return eventExt;
                });

                spyOn(events, 'trigger').andCallFake(function () {});

                spyOn(eventExt, 'registerEvents');
                index.registerEvents(success);

                connectionchangeTrigger = eventExt.registerEvents.calls[0].args[0].connectionchange.trigger;
                connectionchangeTrigger(mockeventdata);
                expect(events.trigger).not.toHaveBeenCalled();
            });


        });
    });
});
