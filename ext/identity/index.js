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
var ERROR_ID = -1,
    ERRON_MSG_PPS = "Cannot retrieve data from system";

module.exports = {
    getFields: function (success, fail, args, env) {
        var fields = { };

        //IMSI is likely to fail since few devs will have access
        //TO compensate we will eat the error
        try {
            fields.IMSI = window.qnx.webplatform.device.IMSI;
        } catch (e) {
            //DO NOTHING
        }

        try {
            fields.uuid = window.qnx.webplatform.device.devicePin;
            fields.IMEI = window.qnx.webplatform.device.IMEI;

            if (fields.uuid || fields.IMSI || fields.IMEI) {
                success(fields);
            } else {
                fail(ERROR_ID, ERRON_MSG_PPS);
            }
        } catch (err) {
            fail(ERROR_ID, err.message);
        }
    }
};
