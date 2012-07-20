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
var _application = window.qnx.webplatform.getApplication(),
    _startupMode = _application.invocation.getStartupMode();

module.exports = {
    addEventListener: function (event, trigger) {
        if (event === "invoked") {
            if (_startupMode !== _application.invocation.LAUNCH) {
                trigger(_application.invocation.getRequest());
                _startupMode = _application.invocation.LAUNCH;
            }
            window.qnx.webplatform.getApplication().invocation.addEventListener("Invoked", trigger);
        }
        else {
            console.log("Ignore registration for unknown event: " + event);
        }
    },
    removeEventListener: function (event, trigger) {
        if (event === "invoked") {
            window.qnx.webplatform.getApplication().invocation.removeEventListener("Invoked", trigger);
        }
        else {
            console.log("Ignore un-registration for unknown event: " + event);
        }
    }
};

