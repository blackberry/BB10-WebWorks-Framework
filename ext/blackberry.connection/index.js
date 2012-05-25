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

var connection = require("./connectionJNEXT").connection,
    _event = require("../../lib/event"),
    _eventExt = require("../blackberry.event/index"),
    _actionMap = {
        connectionchange: {
            context: require("./connectionEvents"),
            event: "connectionchange",
            trigger: function (args) {
                _event.trigger("connectionchange", args);
            }
        }
    };

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    type: function (success, fail, args) {
        try {
            success(connection.getType());
        } catch (e) {
            fail(-1, e);
        }
    }
};
