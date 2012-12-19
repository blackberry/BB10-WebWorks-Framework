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
describe("Child WebView", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("should invoke a clickable child webview with title bar", function () {
        var a,
            overlay,
            childWindow;

        a = document.createElement('a');
        a.title = "Some link";
        a.innerHTML = a.title;
        a.href = "../manual/childWebView/child.html";

        overlay = document.getElementById('overlay');
        overlay.appendChild(a);

        showOverlay();

        a.addEventListener('click', function (e) {
            e.preventDefault();
            childWindow = window.open(a.href);

        });
        internal.automation.touch(418, 5);

        waits(1500);
        runs(function () {
            internal.automation.touch(110, 318);
            waitsFor(function () {
                return childWindow.fundo === "FUNDO...FUNDO";
            }, 20000);
            runs(function () {
                //close the child webview by click
                internal.automation.touchTopLeft();
                expect(childWindow.fundo).toBe("FUNDO...FUNDO");
            });
        });

        this.after(function () {
            //destroy the link
            overlay.removeChild(a);
            hideOverlay();
        });
    });
});

