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
(function () {
    var _d = document.addEventListener,
        _webworksReady = false,
        _alreadyFired = false,
        _listenerRegistered = false;

    //Only fire the webworks event when both webworks is ready and a listener is registered
    function fireWebworksReadyEvent() {
        if (_listenerRegistered && _webworksReady && !_alreadyFired) {
            _alreadyFired = true;
            var evt = document.createEvent("Events");
            evt.initEvent("webworksready", true, true);
            document.dispatchEvent(evt);
        }
    }

    //Trapping when users add listeners to the webworks ready event
    //This way we can make sure not to fire the event before there is a listener
    document.addEventListener = function (event, callback, capture) {
        _d.call(document, event, callback, capture);
        if (event.toLowerCase() === "webworksready") {
            _listenerRegistered = true;
            fireWebworksReadyEvent();
        }
    };


    function createWebworksReady() {
        function RemoteFunctionCall(functionUri) {
            var paramString = "",
                params = {},
                isPost = false;

            function composeUri() {
                return "http://localhost:8472/blackberry/" + functionUri;
            }

            function createXhrRequest(uri, isAsync) {
                var request = new XMLHttpRequest(),
                    paramCount = 1,
                    param;

                for (param in params) {
                    if (params.hasOwnProperty(param)) {
                        paramString += param + "=" + params[param] + "&";
                        paramCount++;
                    }
                }

                paramString = paramString.replace(/\&$/, "");

                if (!isPost && paramString) {
                    uri += "?" + paramString;
                }

                // TODO: make get/post
                request.open("GET", uri, isAsync);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                return request;
            }

            this.addParam = function (name, value) {
                params[name] = encodeURIComponent(JSON.stringify(value));
            };

            this.makeSyncCall = function (success, error) {
                var requestUri = composeUri(),
                    request = createXhrRequest(requestUri, false),
                    response, 
                    errored, 
                    cb, 
                    data;

                request.send(isPost ? paramString : null);

                response = JSON.parse(request.responseText || "null");
                errored = response.code < 0;
                cb = errored ? error : success;
                data = errored ? response.msg : response.data;

                if (cb) {
                    cb(data, response);
                }
                else if (errored) {
                    throw data;
                }

                return data;
            };

            this.makeAsyncCall = function (success, error) {
                var requestUri = composeUri(),
                    request = createXhrRequest(requestUri, true);

                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var response = JSON.parse(request.responseText || "null"),
                        cb = response.code < 0 ? error : success,
                        data = response.code < 0 ? response.msg : response.data;

                        return cb && cb(data, response);
                    }
                };

                request.send(isPost ? paramString : null);
            };
        }

        var builder,
            request,
            execFunc;
        
        //For users who wish to have a single source project across BB7 -> PB -> BB10 they will need to use webworks.js
        //To aid in this, we will fire the webworksready event on these platforms as well
        //If blackberry object already exists then we are in an older version of webworks
        if (window.blackberry) {
            _webworksReady = true;
            fireWebworksReadyEvent();
            return;
        }

        // Build out the blackberry namespace based on the APIs desired in the config.xml
        builder = require('builder');
        request = new XMLHttpRequest();

        request.open("GET", "http://localhost:8472/blackberry/extensions/get", true);

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var resp;

                resp = JSON.parse(request.responseText);
                builder.build(resp.data).into(window);
                //At this point all of the APIs should be built into the window object
                //Fire the webworks ready event
                _webworksReady = true;
                fireWebworksReadyEvent();
            }
        };
        request.send(null);

        execFunc = function (success, fail, service, action, args, sync) {
            var uri = "bridge/exec/" + service + "/" + action,
                request = new RemoteFunctionCall(uri),
                name;

            for (name in args) {
                if (Object.hasOwnProperty.call(args, name)) {
                    request.addParam(name, args[name]);
                }
            }

            request[sync ? "makeSyncCall" : "makeAsyncCall"](success, fail);
        };

        window.webworks = {
            exec: execFunc,
            execSync: function (service, action, args) {
                var result;

                execFunc(function (data, response) {
                    result = data;
                }, function (data, response) {
                    throw data;
                }, service, action, args, true);

                return result;
            },
            execAsync: function (service, action, args) {
                var result;

                execFunc(function (data, response) {
                    result = data;
                }, function (data, response) {
                    throw data;
                }, service, action, args, false);

                return result;
            },
            successCallback: function (id, args) {
                //HACK: this will live later
                throw "not implemented";
            },
            errorCallback: function (id, args) {
                //HACK: this will live later
                throw "not implemented";
            },
            defineReadOnlyField: function (obj, field, value) {
                Object.defineProperty(obj, field, {
                    "value": value,
                    "writable": false
                });
            },
            event: require("event")
        };
    }
    //Only start building window.webworks once the DOMContent is loaded
    document.addEventListener('DOMContentLoaded', createWebworksReady, false);
    //If the DOM Content has already been loaded then create window.webworks immediately
    if (document.readyState === 'complete') {
        createWebworksReady();
    } 
}());
