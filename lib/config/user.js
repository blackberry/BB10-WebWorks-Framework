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
    authorEmail: "guocat@gmail.com",
    copyright: "@Rebecca",
    customHeaders: {
        "RIM-webworks": "rim/webworks"
    },
    author: "Me",
    version: "1.0.0.0",
    hasMultiAccess: true,
    license: "This is a license",
    accessList: [{
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system.event"
        }],
        uri: "http://atg05-yyz.rim.net/rebecca/whitelistsystem/event.htm"
    }, {
        allowSubDomain: true,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.ui.dialog"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.ui.menu"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.push"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system.event"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.utils"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.io.file"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.io.dir"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.pim.Address"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity.phone"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.app.event"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.app"
        }],
        uri: "WIDGET_LOCAL"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity.phone"
        }],
        uri: "http://atg05-yyz.rim.net/rebecca/whitelistsystem/phone.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity.phone"
        }],
        uri: "local:///phone.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system.event"
        }],
        uri: "local:///event.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity"
        }],
        uri: "http://atg05-yyz.rim.net/rebecca/whitelistsystem/identity.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity"
        }],
        uri: "local:///identity.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system"
        }],
        uri: "local:///system.htm"
    }, {
        allowSubDomain: false,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system"
        }],
        uri: "http://atg05-yyz.rim.net/rebecca/whitelistsystem/system.htm"
    }, {
        allowSubDomain: true,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.app"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.io.dir"
        }],
        uri: "http://laltshule-xp-3.rim.net"
    }, {
        allowSubDomain: true,
        features: [{
            version: "1.0.0.0",
            required: true,
            id: "blackberry.app"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.app.event"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.identity.phone"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.io.dir"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.io.file"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.push"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.system"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.ui.dialog"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.ui.menu"
        }, {
            version: "1.0.0.0",
            required: true,
            id: "blackberry.utils"
        }],
        uri: "http://rim.net"
    }],
    licenseURL: "",
    authorURL: "http://bbtools_win7_01/yui",
    foregroundSource: "main.htm",
    content: "main.htm",
    description: "this is the description",
    configXML: "config.xml",
    name: "wwTest"
};
