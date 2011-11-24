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

module.exports = {
    id : "blackberry",
    objects : {
        app : {
            clientPath : "ext/blackberry_application_Application/client.js",
            serverPath : "ext/blackberry_application_Application/server.js",
            children: {
                "event": {
                    clientPath : "ext/blackberry_application_Event/client.js",
                    serverPath : "ext/blackberry_application_Event/server.js",
                },
                "dummy": {
                    clientPath : "ext/blackberry_application_Dummy/client.js",
                    serverPath : "ext/blackberry_application_Dummy/server.js",
                }
            }
        },
        system : {
            clientPath : "ext/blackberry_system_System/client.js",
            serverPath : "ext/blackberry_system_System/server.js",
        }
    }
};
