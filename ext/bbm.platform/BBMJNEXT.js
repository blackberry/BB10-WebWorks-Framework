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

function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var bbm,
    accesschangedCallback = null,
    updateCallback = null,
    _event = require("../../lib/event");

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.BBM = function ()
{
    var _self = this,
        hasInstance = false;

    _self.self = {};
    _self.self.profilebox = {};
    _self.users = {};

    _self.startEvents = function (trigger) {
        if (accesschangedCallback === null) {
            accesschangedCallback = trigger;
            JNEXT.invoke(_self.m_id, "startEvents");
        }
    };

    _self.stopEvents = function () {
        accesschangedCallback = null;
        JNEXT.invoke(_self.m_id, "stopEvents");
    };

    _self.startContactEvents = function (trigger) {
        if (updateCallback === null) {
            updateCallback = trigger;
            JNEXT.invoke(_self.m_id, "startContactEvents");
        }
    };

    _self.stopContactEvents = function () {
        updateCallback = null;
        JNEXT.invoke(_self.m_id, "stopContactEvents");
    };

    _self.register = function (options) {
        JNEXT.invoke(_self.m_id, "register " + JSON.stringify(options));
    };

    _self.self.getProfile = function (field) {
        return JNEXT.invoke(_self.m_id, "self.getProfile " + field);
    };

    _self.self.getDisplayPicture = function (eventId) {
        _self.getDisplayPictureEventId = eventId;
        return JNEXT.invoke(_self.m_id, "self.getDisplayPicture");
    };

    _self.self.setStatus = function (statusArgs) {
        JNEXT.invoke(_self.m_id, "self.setStatus " + JSON.stringify(statusArgs));
    };

    _self.self.setPersonalMessage = function (personalMessage) {
        JNEXT.invoke(_self.m_id, "self.setPersonalMessage " + personalMessage);
    };

    _self.self.setDisplayPicture = function (displayPicture, eventId) {
        _self.setDisplayPictureEventId = eventId;
        JNEXT.invoke(_self.m_id, "self.setDisplayPicture " + displayPicture);
    };

    _self.self.profilebox.addItem = function (options, eventId) {
        _self.profileBoxAddItemEventId = eventId;
        JNEXT.invoke(_self.m_id, "self.profilebox.addItem " + JSON.stringify(options));
    };

    _self.self.profilebox.removeItem = function (options, eventId) {
        _self.profileBoxRemoveItemEventId = eventId;
        JNEXT.invoke(_self.m_id, "self.profilebox.removeItem " + JSON.stringify(options));
    };

    _self.self.profilebox.clearItems = function () {
        JNEXT.invoke(_self.m_id, "self.profilebox.clearItems");
    };

    _self.self.profilebox.registerIcon = function (options, eventId) {
        _self.profileBoxRegisterIconEventId = eventId;
        JNEXT.invoke(_self.m_id, "self.profilebox.registerIcon " + JSON.stringify(options));
    };

    _self.self.profilebox.getItemIcon = function (options, eventId) {
        _self.profileBoxGetItemIconEventId = eventId;
        JNEXT.invoke(_self.m_id, "self.profilebox.getItemIcon " + JSON.stringify(options));
    };

    _self.self.profilebox.getItems = function () {
        return JSON.parse(JNEXT.invoke(_self.m_id, "self.profilebox.getItems"));
    };

    _self.self.profilebox.getAccessible = function () {
        return (JNEXT.invoke(_self.m_id, "self.profilebox.getAccessible") === "1");
    };

    _self.users.inviteToDownload = function () {
        JNEXT.invoke(_self.m_id, "users.inviteToDownload");
    };
	
	_self.users.getContactsWithApp = function (eventId) {
        _self.contactsWithAppEventId = eventId;
        return JNEXT.invoke(_self.m_id, "users.getContactsWithApp");
    };

    _self.getId = function () {
        return _self.m_id;
    };

    _self.init = function () {
        if (!JNEXT.require("libbbm")) {
            return false;
        }

        _self.m_id = JNEXT.createObject("libbbm.BBM");

        if (_self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(_self);
    };

    _self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            allowed,
            obj;

        if (strEventDesc === "onaccesschanged") {
            if (arData[1] === "allowed") {
                allowed = true;
            } else {
                allowed = false;
            }
            accesschangedCallback(allowed, arData[1]);
        } else if (strEventDesc === "onupdate") {
            if (updateCallback !== null) {
                obj = arData.slice(2, arData.length).join(" ");
                updateCallback(JSON.parse(obj), arData[1]);
            }
        } else if (strEventDesc === "self.getDisplayPicture") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.getDisplayPictureEventId, JSON.parse(arData[1]));
        } else if (strEventDesc === "self.setDisplayPicture") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.setDisplayPictureEventId, JSON.parse(obj));
        } else if (strEventDesc === "self.profilebox.addItem") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.profileBoxAddItemEventId, JSON.parse(obj));
        } else if (strEventDesc === "self.profilebox.removeItem") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.profileBoxRemoveItemEventId, JSON.parse(obj));
        } else if (strEventDesc === "self.profilebox.registerIcon") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.profileBoxRegisterIconEventId, JSON.parse(obj));
        } else if (strEventDesc === "self.profilebox.getItemIcon") {
            obj = arData.slice(1, arData.length).join(" ");
            _event.trigger(_self.profileBoxGetItemIconEventId);
        } else if (strEventDesc === "users.getContactsWithApp") {
            obj = arData.slice(1, arData.length).join(" ");
            obj = JSON.parse(obj) || [];

            _event.trigger(_self.contactsWithAppEventId, obj);
		}
    };

    _self.m_id = "";
    _self.getDisplayPictureEventId = "";
    _self.setDisplayPictureEventId = "";
    _self.profileBoxAddItemEventId = "";
    _self.profileBoxRemoveItemEventId = "";
    _self.profileBoxRegisterIconEventId = "";
    _self.profileBoxGetItemIconEventId = "";
	_self.contactsWithAppEventId = "";

    _self.getInstance = function () {
        if (!hasInstance) {
            _self.init();
            hasInstance = true;
        }
        return _self;
    };
};

bbm = new JNEXT.BBM();

module.exports = {
    bbm: bbm
};
