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

var bbm = require("./BBMJNEXT").bbm,
    _event = require("../../lib/event"),
    _utils = require("../../lib/utils"),
    _actionMap = {
        onaccesschanged: {
            context: require("./BBMEvents"),
            event: "onaccesschanged",
            trigger: function (allowed, reason) {
                _event.trigger("onaccesschanged", allowed, reason);
            }
        },
        onupdate: {
            context: require("./BBMEvents"),
            event: "onupdate",
            trigger: function (user, event) {
                _event.trigger("onupdate", user, event);
            }
        }
    },
    BBM_DISPLAY_NAME = 0,
    BBM_STATUS = 1,
    BBM_STATUS_MESSAGE = 2,
    BBM_PERSONAL_MESSAGE = 3,
    BBM_PPID = 4,
    BBM_HANDLE = 5,
    BBM_APP_VERSION = 6,
    BBM_SDK_VERSION = 7;

module.exports = {
    registerEvents: function (success, fail, args, env) {
        try {
            var _eventExt = _utils.loadExtensionModule("event", "index");
            _eventExt.registerEvents(_actionMap);
            success();
        } catch (e) {
            fail(-1, e);
        }
    },

    register: function (success, fail, args, env) {
        if (args) {
            args.options = JSON.parse(decodeURIComponent(args.options));

            if (args.options.uuid.length < 32) {
                fail(-1, "options are not valid");
                return;
            }

            bbm.getInstance().register(args.options);
            success();
        }
    },

    self : {
        appVersion : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_APP_VERSION));
        },

        bbmsdkVersion : function (success, fail, args, env) {
            success(parseInt(bbm.getInstance().self.getProfile(BBM_SDK_VERSION), 10));
        },

        displayName : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_DISPLAY_NAME));
        },

        handle : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_HANDLE));
        },

        personalMessage : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_PERSONAL_MESSAGE));
        },

        ppid : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_PPID));
        },

        status : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_STATUS));
        },

        statusMessage : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile(BBM_STATUS_MESSAGE));
        },

        getDisplayPicture : function (success, fail, args, env) {
            if (args) {
                args.eventId = JSON.parse(decodeURIComponent(args.eventId));

                bbm.getInstance().self.getDisplayPicture(args.eventId);
                success();
            }
        },

        setStatus : function (success, fail, args, env) {
            if (args) {
                args.status = JSON.parse(decodeURIComponent(args.status));
                args.statusMessage = JSON.parse(decodeURIComponent(args.statusMessage));

                if (args.status !== "available" && args.status !== "busy") {
                    fail(-1, "status is not valid");
                    return;
                }
            }

            bbm.getInstance().self.setStatus(args);
            success();
        },

        setPersonalMessage : function (success, fail, args, env) {
            if (args) {
                args.personalMessage = JSON.parse(decodeURIComponent(args.personalMessage));

                if (args.personalMessage.length === 0) {
                    fail(-1, "personal message must not be empty");
                    return;
                }
            }

            bbm.getInstance().self.setPersonalMessage(args.personalMessage);
            success();
        },

        setDisplayPicture : function (success, fail, args, env) {
            if (args) {
                args.displayPicture = JSON.parse(decodeURIComponent(args.displayPicture));

                if (args.displayPicture.length === 0) {
                    fail(-1, "display picture must not be empty");
                    return;
                }
            }

            bbm.getInstance().self.setDisplayPicture(args.displayPicture);
            success();
        }
    },

    users : {
        inviteToDownload : function (success, fail, args) {
            bbm.getInstance().users.inviteToDownload();
            success();
        }
    }
};
