/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function showSimpleToast() {
    blackberry.ui.toast.show("This is a very simple toast message, click to dismiss");
}

function showComplexFrenchToast(info) {
    var msg = "This is a complex toast message that should have a button as well as toast handlers",
        buttonText = "Click Me",
        buttonCallback = function () {
            alert("The button in the toast message was clicked");
        },
        dismissCallback = function () {
            alert("The dismiss callback was triggered");
        };

    blackberry.ui.toast.show(msg, { buttonText: buttonText, buttonCallback: buttonCallback, dismissCallback: dismissCallback});
}
