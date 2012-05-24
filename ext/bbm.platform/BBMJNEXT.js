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
    _event = require("../../lib/event");

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.BBM = function ()
{
    var self = this;

    self.startEvents = function (trigger) {
        if (accesschangedCallback === null) {
            accesschangedCallback = trigger;
            JNEXT.invoke(self.m_id, "startEvents");
        }
    };

    self.stopEvents = function () {
        accesschangedCallback = null;
        JNEXT.invoke(self.m_id, "stopEvents");
    };

    self.register = function (options) {
        JNEXT.invoke(self.m_id, "register " + JSON.stringify(options));
    };

    self.getProfile = function (field) {
        return JNEXT.invoke(self.m_id, "getProfile " + field);
    };

    self.getDisplayPicture = function (eventId) {
        self.displayPictureEventId = eventId;
        return JNEXT.invoke(self.m_id, "getDisplayPicture");
    };

    self.setStatus = function (statusArgs) {
        JNEXT.invoke(self.m_id, "setStatus " + JSON.stringify(statusArgs));
    };

    self.setPersonalMessage = function (personalMessage) {
        JNEXT.invoke(self.m_id, "setPersonalMessage " + personalMessage);
    };

    self.setDisplayPicture = function (displayPicture) {
        JNEXT.invoke(self.m_id, "setDisplayPicture " + displayPicture);
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("bbm")) {   
            return false;
        }

        self.m_id = JNEXT.createObject("bbm.BBM");
        
        if (self.m_id === "") {   
            return false;
        }

        JNEXT.registerEvents(self);
    };
    
    self.onEvent = function (strData) {
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            allowed;
        
        if (strEventDesc === "onaccesschanged") {
            if (arData[1] === "allowed") {
                allowed = true;
            } else {
                allowed = false;
            }

            accesschangedCallback(allowed, arData[1]);
        } else if (strEventDesc === "self.getDisplayPicture") {
            _event.trigger(self.displayPictureEventId, arData[1]);
        }
    };

    self.m_id = "";
    self.displayPictureEventId = "";

    self.init();
};

bbm = new JNEXT.BBM();

module.exports = {
    bbm: bbm
};
