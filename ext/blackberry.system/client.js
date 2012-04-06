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

var _self = {},
    ID = "blackberry.system";

_self.hasPermission = function (module) {
    return window.webworks.execSync(ID, "hasPermission", {"module": module});
};

_self.hasCapability = function (capability) {
    return window.webworks.execSync(ID, "hasCapability", {"capability": capability});
};

_self.__defineGetter__("ALLOW", function () {
    return 0;
});

_self.__defineGetter__("DENY", function () {
    return 1;
});

_self.__defineGetter__("model", function () {
    return window.webworks.execSync(ID, "model");
});

module.exports = _self;