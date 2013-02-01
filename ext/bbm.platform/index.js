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
    Whitelist = require("../../lib/policy/whitelist").Whitelist,
    _whitelist = new Whitelist(),
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
    };

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

            if (!args.options.uuid || args.options.uuid.length === 0) {
                fail(-1, "Must specifiy UUID");
            }

            if (args.options.uuid.length < 32) {
                fail(-1, "UUID is not valid length");
                return;
            }

            bbm.getInstance().register(args.options);
            success();
        }
    },

    self : {
        appVersion : function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("appVersion"));
        },

        bbmsdkVersion: function (success, fail, args, env) {
            success(parseInt(bbm.getInstance().self.getProfile("bbmsdkVersion"), 10));
        },

        displayName: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("displayName"));
        },

        handle: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("handle"));
        },

        personalMessage: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("personalMessage"));
        },

        ppid: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("ppid"));
        },

        status: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("status"));
        },

        statusMessage: function (success, fail, args, env) {
            success(bbm.getInstance().self.getProfile("statusMessage"));
        },

        getDisplayPicture: function (success, fail, args, env) {
            if (args) {
                args.eventId = JSON.parse(decodeURIComponent(args.eventId));

                bbm.getInstance().self.getDisplayPicture(args.eventId);
                success();
            }
        },

        setStatus: function (success, fail, args, env) {
            if (args) {
                args.status = JSON.parse(decodeURIComponent(args.status));
                args.statusMessage = JSON.parse(decodeURIComponent(args.statusMessage));

                if (args.status !== "available" && args.status !== "busy") {
                    fail(-1, "Status is not valid");
                    return;
                }
            }

            bbm.getInstance().self.setStatus(args);
            success();
        },

        setPersonalMessage: function (success, fail, args, env) {
            if (args) {
                args.personalMessage = JSON.parse(decodeURIComponent(args.personalMessage));

                if (args.personalMessage.length === 0) {
                    fail(-1, "Personal message must not be empty");
                    return;
                }
            }

            bbm.getInstance().self.setPersonalMessage(args.personalMessage);
            success();
        },

        setDisplayPicture: function (success, fail, args, env) {
            if (args) {
                args.displayPicture = JSON.parse(decodeURIComponent(args.displayPicture));
                args.eventId = JSON.parse(decodeURIComponent(args.eventId));

                if (args.displayPicture.length === 0) {
                    fail(-1, "Display picture must not be empty");
                    return;
                }

                if (!_whitelist.isAccessAllowed(args.displayPicture)) {
                    fail(-1, "URL denied by whitelist: " + args.displayPicture);
                    return;
                }

                args.displayPicture = _utils.translatePath(args.displayPicture).replace(/file:\/\//, '');
            }

            bbm.getInstance().self.setDisplayPicture(args.displayPicture, args.eventId);
            success();
        },

        profilebox: {
            addItem: function (success, fail, args, env) {
                if (args) {
                    args.options = JSON.parse(decodeURIComponent(args.options));
                    args.eventId = JSON.parse(decodeURIComponent(args.eventId));
                    
                    if (!args.options.text || args.options.text.length === 0) {
                        fail(-1, "must specify text");
                        return;
                    }
                    
                    if (!args.options.cookie || args.options.cookie.length === 0) {
                        fail(-1, "Must specify cookie");
                        return;
                    }

                    if (args.options.iconId && args.options.iconId < 1) {
                        fail(-1, "Invalid icon ID");
                        return;
                    }

                    bbm.getInstance().self.profilebox.addItem(args.options, args.eventId);
                    success();
                }
            },

            removeItem: function (success, fail, args, env) {
                if (args) {
                    args.options = JSON.parse(decodeURIComponent(args.options));
                    args.eventId = JSON.parse(decodeURIComponent(args.eventId));

                    if (!args.options.id || args.options.id.length === 0 || typeof args.options.id !== "string") {
                        fail(-1, "Must specify valid item id");
                        return;
                    }

                    bbm.getInstance().self.profilebox.removeItem(args.options, args.eventId);
                    success();
                }
            },

            clearItems: function (success, fail, args, env) {
                bbm.getInstance().self.profilebox.clearItems();
                success(); 
            },

            registerIcon: function (success, fail, args, env) {
                if (args) {
                    args.options = JSON.parse(decodeURIComponent(args.options));
                    args.eventId = JSON.parse(decodeURIComponent(args.eventId));

                    if (!args.options.iconId || args.options.iconId <= 0) {
                        fail(-1, "Must specify valid ID for icon");
                        return;
                    }

                    if (!args.options.icon || args.options.icon.length === 0) {
                        fail(-1, "Must specify icon to register");
                        return;
                    }

                    if (args.options.icon) {

                        if (!_whitelist.isAccessAllowed(args.options.icon)) {
                            fail(-1, "URL denied by whitelist: " + args.displayPicture);
                            return;
                        }

                        args.options.icon = _utils.translatePath(args.options.icon).replace(/file:\/\//, '');
                    }

                    bbm.getInstance().self.profilebox.registerIcon(args.options, args.eventId);
                    success();
                }
            },

            getItems: function (success, fail, args, env) {
                success(bbm.getInstance().self.profilebox.getItems());
            },

            getAccessible : function (success, fail, args, env) {
                success(bbm.getInstance().self.profilebox.getAccessible());
            }
        }
    },

    users : {
        inviteToDownload: function (success, fail, args, env) {
            bbm.getInstance().users.inviteToDownload();
            success();
        }
    }
};
