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
describe("blackberry.invoke.card", function () {
    it('open the file picker card and then close to make sure it actually opens.', function () {
        var delay = 20000,
            flag = false,
            reason,
            a = document.createElement('a');

        a.title = "Some link";
        a.innerHTML = a.title;
        a.href = "mailto:xyz@asd.com";
        document.body.appendChild(a);

        a.click()

        waits(delay / 8);

        runs(function () {
            flag = false;

            blackberry.event.addEventListener("onChildCardClosed", function (request) {
                reason = request.reason;
                flag = true;
            });

            blackberry.invoke.closeChildCard();
            waitsFor(function () {
                return flag;
            }, delay);
            runs(function () {
                expect(reason).toBe("closed");
                document.removeChild(a);
            });
        });
    });
});

