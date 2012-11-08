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
    }
    else {
        args.settings = {};
    }

    if (args.message) {
        args.message = decodeURIComponent(args.message);
        args.message = args.message = args.message.replace(/^"|"$/g, "").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else {
        return 1;
    }

    return 0;
}

var dialog,
    _event = require("../../lib/event"),
    overlayWebView = require('../../lib/overlayWebView'),
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

        var messageObj = {
            title : args.settings.title,
            message :  args.message,
            dialogType : "CustomAsk",
            optionalButtons : args.buttons
        };
        overlayWebView.showDialog(messageObj, function (result) {
            _event.trigger(args.eventId, result); 
        });
        success();
    },

    standardAskAsync: function (success, fail, args, env) {
        var buttons,
            returnValue = {},
            messageObj = {};

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

        if (args.type < 0 || args.type > 5) {
            fail(-1, "invalid dialog type: " + args.type);
            return;
        }
        
        buttons = {
            0: "JavaScriptAlert",                       // D_OK
            1: ["Save", "Discard"],                     // D_SAVE
            2: ["Delete", "Cancel"],                    // D_DELETE
            3: ["Yes", "No"],                           // D_YES_NO
            4: "JavaScriptConfirm",                     // D_OK_CANCEL
            5: "JavaScriptPrompt",                      // D_Prompt
        };

        if (!Array.isArray(buttons[args.type])) {
            messageObj = {
                title : args.settings.title,
                message :  args.message,
                dialogType : buttons[args.type],
            };
            overlayWebView.showDialog(messageObj, function (result) {
                if (args.type === 0) {//Ok dialog
                    returnValue.return = "Ok";
                } else if (args.type === 4) {//Confirm Dialog
                    if (result.ok) {
                        returnValue.return = "Ok";
                    } else {
                        returnValue.return = "Cancel";
                    }
                } else {
                    if (result.ok) {
                        returnValue.return = "Ok";
                    } else {
                        returnValue.return = "Cancel";
                    }
                    returnValue.promptText = (result.oktext) ? decodeURIComponent(result.oktext) : null;
                }
                _event.trigger(args.eventId, returnValue); 
            });
        } else {
            messageObj = {
                title : args.settings.title,
                message :  args.message,
                dialogType : "JavaScriptConfirm",
                oklabel : buttons[args.type][0],
                cancellabel : buttons[args.type][1],
            };
            overlayWebView.showDialog(messageObj, function (result) {
                if (result.ok) {
                    returnValue.return = buttons[args.type][0];
                } else {
                    returnValue.return = buttons[args.type][1];
                }
                _event.trigger(args.eventId, returnValue); 
            });
        }
        success();
    }
};