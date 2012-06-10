/*
 *  Copyright 2011 Research In Motion Limited.
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

var utils = require('./utils'),
    webview = utils.requireWebview(),
    config = require("./config"),
    onPause = null,
    onResume = null;

function registerApplicationEvents() {
    if (window.chrome && window.chrome.internal) {
        chrome.internal.application = {};
        chrome.internal.application.onWindowState = function (state) {};
        chrome.internal.application.onWindowActive = function () {
            if (onResume) {
                onResume();
            }            
        };
        chrome.internal.application.onWindowInactive = function () {
            if (onPause) {
                onPause();
            }            
        };
    }
}

var _self = {
    start: function (url) {
        webview.create(function () {
            // Workaround for executeJavascript doing nothing for the first time
            webview.executeJavascript("1 + 1");

            url = url || config.content;
            // Start page
            if (url) {
                webview.setURL(url);
            }

            // Define application events callbacks which get invoked by native code
            registerApplicationEvents();
        },
        {
            debugEnabled : config.debugEnabled
        }
        );
    },
    stop: function () {
        webview.destroy();
    },
    setOnPause: function (handler) {
        onPause = handler;
    },
    setOnResume: function (handler) {
        onResume = handler;
    }
};

module.exports = _self;
