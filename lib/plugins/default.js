/*
 * Copyright 2010-2012 Research In Motion Limited.
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

var Whitelist = require("../policy/whitelist").Whitelist,
    whitelist = new Whitelist();

module.exports = {
    exec: function (request, succ, fail, args, env) {
        var extPath = "ext/" + request.params.ext + "/index",
            methodParts = request.params.method ? request.params.method.split('/') : request.params.method,
            extension,
            method,
            shouldFail = false,
            errorMsg,
            errorCode;


        if (frameworkModules.indexOf(extPath + ".js") !== -1) {
            // use util.loadModule for unit-test mocking
            extension = require("../utils").loadModule("../" + extPath);
            if (extension) {
                if (methodParts) {
                    if (methodParts.length === 1) {
                        method = extension[methodParts[0]];
                    } else {
                        method = methodParts.reduce(function (previous, current) {
                            var returnValue;

                            if (shouldFail) {
                                return false;
                            }

                            //First time run through
                            if (typeof previous === "string") {
                                if (extension[previous]) {
                                    returnValue = extension[previous];
                                } else {
                                    shouldFail = true;
                                    errorMsg = "Method " + request.params.method + " for " + request.params.ext + " not found";
                                    errorCode = 404;
                                    return false;
                                }
                            } else {
                                returnValue = previous;
                            }
                            //Should always be true (Maybe not with single arrays)
                            if (typeof current === "string") {
                                if (returnValue[current]) {
                                    returnValue = returnValue[current];
                                } else {
                                    shouldFail = true;
                                    errorMsg = "Method " + request.params.method + " for " + request.params.ext + " not found";
                                    errorCode = 404;
                                    return false;
                                }
                            }
                            return returnValue;
                        });
                    }
                    if (method && typeof method === 'function') {
                        if (whitelist.isFeatureAllowed(request.origin, request.params.ext)) {
                            method(succ, fail, args, env);
                        } else {
                            console.error("Feature " + request.params.ext + " denied access by whitelist for origin " + request.origin);
                            shouldFail = true;
                            errorMsg = "Feature denied by whitelist";
                            errorCode = 403;
                        }
                    } else {
                        shouldFail = true;
                        errorMsg = "Method " + request.params.method + " for " + request.params.ext + " not found";
                        errorCode = 404;
                    }
                } else {
                    shouldFail = true;
                    errorMsg = "Method " + request.params.method + " for " + request.params.ext + " not found";
                    errorCode = 404;
                }
            } else  {
                shouldFail = true;
                errorMsg = "Extension " + request.params.ext + " not found";
                errorCode = 404;
            }
        } else {
            shouldFail = true;
            errorMsg = "Extension " + request.params.ext + " not found";
            errorCode = 404;
        }

        if (shouldFail) {
            fail(-1, errorMsg, errorCode);
        }
    }
};
