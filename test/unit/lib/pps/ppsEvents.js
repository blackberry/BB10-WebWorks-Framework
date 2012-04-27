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
    _actionMap;
    
describe("ppsEvents", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        _event = require(_libRoot + "event");
        _ppsEvents = require(_libRoot + "pps/ppsEvents");
        _ppsUtils = require(_libRoot + "pps/ppsUtils");

        spyOn(_ppsUtils, "createObject").andCallFake(function () {
            return  {
                init: jasmine.createSpy("Init Method"),
                open: jasmine.createSpy("Open Method"),
                read: jasmine.createSpy("Read Method").andReturn({Field1: "str1", Field2: "str2", Field3: "str3", Field4: "str4", Field5: "50", OtherField: "Data"}),
                close: jasmine.createSpy("Close Method")
            };
        });
        // ActionMap defines the relationships between looked up fields their pps paths, property names and values on return result object to user.
        // i.e if listening on events for Field1 and Field2 and Field 3 in corresponding paths then return object is {returnField1: 1, returnField2: true, returnField3: false, returnField4: "Message"}
        _actionMap = {
            event: {
                eventDetailsArr: [{
                    path: "some/pps/obj/path1",
                    fieldNameArr: [{
                        eventName: "Field1",
                        paramName: "returnField1",
                        formatValue: function () {
                            return 1;
                        }
                    }]
                }, {
                    path: "some/pps/obj/path2",
                    fieldNameArr: [{
                        eventName: "Field2",
                        paramName: "returnField2",
                        formatValue: function (str) {
                            return true;
                        }
                    }]
                }, {
                    path: "some/pps/obj/path3",
                    fieldNameArr: [{
                        eventName: "Field3",
                        paramName: "returnField3",
                        formatValue: function (str) {
                            return false;
                        },
                        skipTrigger: function (value) {
                            return value === false;
                        }
                    }]
                }, {
                    path: "some/pps/obj/path4",
                    disableOnChange: true,
                    fieldNameArr: [{
                        eventName: "Field4",
                        paramName: "returnField4",
                        formatValue: function (str) {
                            return "Message";
                        }
                    }]
                }, {
                    path: "some/pps/obj/path5",
                    fieldNameArr: [{
                        eventName: "Field5",
                        paramName: "returnField5",
                        fieldValue: null,
                        reset: jasmine.createSpy("Reset Method"),
                        setFieldValue: function (value) {
                            this.fieldValue = this.formatValue(value);
                        },                        
                        formatValue: function (str) {
                            return 50;
                        },
                        skipTrigger: function (value) {
                            return false;
                        }
                    }]
                }],
                mode: 0

            },
            trigger: jasmine.createSpy()
        };
    });

    afterEach(function () {
        delete GLOBAL.JNEXT;
        _event = null;
        _ppsEvents = null;
        _ppsUtils = null;
        _actionMap = null;
    });

    // Positive test cases
    describe("addEventListener positive test", function () {
        it("should call appropriate ppsUtils methods", function () {
            var mockedPPSUtilsInst;
            
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            _actionMap.event.eventDetailsArr.forEach(function (eventDetailsItem) {
                mockedPPSUtilsInst = eventDetailsItem.ppsUtils;
                expect(mockedPPSUtilsInst.init).toHaveBeenCalled();
                expect(mockedPPSUtilsInst.open).toHaveBeenCalledWith(eventDetailsItem.path, _actionMap.event.mode);
            });
        });

        it("should invoke onChange callback when first looked up field has been changed", function () {
            var index = 0, // Corresponding ppsUtils instance handler of pps object that contains looked up field. 
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {Field1: true, Field3: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).toHaveBeenCalled();
            expect(_actionMap.trigger).toHaveBeenCalledWith({returnField1: 1, returnField2: true, returnField3: false, returnField4: "Message", returnField5: 50});
        });

        it("should invoke onChange callback when second looked up field has been changed", function () {
            var index = 1, // Corresponding ppsUtils instance handler of pps object that contains looked up field.
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {Field2: true, Field100: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).toHaveBeenCalled();
            expect(_actionMap.trigger).toHaveBeenCalledWith({returnField1: 1, returnField2: true, returnField3: false, returnField4: "Message", returnField5: 50});
        });

        it("should not invoke onChange callback when none of the looked up fields have been changed", function () {
            var index = 0, // Corresponding ppsUtils instance handler of pps object that contains looked up field.
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {Field3: true, Field100: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).not.toHaveBeenCalled();
            expect(_actionMap.trigger).not.toHaveBeenCalled(); 
        });

        it("should have onChange method not defined when there is no interest to listen for changes on the field", function () {
            var index = 3; // Corresponding ppsUtils instance handler of pps object that contains looked up field.
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.onChange).not.toBeDefined();
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).not.toHaveBeenCalled();
            expect(_actionMap.trigger).not.toHaveBeenCalled(); 

        });
        
        it("should set fieldValue field when there is logic for skipTrigger", function () {
            var index = 4, // Corresponding ppsUtils instance handler of pps object that contains looked up field.
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {Field5: true, Field100: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).toHaveBeenCalled();
            expect(_actionMap.event.eventDetailsArr[index].fieldNameArr[0].fieldValue === 50).toBeTruthy();
        });

    });

    describe("removeEventListener positive test", function () {
        it("should call close method for each instance", function () {
            var mockedPPSUtilsInst;
                
            // As a result of calling to addEventListener there are two pps objects were instantiated to listen for events
            // close method of each should be invoked.
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            _actionMap.event.eventDetailsArr.forEach(function (eventDetailsItem) {
                mockedPPSUtilsInst = eventDetailsItem.ppsUtils;
                _ppsEvents.removeEventListener(_actionMap.event, _actionMap.trigger);
                expect(mockedPPSUtilsInst.close).toHaveBeenCalled();
            });
        });

        it("should call reset method when removing an event", function () {
            var index = 4;

            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            _ppsEvents.removeEventListener(_actionMap.event, _actionMap.trigger);
            expect(_actionMap.event.eventDetailsArr[index].fieldNameArr[0].reset).toHaveBeenCalled();
        });
    });

    // Negative test cases
    describe("addEventListener negative test", function () {
        it("should NOT invoke onChange callback when first looked up field has not been changed", function () {
            var index = 0, 
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {WrongStateOfCharge: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).not.toHaveBeenCalled();
            expect(_actionMap.trigger).not.toHaveBeenCalled(); 
        });
    
        it("should NOT invoke onChange callback when second looked up field has not been changed", function () {
            var index = 1, 
                onChange;
                
            _ppsEvents.addEventListener(_actionMap.event, _actionMap.trigger);
            onChange = _actionMap.event.eventDetailsArr[index].ppsUtils.onChange;
            onChange({changed: {WrongChargingState: true}});
            expect(_actionMap.event.eventDetailsArr[index].ppsUtils.read).not.toHaveBeenCalled();
            expect(_actionMap.trigger).not.toHaveBeenCalled(); 
        });
    });
    describe("removeEventListener negative test", function () {
        it("should NOT call close method when there is no instance to close", function () {
            var mockedPPSUtilsInst;
            
            _actionMap.event.eventDetailsArr.forEach(function (eventDetailsItem) {
                mockedPPSUtilsInst = eventDetailsItem.ppsUtils;
                _ppsEvents.removeEventListener(_actionMap.event, _actionMap.trigger);
                expect(mockedPPSUtilsInst).not.toBeDefined();
            });
        });
    });
});