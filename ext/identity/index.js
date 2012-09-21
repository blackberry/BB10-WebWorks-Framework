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
var _ppsUtils = require("../../lib/pps/ppsUtils"),
    ERROR_ID = -1,
    ERRON_MSG_PPS = "Cannot open PPS object";

function getPPSField(path, field) {
    var ppsObj = _ppsUtils.createObject(),
        ppsContent;

    ppsObj.init();

    if (ppsObj.open(path, "0")) {
        ppsContent = ppsObj.read();
    }

    ppsObj.close();

    if (ppsContent) {
        return (ppsContent[field]);
    } else {
        return ppsContent;
    }
}

module.exports = {
    uuid: function (success, fail, args, env) {
        var result = getPPSField("/pps/services/private/deviceproperties", "devicepin");

        if (result) {
            success(result);
        } else {
            fail(ERROR_ID, ERRON_MSG_PPS);
        }
    },
    IMSI: function (success, fail, args, env) {
        var result = getPPSField("/pps/services/cellular/uicc/card0/status_restricted", "imsi");

        if (result) {
            success(result);
        } else {
            fail(ERROR_ID, ERRON_MSG_PPS);
        }
    },
    IMEI: function (success, fail, args, env) {
        var result = getPPSField("/pps/services/private/deviceproperties", "IMEI");

        if (result) {
            success(result);
        } else {
            fail(ERROR_ID, ERRON_MSG_PPS);
        }
    }
};
