/*
 *  Copyright 2011 Research In Motion Limited.
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

module.exports = {
    handle: function (req, res) {
        try {
            var plugin = require("./plugins/" + req.params.service),
                params = req.params.args && req.params.args.split("&"),
                args = {};

            if (params) {
                params.forEach(function (param) {
                    var parts = param.split("=");
                    args[parts[0]] = parts[1];
                });
            }

            plugin[req.params.action](req,
            function (result) {
                res.send(200, {
                    code: 1,
                    data: result
                });
            },
            function (code, error, httpCode) {
                if (!httpCode) {
                    httpCode = 200;
                }

                res.send(httpCode, {
                    code: Math.abs(code) * -1 || -1,
                    data: null,
                    msg: error
                });
            },
            args,
            {
                "request": req,
                "response": res
            });
        }
        catch (e) {
            console.log(e);
            res.send(404, "can't find the stuff");
        }
    }
};
