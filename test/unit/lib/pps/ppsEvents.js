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
var _libRoot = __dirname + "/../../../../lib/",
    _event,
    _ppsEvents,
    _ppsUtils,
    _eventMap,
    _actionMap,
    _ppsUtilsFactory,
    _mockedPPSUtilsMap;

describe("ppsEvents", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        _event = require(_libRoot + "event");
        _ppsEvents = require(_libRoot + "pps/ppsEvents");
        _ppsUtils = require(_libRoot + "pps/ppsUtils");
        _mockedPPSUtilsMap = {
            batteryStatus: function () { 
                this.init = jasmine.createSpy("Init Method");
                this.open = jasmine.createSpy("Open Method");
                this.read = jasmine.createSpy("Read Method").andReturn({StateOfCharge: 100, ChargingState: "NC", TestUndefinedField: "test"});
                this.close = jasmine.createSpy("Close Method");
            }
        };
        
        _ppsUtilsFactory = function (mockEventName) {
            return new _mockedPPSUtilsMap[mockEventName]();
        };
        spyOn(_ppsUtils, "createObject").andCallFake(function () {
            return _ppsUtilsFactory("batteryStatus");
        });
        _eventMap = {
            batterystatus: {
                eventName: "batterystatus",
                eventDetailsArr: [{
                    path: "/pps/services/power/battery?wait,delta",
                    fieldNameArr: [{
                        eventName: "StateOfCharge",
                        paramName: "level",
                        formatValue: function (str) {
                            return parseInt(str, 10);
                        }
                    }]
                }, {
                    path: "/pps/services/power/charger?wait,delta",
                    fieldNameArr: [{
                        eventName: "ChargingState",
                        paramName: "isPlugged",
                        formatValue: function (str) {
                            return (str === "NC" ? false : true);
                        }
                    }]
                }],
                mode: 0
            }
        }; 
        _actionMap = {
            batterystatus: {
                event: _eventMap.batterystatus,
                trigger: jasmine.createSpy()
            }
        };
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        _event = null;
        _ppsEvents = null;
        _ppsUtils = null;
        _ppsUtilsFactory = null;
        _eventMap = null;
        _actionMap = null;
        _mockedPPSUtilsMap = null;
    });

    // Positive test cases
    describe("addEventListener for batteryStatus event", function () {
        it("should call appropriate ppsUtils methods", function () {
            var curIndexCall = 0, 
                callsPerMethod = 1, 
                batStat = _actionMap['batterystatus'], 
                mockedPPSUtilsInst;
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            expect(mockedPPSUtilsInst.init.callCount).toEqual(callsPerMethod);
            expect(mockedPPSUtilsInst.open.callCount).toEqual(callsPerMethod);
            expect(mockedPPSUtilsInst.open).toHaveBeenCalledWith(batStat.event.eventDetailsArr[curIndexCall].path, batStat.event.mode);
            curIndexCall = 1;
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            expect(mockedPPSUtilsInst.init.callCount).toEqual(callsPerMethod);
            expect(mockedPPSUtilsInst.open.callCount).toEqual(callsPerMethod);
            expect(mockedPPSUtilsInst.open).toHaveBeenCalledWith(batStat.event.eventDetailsArr[curIndexCall].path, batStat.event.mode);
            expect(mockedPPSUtilsInst.open).toHaveBeenCalledWith(batStat.event.eventDetailsArr[curIndexCall].path, batStat.event.mode);
        });

        it("should invoke onChange callback when StateOfCharge has been changed", function () {
            var curIndexCall = 0, 
                callsPerMethod = 1, 
                batStat = _actionMap['batterystatus'], 
                onChange;
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            onChange = batStat.event.eventDetailsArr[curIndexCall].ppsUtils.onChange;
            onChange({changed: {StateOfCharge: true}});
            expect(batStat.event.eventDetailsArr[curIndexCall].ppsUtils.read).toHaveBeenCalled();
            expect(batStat.trigger.callCount).toEqual(callsPerMethod); 
            expect(batStat.trigger).toHaveBeenCalledWith({level: 100, isPlugged: false});
        });

        it("should invoke onChange callback when ChargingState field has been changed", function () {
            var curIndexCall = 1, 
                callsPerMethod = 1, 
                batStat = _actionMap['batterystatus'], 
                onChange;
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            onChange = batStat.event.eventDetailsArr[curIndexCall].ppsUtils.onChange;
            onChange({changed: {ChargingState: true}});
            expect(batStat.event.eventDetailsArr[curIndexCall].ppsUtils.read).toHaveBeenCalled();
            expect(batStat.trigger.callCount).toEqual(callsPerMethod); 
            expect(batStat.trigger).toHaveBeenCalledWith({level: 100, isPlugged: false});
        });
    });

    describe("removeEventListener for batteryStatus event", function () {
        it("should call close method for each instance", function () {
            var curIndexCall = 0, 
                callsPerMethod = 1, 
                batStat = _actionMap['batterystatus'], 
                mockedPPSUtilsInst;
            // As a result of calling to addEventListener there are two pps objects that instantiated to listen for battery events
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            _ppsEvents.removeEventListener(batStat.event, batStat.trigger);
            expect(mockedPPSUtilsInst.close.callCount).toEqual(callsPerMethod);
            curIndexCall = 1;
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            expect(mockedPPSUtilsInst.close.callCount).toEqual(callsPerMethod);
        });
    });

    // Negative test cases
    describe("addEventListener for batteryStatus event", function () {
        it("should NOT invoke onChange callback when StateOfCharge has not been changed", function () {
            var curIndexCall = 0, 
                batStat = _actionMap['batterystatus'], 
                onChange;
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            onChange = batStat.event.eventDetailsArr[curIndexCall].ppsUtils.onChange;
            onChange({changed: {WrongStateOfCharge: true}});
            expect(batStat.event.eventDetailsArr[curIndexCall].ppsUtils.read).not.toHaveBeenCalled();
            expect(batStat.trigger).not.toHaveBeenCalled(); 
        });
    
        it("should NOT invoke onChange callback when ChargingState field was not changed", function () {
            var curIndexCall = 1, 
                batStat = _actionMap['batterystatus'], 
                onChange;
            _ppsEvents.addEventListener(batStat.event, batStat.trigger);
            onChange = batStat.event.eventDetailsArr[curIndexCall].ppsUtils.onChange;
            onChange({changed: {WrongChargingState: true}});
            expect(batStat.event.eventDetailsArr[curIndexCall].ppsUtils.read).not.toHaveBeenCalled();
            expect(batStat.trigger).not.toHaveBeenCalled(); 
        });
    });
    describe("removeEventListener for batteryStatus event", function () {
        it("should NOT call close method when there is no instance to close", function () {
            var curIndexCall = 0, 
                batStat = _actionMap['batterystatus'], 
                mockedPPSUtilsInst;
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            _ppsEvents.removeEventListener(batStat.event, batStat.trigger);
            expect(mockedPPSUtilsInst).not.toBeDefined();
            curIndexCall = 1;
            mockedPPSUtilsInst = batStat.event.eventDetailsArr[curIndexCall].ppsUtils;
            expect(mockedPPSUtilsInst).not.toBeDefined();
        });
    });
});