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

var dialog,
    _overlay = require('../../overlayWebView'),
    nativeEventId = 'DialogRequested',
    batonHandle,
    resultCallback;

function show(description, callback) {

    /* On Show set the sensitivity to Always so we can't click anywhere else
     * this also fixes a transparency issue onthe simulator
     */
    _overlay.setSensitivity("SensitivityAlways");

    /* Set the callback for sending our result back to the user */
    resultCallback = callback;

    var value = JSON.stringify(description);
    _overlay.executeJavascript("window.showDialog(" + value + ")");
}

function result(value) {

    /*
     * Reset the sensitivty regardless of what happens
     */
    _overlay.setSensitivity("SensitivityTest");

    if (typeof resultCallback === 'function') {
        resultCallback(value);
    } else if (batonHandle) {
        // We were called from the actual Event, so let's resume that
        if (value.ok) {
            batonHandle.pass(
            '{"setPreventDefault": true' +
            (value.hasOwnProperty('username') ? ', "setUsername": "' + encodeURIComponent(value.username) + '"' : '') +
            (value.hasOwnProperty('password') ? ', "setPassword": "' + encodeURIComponent(value.password) + '"' : '') +
            (value.hasOwnProperty('oktext') ? ', "setResult": "' + value.oktext + '"' : '') + '}'
            );
        } else if (value.save) {
            batonHandle.pass('{"setPreventDefault": true, "setResult": "save"}');
        } else if (value.never) {
            batonHandle.pass('{"setPreventDefault": true, "setResult": "never"}');
        } else {
            // This is the default case, as well as "Cancel", here to ensure at all
            // times we resume the client thread just in case our result gets lost
            batonHandle.pass('{"setPreventDefault": true, "setResult": "null"}');
        }

        batonHandle = null;
    }
}

function onDialogRequested(eventArgs, baton) {
    // Delaying the event by using WP baton
    batonHandle = baton;
    batonHandle.take();
    show(eventArgs);
}

dialog  = {
    show : show,
    onDialogRequested : onDialogRequested,
    result : result,
};

module.exports = dialog;
