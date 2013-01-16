/**
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
 *
 * @author dkerr, jheifetz
 * $Id: context.js 4273 2012-09-25 17:51:22Z mlapierre@qnx.com $
*/

var _webviews = require("./webviews");

module.exports = {

    /**
     * Method called when the first listener is added for an event
     * @param event {String} The event name
     * @param trigger {Function} The trigger function to call when the event is fired
     */
    addEventListener: function (event, trigger) {
        if (event && trigger) {
            switch (event) {
            case "webviewready":
                _webviews.setReadyTrigger(trigger);
                break;
            case "webviewdestroyed":
                _webviews.setDestroyedTrigger(trigger);
                break;
            }
        }
    },

    /**
     * Method called when the last listener is removed for an event
     * @param event {String} The event name
     */
    removeEventListener: function (event) {
        if (event) {
            switch (event) {
            case "webviewready":
                _webviews.setReadyTrigger(null);
                break;
            case "webviewdestroyed":
                _webviews.setDestroyedTrigger(null);
                break;
            }
        }
    }
};
