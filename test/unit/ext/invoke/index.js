/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/invoke/",
    mockedInvocation,
    index;

describe("invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            invoke: jasmine.createSpy("invocation.invoke"),
            queryTargets: jasmine.createSpy("invocation.queryTargets"),
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        index = null;
    });

    describe("invoke", function () {

        it("can invoke with target", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({target: "abc.xyz"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                target: "abc.xyz"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });

        it("can invoke with uri", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com"}))
                };

            index.invoke(successCB, null, mockedArgs);
            expect(mockedInvocation.invoke).toHaveBeenCalledWith({
                uri: "http://www.rim.com"
            }, jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });

    describe("query", function () {

        it("will whitelist properties of the request object", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "myProperty": "myValue",
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                whitelistRequest = JSON.parse(JSON.stringify(request)),
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            delete whitelistRequest.myProperty;
            whitelistRequest["target_type"] = "ALL";

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(whitelistRequest, jasmine.any(Function));
        });

        it("can query the invocation framework", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "ALL";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for application targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "APPLICATION";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for viewer targets", function  () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "VIEWER";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for all targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "ALL";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not generate a target_type property in the request if it is not an array", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "APPLICATION"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });
    });

    describe("query", function () {

        it("will whitelist properties of the request object", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "myProperty": "myValue",
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                whitelistRequest = JSON.parse(JSON.stringify(request)),
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            delete whitelistRequest.myProperty;
            whitelistRequest["target_type"] = "ALL";

            index.query(success, fail, args);
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(whitelistRequest, jasmine.any(Function));
        });

        it("can query the invocation framework", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "ALL";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for application targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "APPLICATION";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for viewer targets", function  () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "VIEWER";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("can perform a query for all targets", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": ["APPLICATION", "VIEWER"]
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            request["target_type"] = "ALL";
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });

        it("will not generate a target_type property in the request if it is not an array", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy(),
                request = {
                    "action": "bb.action.OPEN",
                    "type": "image/*",
                    "target_type": "APPLICATION"
                },
                args = {
                    "request": encodeURIComponent(JSON.stringify(request))
                };

            index.query(success, fail, args);
            delete request["target_type"];
            expect(mockedInvocation.queryTargets).toHaveBeenCalledWith(request, jasmine.any(Function));
            expect(success).toHaveBeenCalled();
            expect(fail).not.toHaveBeenCalled();
        });
    });
});

