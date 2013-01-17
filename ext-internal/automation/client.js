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
var _self = {},
    ID = require("./manifest.json").namespace;

_self.TOUCH_SPACE_FROM_EDGE = 50;
_self.CONTEXTMENU_ITEM_HEIGHT = 121;
_self.INVOCATIONLIST_TITLE_HEIGHT = 111;
_self.INVOCATIONLIST_ITEM_HEIGHT = 121;
_self.CONTEXTMENU_SHARE_ITEM = 760;
_self.SWIPE_DURATION = "500";

// Return approximate width of footer's icon depend of what device orientation is
_self.getFooterMenuIconWidth = function () {
    return screen.availWidth < screen.availHeight? 150 : 250;
};

_self.swipeDown = function () {
    internal.pps.syncWrite(
        {
            action : "nativeGesture",
            duration: _self.SWIPE_DURATION,
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
            duration: _self.SWIPE_DURATION,
            points : "[[(384,2000)(384,500)]]",
            _src: "desktop",
            _dest: "ui-agent"
        },
        "/pps/services/agent/ui-agent/control"
    );
};

_self.swipeUpABitFromCenter = function () {
    internal.pps.syncWrite(
        {
            action : "nativeGesture",
            duration: _self.SWIPE_DURATION,
            points : "[[(" + screen.availWidth / 2 + "," + screen.availHeight / 2 + ")(" + screen.availWidth / 2 + "," + (screen.availHeight / 2 - _self.TOUCH_SPACE_FROM_EDGE * 3) + ")]]",
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

_self.longTouch = function (x, y) {
    internal.pps.syncWrite(
        {
            action : "nativeTouch",
            points : "[[(" + x + "," + y + ")]]",
            _src: "desktop",
            _dest: "ui-agent",
            duration: 1500
        },
        "/pps/services/agent/ui-agent/control"
    );
};

_self.touchBottomRight = function () {
    _self.touch(screen.availWidth - _self.TOUCH_SPACE_FROM_EDGE, screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchBottomLeft = function () {
    _self.touch(_self.TOUCH_SPACE_FROM_EDGE, screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchBottomLeftSecondIcon = function () {
    _self.touch(_self.TOUCH_SPACE_FROM_EDGE + _self.getFooterMenuIconWidth(), screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchBottomLeftThirdIcon = function () {
    _self.touch(_self.TOUCH_SPACE_FROM_EDGE + _self.getFooterMenuIconWidth() * 2, screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchBottomRight = function () {
    _self.touch(screen.availWidth - _self.TOUCH_SPACE_FROM_EDGE, screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchBottomCenter = function () {
    _self.touch(screen.availWidth / 2, screen.availHeight - _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchTopLeft = function () {
    _self.touch(_self.TOUCH_SPACE_FROM_EDGE, _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchTopRight = function () {
    _self.touch(screen.availWidth - _self.TOUCH_SPACE_FROM_EDGE, _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchCenter = function () {
    _self.touch(screen.availWidth / 2, screen.availHeight / 2);
};

_self.touchContextMenuShare = function () {
    _self.touch(screen.availWidth - 10 , _self.CONTEXTMENU_SHARE_ITEM);
};

_self.touchInvocationListItem = function (index) {
    _self.touch(screen.availWidth / 2 ,  (_self.INVOCATIONLIST_TITLE_HEIGHT - 25) + _self.INVOCATIONLIST_ITEM_HEIGHT * index);
    // touch past the cancel bar, plus each item width, with a 5 offset to actually touch the item
};

_self.getForegroundAppInfo = function () {
    var appInfo = {};
    internal.pps.syncWrite(
        {
            _src: "desktop",
            _dest: "navigator",
            msg: "getForegroundAppInfo"
        },
        "/pps/services/automation/navigator/control"
    );
    internal.pps.syncRead("/pps/services/automation/navigator/output").output.response.slice(0, -1).split(";").forEach(function (element) {
        appInfo[element.split("=")[0]] = element.split("=")[1];
    });
    return appInfo;
};

_self.injectText = function (inputText) {
    internal.pps.syncWrite(
        {
            action: "injectText",
            text: inputText,
            _src: "desktop",
            _dest: "ui-agent"
        },
        "/pps/services/agent/ui-agent/control"
    );
};
_self.touchTopLeft = function () {
    _self.touch(_self.TOUCH_SPACE_FROM_EDGE, _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchTopRight = function () {
    _self.touch(screen.availWidth - _self.TOUCH_SPACE_FROM_EDGE, _self.TOUCH_SPACE_FROM_EDGE);
};

_self.touchTopRightAppTile = function () {
    _self.touch(screen.availWidth - 100, 300);
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
            duration: _self.SWIPE_DURATION,
            points : "[[(200,2000)(200,500)][(400,2000)(400,500)]]",
            _src: "desktop",
            _dest: "ui-agent"
        },
        "/pps/services/agent/ui-agent/control"
    );
};

/*
 * orientation can be [LEFT_UP | RIGHT_UP | TOP_UP | BOTTOM_UP | FACE_UP | FACE_DOWN | FACE_DOWN]
 */
_self.rotate = function (orientation) {
    internal.pps.syncWrite(
        {
            action : "setAccelerometerOrientation",
            orientation : orientation,
            _src: "desktop",
            _dest: "ui-agent"
        },
        "/pps/services/agent/ui-agent/control"
    );
};

/*
 * Takes the screenshot, path can be any path the application has write access.
 */
_self.takeScreenshot = function (path) {
    internal.pps.syncWrite(
        {
            action : "Remote Call",
            class : "ScreenApi",
            method : "takeScreenshot",
            parameter0 : path,
            _src : "test-agent",
            _dest : "puppetmaster"
        },
        "/pps/services/agent/puppetmaster/control"
    );
};

/*
 * Compares screenshot to a reference image located under /accounts/1000/shared/misc/PuppetMaster/ReferenceImages/
 * name is the image name stored under.
 */
_self.compareCurrentScreen = function (name, callback) {
    //should be converted to using delta mode on the output object but its hard due to subsequent calls
    internal.pps.syncWrite(
        {
            action : "Remote Call",
            class : "ScreenApi",
            method : "compareScreenToReference",
            parameter0 : name,
            _src : "test-agent",
            _dest : "puppetmaster"
        },
        "/pps/services/agent/puppetmaster/control"
    );
    setTimeout(function () {
        callback(internal.pps.syncRead("/pps/services/agent/puppetmaster/output").output.response);
    }, 1000);
};

_self.toggleWifi = function (enabled) {
    internal.pps.syncWrite(
        {
            action : "Remote Call",
            class : "WifiApi",
            method : "toggleWifi",
            parameter0 : enabled.toString(),
            _src : "test-agent",
            _dest : "puppetmaster",
            _id : 0
        },
        "/pps/services/agent/puppetmaster/control"
    );
};

/*
 * Updates BattMgr PPS with provided level and state
 */
_self.setBatteryStatus = function(level, state){
   internal.pps.syncWrite(
        {
            BatteryInfo : {
                "BatteryState" : "READY",
                "BatteryStatus" : {
                    "BatteryPresent" : "YES",
                    "BatteryId" : 226,
                    "StateOfBattery" : "OK",
                    "StateOfCharge" : level,
                    "StateOfHealth" : 90
                }
            }, 
            ChargerInfo : state,
            DeviceName : "",
            TimeToEmpty : 6142,
            TimeToFull : 3655,
            Version : 1 
        },
        "/pps/services/BattMgr/status"
    );    
};

_self.getBatteryStatus = function() {
    return internal.pps.syncRead("/pps/services/BattMgr/status");
};

module.exports = _self;
