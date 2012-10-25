/*
 *  Copyright 2012 Research In Motion Limited.
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

var permissions,
    utils =  require("./utils"),
    config = require("./config"),
    _webview;

permissions =  {

    init : function (webview) {
        _webview = webview;
    },

    onGeolocationPermissionRequest : function (request) {
        var evt = JSON.parse(request);
        _webview.allowGeolocation(evt.origin);
        return '{"setPreventDefault": true}';
    }
};

module.exports = permissions;


