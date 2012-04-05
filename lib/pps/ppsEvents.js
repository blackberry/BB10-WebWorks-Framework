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
    return {
        onChange: function (data) {
            var eventDetailsArr, 
                fieldNameArr, 
                fieldNameObj, 
                eventObj, 
                readObj, 
                returnObj = {}, 
                fieldFound, 
                i, 
                j;
            if (data) {
                // data returned is an object that has 'changed' property name
                // and its value is an object contains fields that were changed
                eventObj = data["changed"];
                if (eventObj) {
                    fieldNameArr = eventDetailsObj.fieldNameArr;
                    fieldNameArr.forEach(function (fieldNameObj) {
                        // Checking if fields that changed are one we registered for
                        if (eventObj[fieldNameObj.eventName]) {
                            fieldFound = true;
                        }
                    });
                    if (fieldFound) {
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
        if (eventMapObj) {
            eventMapObj.eventDetailsArr.forEach(function (eventDetailsObj) {
                if (eventDetailsObj) {
                    eventDetailsObj.ppsUtils = _ppsUtils.createObject();
                    eventDetailsObj.ppsUtils.init();
                    var onChangeObj = onChangeMethod(eventMapObj, eventDetailsObj, trigger);
                    eventDetailsObj.ppsUtils.onChange = onChangeObj.onChange;
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
