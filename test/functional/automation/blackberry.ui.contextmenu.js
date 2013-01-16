/*
 * Copyright 2012-2013 Research In Motion Limited.
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


describe("blackberry.ui.contextmenu", function () {
    var waitTimeout = 2000;

    describe("Can invoke the Context Menu", function () {

        afterEach(function () {
            internal.automation.touchCenter();
            waits(waitTimeout);
            runs(function () { });
        });

        it("should display a Context Menu and invoke a share targets screen", function () {
            var callback = jasmine.createSpy().andCallFake(function (request) {
                    return null; //Cancels invocation
                });

            // trigger a Context Menu
            waits(waitTimeout);
            runs(function () {
                internal.automation.longTouch(120, 50);
                internal.automation.longTouch(120, 50);
            });

            blackberry.invoke.interrupter = callback;

            //Check if screen was invoked properly
            waits(waitTimeout);
            runs(function () {
                internal.automation.touchContextMenuShare();
                waits(waitTimeout);
                runs(function () {
                    internal.automation.touchInvocationListItem(1);
                    waits(waitTimeout);
                    runs(function () {
                        expect(callback).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
