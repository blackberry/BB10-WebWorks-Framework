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
_self.__defineGetter__("APP_CAMERA", function () {
    return 4;
});
_self.__defineGetter__("APP_MAPS", function () {
    return 5;
});
_self.__defineGetter__("APP_BROWSER", function () {
    return 11;
});
_self.__defineGetter__("APP_MUSIC", function () {
    return 13;
});
_self.__defineGetter__("APP_PHOTOS", function () {
    return 14;
});
_self.__defineGetter__("APP_VIDEOS", function () {
    return 15;
});
_self.__defineGetter__("APP_APPWORLD", function () {
    return 16;
});

module.exports = _self;