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
var _eventCallbacks = [];

module.exports = {
    registerCallback: function (callback) {
        if (typeof callback === "function") {
            _eventCallbacks.push(callback);
            return _eventCallbacks.length - 1;
        }
    },

    removeCallback: function (id) {
        if (_eventCallbacks && id > -1 && id < _eventCallbacks.length) {
            delete _eventCallbacks[id];
        }
    },

    trigger: function (id, data) {
        if (_eventCallbacks[id]) {
            _eventCallbacks[id](data);
        }
    }
};