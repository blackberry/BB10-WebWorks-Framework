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

function _add(featureId, name, cb, success, fail, once) {
    var handler;
    if (featureId && name && typeof cb === "function") {
        handler = {
            func: cb,
            once: !!once
        };
        //If this is the first time we are adding a cb
        if (!_handlers.hasOwnProperty(name)) {
            _handlers[name] = [handler];
            //Do not call exec for once because its not necessary
            if (!once) {
                window.webworks.exec(success, fail, featureId, "add", {"eventName": name});
            }
        } else if (!_handlers[name].some(function (element, index, array) {
            return element.func === cb;
        })) {
            //Only add unique callbacks
            _handlers[name].push(handler);
        }
    }
}

module.exports = {
    add: function (featureId, name, cb, success, fail) {
        _add(featureId, name, cb, success, fail, false);
    },

    once: function (featureId, name, cb, success, fail) {
        _add(featureId, name, cb, success, fail, true);
    },

    isOn: function (name) {
        return !!_handlers[name];
    },

    remove: function (featureId, name, cb, success, fail) {
        if (featureId && name && typeof cb === "function") {
            if (_handlers.hasOwnProperty(name)) {
                _handlers[name] = _handlers[name].filter(function (element, index, array) {
                    return element.func !== cb || element.once;
                });

                if (_handlers[name].length === 0) {
                    delete _handlers[name];
                    window.webworks.exec(success, fail, featureId, "remove", {"eventName": name});
                }
            }
        }
    },

    trigger: function (name, args) {
        var parsedArgs;
        if (_handlers.hasOwnProperty(name)) {
            if (args && args !== "undefined") {
                parsedArgs = JSON.parse(decodeURIComponent(args));
            }
            //Call the handlers
            _handlers[name].forEach(function (handler) {
                if (handler) {
                    //args should be an array of arguments
                    handler.func.apply(undefined, parsedArgs);
                }
            });
            //Remove the once listeners
            _handlers[name] = _handlers[name].filter(function (handler) {
                return !handler.once;
            });
            //Clean up the array if it is empty
            if (_handlers[name].length === 0) {
                delete _handlers[name];
                //No need to call remove since this would only be for callbacks
            }
        }
    }
};
