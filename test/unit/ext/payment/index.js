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
var _apiDir = __dirname + "./../../../../ext/payment/",
    _libDir = __dirname + "./../../../../lib/",
    index,
    mockJnextObjId = 123,
    mockWindowGroup = "bar1234",
    bpsSuccess,
    mockSuccessResult = {
        successState: {
            state: "SUCCESS"
        }
    },
    mockErrorResult;

function getMockErrorObj(msg) {
    return {
        successState: {
            state: "BPS_FAILURE"
        },
        errorObject: {
            errorID: "-1",
            errorText: msg
        }
    };
}

function testPurchase(mockSuccess) {
    var successCb = jasmine.createSpy("success"),
        failCb = jasmine.createSpy("fail"),
        args = {};

    args.digitalGoodID = encodeURIComponent(JSON.stringify("12345"));
    args.digitalGoodSKU = encodeURIComponent(JSON.stringify("abcde"));
    args.digitalGoodName = encodeURIComponent(JSON.stringify("foo"));
    args.metaData = encodeURIComponent(JSON.stringify("xyz"));
    args.purchaseAppName = encodeURIComponent(JSON.stringify("app name"));
    args.purchaseAppIcon = encodeURIComponent(JSON.stringify("app icon"));
    args.extraParameters = encodeURIComponent(JSON.stringify(""));

    bpsSuccess = mockSuccess;

    index.purchase(successCb, failCb, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        args[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    args.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "purchase " + JSON.stringify(args));
    expect(successCb).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("Purchase Failed. Payment Service Error."));
}

function testCancelSubscription(mockSuccess) {
    var successCb = jasmine.createSpy("success"),
        failCb = jasmine.createSpy("fail"),
        args = {};

    args.transactionID = encodeURIComponent(JSON.stringify("12345"));

    bpsSuccess = mockSuccess;

    index.cancelSubscription(successCb, failCb, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        args[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    args.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "cancelSubscription " + JSON.stringify(args));
    expect(successCb).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("cancelSubscription Failed. Payment Service Error."));
}

function testGetPrice(mockSuccess) {
    var successCb = jasmine.createSpy("success"),
        failCb = jasmine.createSpy("fail"),
        args = {};

    args.sku = encodeURIComponent(JSON.stringify("12345"));

    bpsSuccess = mockSuccess;

    index.getPrice(successCb, failCb, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        args[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    args.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getPrice " + JSON.stringify(args));
    expect(successCb).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("getPrice Failed. Payment Service Error."));
}

function testGetExistingPurchases(mockSuccess) {
    var successCb = jasmine.createSpy("success"),
        failCb = jasmine.createSpy("fail"),
        args = {};

    args.refresh = encodeURIComponent(JSON.stringify(true));

    bpsSuccess = mockSuccess;

    index.getExistingPurchases(successCb, failCb, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        args[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    args.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getExistingPurchases " + JSON.stringify(args));
    expect(successCb).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("getExistingPurchases Failed. Payment Service Error."));
}

function testCheckExisting(mockSuccess) {
    var successCb = jasmine.createSpy("success"),
        failCb = jasmine.createSpy("fail"),
        args = {};

    args.sku = encodeURIComponent(JSON.stringify("12345s"));

    bpsSuccess = mockSuccess;

    index.checkExisting(successCb, failCb, args);

    Object.getOwnPropertyNames(args).forEach(function (key) {
        args[key] = JSON.parse(decodeURIComponent(args[key]));
    });

    args.windowGroup = mockWindowGroup;

    expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "checkExisting " + JSON.stringify(args));
    expect(successCb).toHaveBeenCalledWith(mockSuccess ? mockSuccessResult : getMockErrorObj("checkExisting Failed. Payment Service Error."));
}

describe("payment index", function () {
    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        GLOBAL.window.qnx = {
            webplatform: {
                getController: function () {
                    return {
                        windowGroup: mockWindowGroup
                    };
                }
            }
        };
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke").andCallFake(function () {
                if (bpsSuccess) {
                    return JSON.stringify(mockSuccessResult);
                } else {
                    return "-1";
                }
            }),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        index = null;
    });

    describe("developmentMode", function () {
        it("calling it with arg invoke jnext setDevelopmentMode", function () {
            var successCb = jasmine.createSpy("success"),
                failCb = jasmine.createSpy("fail"),
                args = {};

            args.developmentMode = encodeURIComponent(JSON.stringify(true));

            index.developmentMode(successCb, failCb, args);

            Object.getOwnPropertyNames(args).forEach(function (key) {
                args[key] = JSON.parse(decodeURIComponent(args[key]));
            });

            expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "setDevelopmentMode " + JSON.stringify(args));
        });

        it("calling it without arg invoke jnext getDevelopmentMode", function () {
            var successCb = jasmine.createSpy("success"),
                failCb = jasmine.createSpy("fail");

            index.developmentMode(successCb, failCb);

            expect(JNEXT.invoke).toHaveBeenCalledWith(mockJnextObjId, "getDevelopmentMode");
        });
    });

    describe("purchase", function () {
        it("invoke jnext purchase, invoke callback with success", function () {
            testPurchase(true);
        });

        it("invoke jnext purchase, invoke callback with error", function () {
            testPurchase(false);
        });
    });

    describe("cancelSubscription", function () {
        it("invoke jnext cancelSubscription, invoke callback with success", function () {
            testCancelSubscription(true);
        });

        it("invoke jnext cancelSubscription, invoke callback with error", function () {
            testCancelSubscription(false);
        });
    });

    describe("getPrice", function () {
        it("invoke jnext getPrice, invoke callback with success", function () {
            testGetPrice(true);
        });

        it("invoke jnext getPrice, invoke callback with error", function () {
            testGetPrice(false);
        });
    });

    describe("getExistingPurchases", function () {
        it("invoke jnext getExistingPurchases, invoke callback with success", function () {
            testGetExistingPurchases(true);
        });

        it("invoke jnext getExistingPurchases, invoke callback with error", function () {
            testGetExistingPurchases(false);
        });
    });

    describe("checkExisting", function () {
        it("invoke jnext checkExisting, invoke callback with success", function () {
            testCheckExisting(true);
        });

        it("invoke jnext checkExisting, invoke callback with error", function () {
            testCheckExisting(false);
        });
    });
});
