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

var _self;

var chromeId = 1;
var chromeHeight = 0;
var windowGroup = -1;
var id = -1;

_self = {
    create: function (ready) {
        window.qnx.callExtensionMethod("webview.setVisible", chromeId, "true");
        window.qnx.callExtensionMethod("webview.setActive", chromeId, "false");
        window.qnx.callExtensionMethod("webview.setGeometry", chromeId, 0, 0, 1024, chromeHeight);

        windowGroup = window.qnx.callExtensionMethod("webview.applicationWindowGroup", chromeId);

        id = window.qnx.callExtensionMethod("webview.create", windowGroup);

        window.qnx.callExtensionMethod("webview.setVisible", id, true);
        window.qnx.callExtensionMethod("webview.setActive", id, true);
        window.qnx.callExtensionMethod("webview.setZOrder", id, 0);
        window.qnx.callExtensionMethod("webview.setGeometry", id, 0, chromeHeight, 1024, 600);

        if (ready && typeof ready === 'function') {
            ready();
        }
    },

    destroy: function () {
        window.qnx.callExtensionMethod("webview.destroy", id);
    },

    setURL: function (url) {
        window.qnx.callExtensionMethod("webview.loadURL", id, url);
    }
};

module.exports = _self;
