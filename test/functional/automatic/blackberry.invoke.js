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
describe("blackberry.invoke", function () {
    it('blackberry.invoke should exist', function () {
        expect(blackberry.invoke).toBeDefined();
    });

    it('query should be able to perform a query on the device', function () {
        var delay = 750,
            home = blackberry.io.home,
            iconPath = home.substring(0, home.lastIndexOf("data")) + "public/native/default-icon.png",
            query = {
                "action": "bb.action.WWTEST",
                "uri": "file://",
                "type": "text/plain",
                "target_type": ["APPLICATION"],
                "action_type": "ALL"
            },
            onSuccess = jasmine.createSpy("query onSuccess").andCallFake(function (responseArray) {

                expect(responseArray).toBeDefined();
                responseArray.forEach(function (response) {
                    expect(response.action).toBeDefined();
                    expect(response.action).toEqual("bb.action.WWTEST");
                    expect(response.icon).toBeDefined();
                    expect(response.label).toBeDefined();
                    expect(response["default"]).toBeDefined();
                    expect(response["default"]).toEqual("com.webworks.test.functional.query.target");
                    expect(response.targets).toBeDefined();
                    expect(response.targets[0]).toBeDefined();
                    response.targets.forEach(function (target) {
                        expect(target.key).toBeDefined();
                        expect(target.key).toEqual("com.webworks.test.functional.query.target");
                        expect(target.icon).toBeDefined();
                        expect(target.icon).not.toEqual(iconPath);
                        expect(target.label).toBeDefined();
                        expect(target.label).toEqual("WebWorks Test Application");
                        expect(target.type).toBeDefined();
                        expect(target.type).toEqual("APPLICATION");
                        expect(target.perimeter).toBeDefined();
                        expect(target.perimeter).toEqual("personal");
                    });
                });
            }),
            onError = jasmine.createSpy("query onError");

        runs(function () {
            blackberry.invoke.query(query, onSuccess, onError);
        });

        waitsFor(function () {
            return onSuccess.callCount > 0 || onError.callCount > 0;
        }, "The callback flag should be set to true", delay);

        runs(function () {
            expect(onSuccess).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });
    });
});
