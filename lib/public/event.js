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

var _handlers = {};

module.exports = {
    on: function (featureId, name, cb, success, fail) {
        if (featureId && name && typeof cb === "function") {
            //If this is the first time we are adding a cb
            if (!_handlers.hasOwnProperty(name)) {
                _handlers[name] = [cb];
                window.webworks.exec(success, fail, featureId, "on", {"eventName": name});
            } else if (_handlers[name].indexOf(cb) === -1) {
                //Only add unique callbacks
                _handlers[name].push(cb);
            }
        }
    },

    remove: function (featureId, name, cb, success, fail) {
        if (featureId && name && typeof cb === "function") {
            if (_handlers.hasOwnProperty(name)) {
                var found = _handlers[name].reduce(function (prev, current, index) {
                        if (prev >= 0) {
                            return prev;
                        } else if (current === cb) {
                            return index;
                        }

                        return -1;
                    }, -1);

                if (found >= 0) {
                    _handlers[name].splice(found, 1);

                    if (_handlers[name].length === 0) {
                        delete _handlers[name];
                        window.webworks.exec(success, fail, featureId, "remove", {"eventName": name});
                    }
                }
            }
        }
    },

    trigger: function (name, args) {
        var parsedArgs;
        if (_handlers.hasOwnProperty(name)) {
            if (args && args !== "undefined") {
                parsedArgs = JSON.parse(args);
            }

            _handlers[name].forEach(function (handler) {
                if (handler) {
                    handler(parsedArgs);
                }
            });
        }
    }
};
