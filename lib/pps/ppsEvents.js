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

function onChangeMethod(eventMapObj, eventDetailsObj, trigger) {
    // onChange is invoked when there is a field in the pps object that has been changed. Parameter to the method is json that has 'changed' property
    // and its value is another json contains fields that were changed.
    // The method has a context with data mapped to the event type like callback, fields and helper methods all used in parsing.
    // The parsing includes analyzing if the field that changed is the one among fields that monitored for changes, checking its value to verify is in the
    // defined range, what returned field's name and value format and callback that triggered on return.
    return {
        onChange: function (data) {
            var eventDetailsArr, 
                fieldNameArr, 
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
                    fieldNameArr = eventDetailsObj.fieldNameArr;
                    // Checking if the fields registered for changed are among those that were changed.
                    // Also checking if conditions met for invoking the callback on return.
                    checkIfNeedTrigger = function (fieldNameObj) {
                        // Checking if fields that changed are one we registered for
                        if (eventObj[fieldNameObj.eventName]) {
                            if (!readObj) {
                                readObj = eventDetailsObj.ppsUtils.read();
                            }
                            //Checking if need to trigger the callback on the change
                            if (!fieldNameObj.skipTrigger || !fieldNameObj.skipTrigger(fieldNameObj.formatValue(readObj[fieldNameObj.eventName]))) {
                                return true;
                            }
                        }

                        return false;
                    };
                    
                    if (fieldNameArr.some(checkIfNeedTrigger)) {
                        eventDetailsArr = eventMapObj.eventDetailsArr;
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
            eventMapObj.eventDetailsArr.forEach(function (eventDetailsObj) {
                if (eventDetailsObj) {
                    eventDetailsObj.ppsUtils = _ppsUtils.createObject();
                    eventDetailsObj.ppsUtils.init();
                    if (!eventDetailsObj.disableOnChange) {
                        onChangeObj = onChangeMethod(eventMapObj, eventDetailsObj, trigger);
                        eventDetailsObj.ppsUtils.onChange = onChangeObj.onChange;
                    }
                    eventDetailsObj.ppsUtils.open(eventDetailsObj.path, eventMapObj.mode);
                }
            });
        }
    },
    removeEventListener: function (eventMapObj) {
        if (eventMapObj) {
            eventMapObj.eventDetailsArr.forEach(function (eventDetailsObj) {
                if (eventDetailsObj.ppsUtils) {
                    eventDetailsObj.ppsUtils.close();
                }
            });
        }
    }
};
