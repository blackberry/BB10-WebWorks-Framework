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
var _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/payment",
    _ID = require(_apiDir + "/manifest").namespace,
    client,
    mockedWebworks;

describe("payment client", function () {
    beforeEach(function () {
        mockedWebworks = {
            execSync: jasmine.createSpy("execSync"),
            exec: jasmine.createSpy("exec")
        };
        GLOBAL.window = {
            webworks: mockedWebworks
        };
        delete require.cache[require.resolve(_apiDir + "/client")];
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        mockedWebworks = null;
        delete GLOBAL.window;
        client = null;
    });

    describe("developmentMode", function () {
        it("getting developmentMode should return value from execSync", function () {
            mockedWebworks.execSync = jasmine.createSpy("execSync").andReturn(false);
            expect(client.developmentMode).toEqual(false);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "developmentMode");
        });

        it("setting developmentMode should call execSync with user-specified value", function () {
            mockedWebworks.execSync = jasmine.createSpy("execSync");
            client.developmentMode = true;
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "developmentMode", {
                "developmentMode": true
            });
        });
    });

    describe("purchase", function () {
        it("calling purchase() with invalid params will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.purchase(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Purchase argument is not provided or is not a object."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling purchase() with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error"),
                args = {
                    "digitalGoodID": "12345",
                    "digitalGoodSKU": "12345",
                    "digitalGoodName": "Hello World",
                    "metaData": "meta",
                    "purchaseAppName": "test app",
                    "purchaseAppIcon": "icon",
                    "extraParameters": {}
                };

            client.purchase(args, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "purchase", args, true);
        });
    });

    describe("getExistingPurchases", function () {
        it("calling getExistingPurchases() with non-boolean will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getExistingPurchases(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Refresh argument is not provided or is not a boolean value."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling getExistingPurchases() with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getExistingPurchases(true, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getExistingPurchases", {
                "refresh": true
            }, true);
        });
    });

    describe("cancelSubscription", function () {
        it("calling cancelSubscription with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.cancelSubscription(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Transaction ID is not provided or not a string value."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling cancelSubscription with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.cancelSubscription("abc", successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "cancelSubscription", {
                "transactionID": "abc"
            }, true);
        });
    });

    describe("getPrice", function () {
        it("calling getPrice with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling getPrice with missing sku or id will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                foo: "bar"
            }, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling getPrice with sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "sku": "abc"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "id": "",
                "sku": "abc"
            }, true);
        });

        it("calling getPrice with id should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "id": "123"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "sku": "",
                "id": "123"
            }, true);
        });

        it("calling getPrice with both id and sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.getPrice({
                "sku": "abc",
                "id": "123"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "getPrice", {
                "sku": "abc",
                "id": "123"
            }, true);
        });
    });

    describe("checkExisting", function () {
        it("calling checkExisting with non-string will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting(123, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling checkExisting with missing sku or id will invoke error callback", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                foo: "bar"
            }, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith({
                errorID: "-1",
                errorText: "Either ID or SKU needs to be provided as string."
            });
            expect(mockedWebworks.exec).not.toHaveBeenCalled();
        });

        it("calling checkExisting with sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "sku": "abc"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "abc",
                "id": ""
            }, true);
        });

        it("calling checkExisting with id should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "id": "123"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "",
                "id": "123"
            }, true);
        });

        it("calling checkExisting with both id and sku should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkExisting({
                "sku": "abc",
                "id": "123"
            }, successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "abc",
                "id": "123"
            }, true);
        });
    });

    describe("checkAppSubscription", function () {
        it("calling checkExisting with right params should call exec", function () {
            var successCb = jasmine.createSpy("success"),
                errorCb = jasmine.createSpy("error");

            client.checkAppSubscription(successCb, errorCb);

            expect(mockedWebworks.exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), _ID, "checkExisting", {
                "sku": "",
                "id": "-1"
            }, true);
        });
    });
});
