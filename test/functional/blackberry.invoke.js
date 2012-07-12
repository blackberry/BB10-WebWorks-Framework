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

describe("blackberry.invoke", function () {
    it('blackberry.invoke should exist', function () {
        expect(blackberry.invoke).toBeDefined();
    });

    it('invoke should invoke google.com with unbound invocation', function () {
        var request = {
                uri: "http://www.google.com"
            },
            onSuccess = jasmine.createSpy("client onSuccess"),
            onError = jasmine.createSpy("client onError"),
            confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess, onError);
        } catch (e) {
            console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
    });

    it('invoke should invoke blackberry.com with bound invocation', function () {
        var request = {
                target: "sys.browser",
                uri: "http://www.blackberry.com"
            },
            onSuccess = jasmine.createSpy("client onSuccess"),
            onError = jasmine.createSpy("client onError"),
            confirm;

        try {
            blackberry.invoke.invoke(request, onSuccess);
        } catch (e) {
            console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
    });

    it('query should be able to perform a query on the device', function () {
        var query = {
                "action": "bb.action.VIEW",
                "uri": "file://",
                "type": "application/pdf",
                "target_type": ["VIEWER", "APPLICATION"],
                "action_type": "ALL"
            },
            onSuccessFlag = false,
            onErrorFlag = false,
            onSuccess = function (responseArray) {
                var defaultExists = true;

                onSuccessFlag = true;

                if (confirm) {
                    expect(responseArray).toBeDefined();
                    responseArray.forEach(function (response) {
                        expect(response.action).toBeDefined();
                        expect(response.action).toEqual("bb.action.VIEW");
                        expect(response.icon).toBeDefined();
                        expect(response.label).toBeDefined();
                        expect(response.default).toBeDefined();
                        expect(response.default).toEqual("com.adobe.AdobeReader.viewer");
                        expect(response.targets).toBeDefined();
                        response.targets.forEach(function (target) {
                            expect(target.key).toBeDefined();
                            expect(target.icon).toBeDefined();
                            expect(target.label).toBeDefined();

                            if (target.label === "VIEWER") {
                                expect(target.splash).toBeDefined();
                            }

                            if (target.key === "com.adobe.AdobeReader.viewer") {
                                defaultExists = true;
                                expect(target.type).toEqual("VIEWER");
                            }
                        });
                        expect(defaultExists).toBeTruthy();
                    });
                }
            },
            onError = function (error) {
                onErrorFlag = true;
            },
            message = "This test assumes that the default pdf viewer application is" +
                    " com.adobe.AdobeReader.viewer. You can skip the test by clicking \"No\".",
            confirm;

        runs(function () {
            confirm = window.confirm(message);

            if (confirm) {
                blackberry.invoke.query(query, onSuccess, onError);
            }
        });

        waitsFor(function () {
            return onSuccessFlag || onErrorFlag;
        }, "The callback flag should be set to true", 750);

        runs(function () {
            if (confirm) {
                expect(onSuccessFlag).toBeTruthy();
                expect(onErrorFlag).toBeFalsy();
            }
        });
    });
});
