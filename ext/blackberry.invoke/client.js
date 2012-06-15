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
    _ID = "blackberry.invoke";

_self.invoke = function (appType, args) {
    return window.webworks.execAsync(_ID, "invoke", {
        'appType': appType,
        'args': args
    });
};

_self.BrowserArguments = function (url) {
    this.url = url;
};

/*
 * Define constants for appType
 */
window.webworks.defineReadOnlyField(_self, "APP_CAMERA", 4);
window.webworks.defineReadOnlyField(_self, "APP_MAPS", 5);
window.webworks.defineReadOnlyField(_self, "APP_BROWSER", 11);
window.webworks.defineReadOnlyField(_self, "APP_MUSIC", 13);
window.webworks.defineReadOnlyField(_self, "APP_PHOTOS", 14);
window.webworks.defineReadOnlyField(_self, "APP_VIDEOS", 15);
window.webworks.defineReadOnlyField(_self, "APP_APPWORLD", 16);

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;