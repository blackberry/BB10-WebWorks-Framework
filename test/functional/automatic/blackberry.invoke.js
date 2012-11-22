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
                        expect(target.label).toEqual("English application name");//Localized application name [en]
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

    it('blackberry.invoke.file_transfer_mode constants should be defined', function () {
        expect(blackberry.invoke.FILE_TRANSFER_PRESERVE).toBe('PRESERVE');
        expect(blackberry.invoke.FILE_TRANSFER_COPY_RO).toBe('COPY_RO');
        expect(blackberry.invoke.FILE_TRANSFER_COPY_RW).toBe('COPY_RW');
        expect(blackberry.invoke.FILE_TRANSFER_LINK).toBe('LINK');

    });

    it('open the pictureViewer card and then close to ensure invoke works with sensible file transfer defaults.', function () {
        var delay = 1000,
            flag = false,
            reason,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.invoke({
            action: "bb.action.VIEW",
            uri : "file://" + blackberry.io.home + "/../app/native/img/blackberry10.jpg"
        },
        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay);

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
            });
        });
    });

    it('open the pictureViewer card and then close using the file protocal and file_transfer_mode property.', function () {
        var reason,
            delay = 1000,
            flag = false,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.invoke({
            action: "bb.action.VIEW",
            uri : "file://" + blackberry.io.home + "/../app/native/img/blackberry10.jpg",
            file_transfer_mode : blackberry.invoke.FILE_TRANSFER_COPY_RO
        },
        function (reason) {
        },

        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay);

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
            });
        });
    });


    it('open the pictureViewer card and then close to ensure invoke file_trasfer works.', function () {
        var reason,
            delay = 1000,
            flag = false,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.invoke({
            action: "bb.action.VIEW",
            uri : "local:///img/blackberry10.jpg",
            file_transfer_mode : blackberry.invoke.FILE_TRANSFER_COPY_RO
        },
        function (reason) {
        },
        function (reason) {
        },

        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay);

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
            });
        });
    });

    it('open the pictureViewer card and then close to ensure invoke file_trasfer read write.', function () {
        var reason,
            delay = 1000,
            flag = false,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.invoke({
            action: "bb.action.VIEW",
            uri : "local:///img/blackberry10.jpg",
            file_transfer_mode : blackberry.invoke.FILE_TRANSFER_COPY_RW
        },
        function (reason) {
        },
        function (reason) {
        },

        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay);

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
            });
        });
    });

    it('open an audio card using the COPY_RW file_transfer_attribute', function () {
        var reason,
            delay = 1000,
            flag = false,
            errorSpy = jasmine.createSpy();

        blackberry.invoke.invoke({
            action: "bb.action.VIEW",
            uri : "local:///audio/test.mp3",
            file_transfer_mode : blackberry.invoke.FILE_TRANSFER_COPY_RW
        },
        function (reason) {
        },
        function (reason) {
        }, errorSpy);

        expect(errorSpy).not.toHaveBeenCalled();

        waits(delay);

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
            });
        });
    });

    it('open an audio card with a mal formed invoke and expect it to this.fail', function () {
        blackberry.invoke.invoke({
            action: "bb.action",
            uri : "local:///audio/test.mp3",
            file_transfer_mode : blackberry.invoke.FILE_TRANSFER_PRESERVE
        },
        function (reason) {
        },
        function (error) {
            expect(error).toBe("INVOKE_NO_TARGET_ERROR");
        });


    });

});
