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

var LIB_FOLDER = "../../lib/",
    toast,
    _overlayWebView,
    _event = require(LIB_FOLDER + 'event'),
    _utils = require(LIB_FOLDER + 'utils');

function show(success, fail, args, env) {
    var message,
        dismissHandler,
        callbackHandler,
        options;

    options = args.options !== 'undefined' ? JSON.parse(decodeURIComponent(args.options)) : {};
    message = args.message !== 'undefined' ? JSON.parse(decodeURIComponent(args.message)) : undefined;

    dismissHandler = function (toastId) {
        _event.trigger("toast.dismiss", toastId);
    };
    callbackHandler = function (toastId) {
        _event.trigger("toast.callback", toastId);
    };

    options.callbackHandler = callbackHandler;
    options.dismissHandler  = dismissHandler;

    // Return the toastId to the client from WP created toast
    success(_overlayWebView.toast.show(message, options));
}

toast = {
    show : show
};

qnx.webplatform.getController().addEventListener('overlayWebView.initialized', function (webview) {
    _overlayWebView = webview;
});

module.exports = toast;
