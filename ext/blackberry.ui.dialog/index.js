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
function validateIdMessageSettings(args) {
    args.eventId = JSON.parse(decodeURIComponent(args.eventId));

    if (args.settings) {
        args.settings = JSON.parse(decodeURIComponent(args.settings));
    } else {
        args.settings = { title : "", size: "medium", position: "middleCenter" };
    }

    if (args.message) {
        args.message = decodeURIComponent(args.message);
    } else {
        return 1;
    }

    return 0;
}

var dialog,
    _event = require("../../lib/event"),
    _webview = require("../../lib/webview");
    
module.exports = {
    customAskAsync: function (success, fail, args, env) {
        if (validateIdMessageSettings(args) === 1) {
            fail(-1, "message is undefined");
            return;
        }

        if (args.buttons) {
            args.buttons = JSON.parse(decodeURIComponent(args.buttons));
        } else {
            fail(-1, "buttons is undefined");
            return;
        }
        
        if (!Array.isArray(args.buttons)) {
            fail(-1, "buttons is not an array");
            return;
        }
        
        dialog.show(args.eventId, args.message, args.buttons, args.settings);
        success();
    },

    standardAskAsync: function (success, fail, args, env) {
        if (validateIdMessageSettings(args) === 1) {
            fail(-1, "message is undefined");
            return;
        }
        
        if (args.type) {
            args.type = JSON.parse(decodeURIComponent(args.type));
        } else {
            fail(-1, "type is undefined");
            return;
        }
        
        if (args.type < 0 || args.type > 4) {
            fail(-1, "invalid dialog type: " + args.type);
            return;
        }

        var buttons = {
            0: ["Ok"],                  // D_OK
            1: ["Save", "Discard"],     // D_SAVE
            2: ["Delete", "Cancel"],    // D_DELETE
            3: ["Yes", "No"],           // D_YES_NO
            4: ["Ok", "Cancel"]         // D_OK_CANCEL
        };

        dialog.show(args.eventId, args.message, buttons[args.type], args.settings);
        success();
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.Dialog = function ()
{   
    var self = this;

    self.show = function (eventId, message, buttons, settings) {
        settings.message = message;
        settings.buttons = buttons;
        settings.eventId = eventId;
        settings.windowGroup = _webview.windowGroup();
        self.eventId = settings.eventId = eventId;
        var val = JNEXT.invoke(self.m_id, "show " + JSON.stringify(settings));
        return val;
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("dialog")) {   
            return false;
        }

        self.m_id = JNEXT.createObject("dialog.Dialog");
        
        if (self.m_id === "") {   
            return false;
        }

        JNEXT.registerEvents(self);
    };
    
    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0];
            
        if (strEventDesc === "result") {
            _event.trigger(self.eventId, arData[1]);
        }
    };
    
    self.onBlink = {};
    self.m_id = "";
    self.eventId = "";

    self.init();
};

dialog = new JNEXT.Dialog();
