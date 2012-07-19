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
var contextmenu = {},
    ID = "blackberry.ui.contextmenu";

// Define the enabled property that an API developer can access
// to enable/disable the context menu UI
Object.defineProperty(contextmenu, "enabled", {
    get : function () {
        var enabled;
        try {
            enabled = window.webworks.execAsync(ID, "enabled");
        } catch (error) {
            console.log(error);
        }
        return enabled;
    },
    set: function (value) {
        try {
            window.webworks.execAsync(ID, "enabled", {"enabled": value});
        } catch (error) {
            console.error(error);
        }
    }
});

module.exports = contextmenu;
