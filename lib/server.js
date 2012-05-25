/*
 *  Copyright 2012 Research In Motion Limited.
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

var DEFAULT_SERVICE = "default",
    DEFAULT_ACTION = "exec";


function rebuildRequest(req) {
    return {
        params : {
            service : DEFAULT_SERVICE,
            action : DEFAULT_ACTION,
            ext : req.params.service,
            method : req.params.action && req.params.action.indexOf("?") >= 0 ? req.params.action.split("?")[0] : req.params.action,
            args : req.params.action && req.params.action.indexOf("?") >= 0 ? req.params.action.split("?")[1] : null
        },
        body : req.body,
        origin : req.origin
    };
}

module.exports = {
    handle: function (req, res) {
        try {
            var pluginName = "lib/plugins/" + req.params.service, 
                plugin,
                params,
                args = {};
            
            if (frameworkModules.indexOf(pluginName + ".js") === -1) {
                pluginName = "lib/plugins/" + DEFAULT_SERVICE;
                req = rebuildRequest(req);
            }

            //Updating because some versions of node only work with relative paths
            pluginName = pluginName.replace('lib', '.');

            plugin = require(pluginName);
            params = req.params.args && req.params.args.split("&");

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
        } catch (e) {
            console.log(e);
            res.send(404, "can't find the stuff");
        }
    }
};
