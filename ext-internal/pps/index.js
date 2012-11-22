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

/* globals qnx */

module.exports = {

    syncRead: function (success, fail, args) {
        var path,
            options,
            result;
        try {
            path = JSON.parse(decodeURIComponent(args.path));
            if (args.options !== "undefined") {
                options = JSON.parse(decodeURIComponent(args.options));
            }
            result = qnx.webplatform.pps.syncReadPPSObject(path, options);
            success(result);
        }
        catch (e) {
            fail(e);
        }
    },

    syncWrite: function (success, fail, args) {
        var writeData,
            path,
            options,
            result;
        try {
            writeData = JSON.parse(decodeURIComponent(args.writeData));
            path = JSON.parse(decodeURIComponent(args.path));
            if (args.options !== "undefined") {
                options = JSON.parse(decodeURIComponent(args.options));
            }
            result = qnx.webplatform.pps.syncWritePPSObject(writeData, path, options);
            success(result);
        }
        catch (e) {
            fail(e);
        }
    }
};
