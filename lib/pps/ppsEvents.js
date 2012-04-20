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

var _ppsUtils = require('./ppsUtils');

/*
 * This function receive a context as an array that has all fields it listening to linked to pps object with corresponding helper methods.
 * It returns an onChange method that will be using that context and will be triggered from ppsUtils.
 * Each item of eventDetailsArr should have at least the following fields:
 * path - the path to pps object that contains the fields
 * fieldNameArr - array where each item contains the information about particular field
 * Required Fields:
 *     fieldNameArr.eventName - name of the field causes the event.
 *     fieldNameArr.paramName - name of the field as it will appear on return.
 *     fieldNameArr.formatValue - method formats the value to what expected on return.
 * Optional Fields:
 *     fieldNameArr.disableOnChange - set it to 'true' where there is no interest to listen on change for that field.
 *     fieldNameArr.fieldValue - the value of field at the moment first event listener is registered.
 *     fieldNameArr.setFieldValue - setter method for fieldValue property. 
 *     fieldNameArr.skipTrigger - method that checks condition to identify if should invoke the callback provided at event registration.
 */
function onChangeMethod(eventDetailsArr, eventDetailsArrIndex, trigger) {
    eventDetailsArr[eventDetailsArrIndex].fieldNameArr.forEach(function (fieldNameObj) {
        var readObj;
        if (fieldNameObj.setFieldValue) {
            readObj = eventDetailsArr[eventDetailsArrIndex].ppsUtils.read();
            if (readObj) {
                fieldNameObj.setFieldValue(readObj[fieldNameObj.eventName]);
            }
        }
    });
    
    // onChange is invoked when there is a field in the pps object that has been changed. Parameter to the method is json that has 'changed' property
    // and its value is another json contains fields that were changed {'changed': {StateOfCharge: true}}
    // The method has a context with data mapped to the event type like callback, fields and helper methods all used in parsing.
    // The parsing includes analyzing if the field that changed is the one among fields that monitored for changes, checking if trigger should be called
    // and setting field's name and value format in returned object.
    return {
        onChange: function (data) {
            var fieldNameArr,
                fieldNameObj, 
                eventObj, 
                readObj, 
                returnObj = {},
                checkIfNeedTrigger,
                i, 
                j;
            if (data) {
                eventObj = data["changed"];
                if (eventObj) {
                    fieldNameArr = eventDetailsArr[eventDetailsArrIndex].fieldNameArr;
                    // Checking if the fields registered for changed are among those that were changed.
                    // Also checking if conditions met for invoking the callback on return.
                    checkIfNeedTrigger = function (fieldNameObj) {
                        // Checking if fields that changed are one we registered for
                        if (eventObj[fieldNameObj.eventName]) {
                            if (!readObj) {
                                readObj = eventDetailsArr[eventDetailsArrIndex].ppsUtils.read();
                            }
                            //Checking if need to trigger the callback on the change
                            if (!fieldNameObj.skipTrigger || !fieldNameObj.skipTrigger(readObj[fieldNameObj.eventName])) {
                                return true;
                            }
                        }

                        return false;
                    };
                    
                    if (fieldNameArr.some(checkIfNeedTrigger)) {
                        for (i = 0; i < eventDetailsArr.length; i++) {
                            readObj = eventDetailsArr[i].ppsUtils.read();

                            for (j = 0; j < eventDetailsArr[i].fieldNameArr.length; j++) {
                                fieldNameObj = eventDetailsArr[i].fieldNameArr[j];
                                if (readObj[fieldNameObj.eventName]) {
                                    returnObj[fieldNameObj.paramName] = fieldNameObj.formatValue(readObj[fieldNameObj.eventName]);
                                }
                            }
                        }

                        trigger(returnObj);
                    }
                }
            }
        }
    };
}

module.exports = {
    addEventListener: function (eventMapObj, trigger) {
        var onChangeObj;
        
        if (eventMapObj) {
            eventMapObj.eventDetailsArr.forEach(function (eventDetailsObj, index) {
                if (eventDetailsObj) {
                    eventDetailsObj.ppsUtils = _ppsUtils.createObject();
                    eventDetailsObj.ppsUtils.init();
                    eventDetailsObj.ppsUtils.open(eventDetailsObj.path, eventMapObj.mode);
                    if (!eventDetailsObj.disableOnChange) {
                        onChangeObj = onChangeMethod(eventMapObj.eventDetailsArr, index, trigger);
                        eventDetailsObj.ppsUtils.onChange = onChangeObj.onChange;
                    }
                }
            });
        }
    },
    removeEventListener: function (eventMapObj) {
        // When removing event listener closing all instances of ppsUtills and reseting all items of fieldNameArr array.
        if (eventMapObj) {
            eventMapObj.eventDetailsArr.forEach(function (eventDetailsObj) {
                if (eventDetailsObj.ppsUtils) {
                    eventDetailsObj.ppsUtils.close();
                }
                eventDetailsObj.fieldNameArr.forEach(function (fieldNameObj) {
                    if (fieldNameObj.reset) {
                        fieldNameObj.reset();
                    }        
                });
            });
        }
    }
};
