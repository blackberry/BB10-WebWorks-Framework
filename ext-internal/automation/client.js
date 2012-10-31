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
    ID = require("./manifest.json").namespace;

_self.swipeDown = function () {
    internal.pps.syncWrite(
        {
            action : "nativeGesture", 
            duration: "500", 
            points : "[[(384,-10)(384,500)]]", 
            _src: "desktop", 
            _dest: "ui-agent"
        }, 
        "/pps/services/agent/ui-agent/control"
    );            
};

_self.swipeUp = function () {
    internal.pps.syncWrite(
        {
            action : "nativeGesture", 
            duration: "500", 
            points : "[[(384,2000)(384,500)]]", 
            _src: "desktop", 
            _dest: "ui-agent"
        }, 
        "/pps/services/agent/ui-agent/control"
    );          
};

_self.touch = function (x, y) {
    internal.pps.syncWrite(
        {
            action : "nativeTouch", 
            points : "[[(" + x + "," + y + ")]]", 
            _src: "desktop", 
            _dest: "ui-agent"
        }, 
        "/pps/services/agent/ui-agent/control"
    );
};

_self.showKeyboard = function () {
    internal.pps.syncWrite(
        { msg : "show" }, 
        "/pps/services/input/control",
        { fileMode : internal.pps.FileMode.WRONLY }
    );
};

_self.hideKeyboard = function () {
    internal.pps.syncWrite(
        { msg : "hide" }, 
        "/pps/services/input/control",
        { fileMode : internal.pps.FileMode.WRONLY }
    );
};

_self.keyboardGesture = function () {
    internal.pps.syncWrite(
        {
            action : "nativeGesture", 
            duration: "500", 
            points : "[[(200,2000)(200,500)][(400,2000)(400,500)]]", 
            _src: "desktop", 
            _dest: "ui-agent"
        }, 
        "/pps/services/agent/ui-agent/control"
    );
};

module.exports = _self;
