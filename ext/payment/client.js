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

var _self = {},
    _ID = require("./manifest.json").namespace;

function getFieldValue(field) {
    var value;
    try {
        value = window.webworks.execSync(_ID, field);
    } catch (e) {
        console.error(e);
    }
    return value;
}

function invokeClientCallback(result, field, successCb, errorCb, errorMsg) {
    if (result) {
        switch (result.successState.state) {
        case "SUCCESS":
            if (successCb && typeof successCb === "function") {
                successCb(result[field]);
            }
            break;
        case "FAILURE":
        case "BPS_FAILURE":
            if (errorCb && typeof errorCb === "function") {
                errorCb(result.errorObject);
            }
            break;
        }
    } else {
        if (errorCb && typeof errorCb === "function") {
            errorCb({
                errorID: "-1",
                errorText: errorMsg
            });
        }
    }
}

function getXHRFailCallback(clientFailCb) {
    return function (code, msg) {
            if (clientFailCb && typeof clientFailCb === "function") {
                clientFailCb({
                    errorID: code,
                    errorText: msg
                });
            }
        };
}

_self.purchase = function (purchase_arguments_t, success, fail) {
    if (!purchase_arguments_t || typeof purchase_arguments_t !== "object") {
        if (fail && typeof fail === "function") {
            fail({
                errorID: "-1",
                errorText: "Purchase argument is not provided or is not a object."
            });
        }

        return;
    }

    var args = {
            "digitalGoodID" : purchase_arguments_t.digitalGoodID || "",
            "digitalGoodSKU" : purchase_arguments_t.digitalGoodSKU || "",
            "digitalGoodName" : purchase_arguments_t.digitalGoodName || "",
            "metaData" : purchase_arguments_t.metaData || "",
            "purchaseAppName" : purchase_arguments_t.purchaseAppName || "",
            "purchaseAppIcon" : purchase_arguments_t.purchaseAppIcon || "",
            "extraParameters" : purchase_arguments_t.extraParameters || {}
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "purchasedItem", success, fail, "Purchase Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "purchase", args, true);
};

_self.getExistingPurchases = function (refresh, success, fail) {
    if (typeof refresh !== "boolean") {
        if (fail && typeof fail === "function") {
            fail({
                errorID: "-1",
                errorText: "Refresh argument is not provided or is not a boolean value."
            });
        }

        return;
    }

    var args = {
            "refresh" : refresh
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "purchases", success, fail, "GetExistingPurchases Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "getExistingPurchases", args, true);
};

_self.cancelSubscription = function (transactionID, success, fail) {
    if (!transactionID || typeof transactionID !== "string") {
        if (fail && typeof fail === "function") {
            fail({
                errorID: "-1",
                errorText: "Transaction ID is not provided or not a string value."
            });
        }

        return;
    }

    var args = {
            "transactionID" : transactionID
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "dataItem", success, fail, "CancelSubscription Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "cancelSubscription", args, true);
};

_self.getPrice = function (sku, success, fail) {
    if (!sku || typeof sku !== "string") {
        if (fail && typeof fail === "function") {
            fail({
                errorID: "-1",
                errorText: "SKU is not provided or not a string value."
            });
        }

        return;
    }

    var args = {
            "sku" : sku
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "dataItem", success, fail, "GetPrice Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "getPrice", args, true);
};

_self.checkExisting = function (sku, success, fail) {
    if (!sku || typeof sku !== "string") {
        if (fail && typeof fail === "function") {
            fail({
                errorID: "-1",
                errorText: "SKU is not provided or not a string value."
            });
        }

        return;
    }

    var args = {
            "sku" : sku
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "dataItem", success, fail, "CheckExisting Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "checkExisting", args, true);
};

_self.checkAppSubscription = function (success, fail) {
    //-1 represents the PAYMENTSERVICE_APP_SUBSCRIPTION constant
    var args = {
            "sku" : "-1"
        },
        onSuccess = function (result) {
            invokeClientCallback(result, "dataItem", success, fail, "CheckExisting Failed. Unexpected Error Occured.");
        },
        onFail = getXHRFailCallback(fail);

    window.webworks.exec(onSuccess, onFail, _ID, "checkExisting", args, true);
};

Object.defineProperty(_self, "developmentMode", {
    get: function () {
        return getFieldValue("developmentMode");
    },
    set: function (value) {
        try {
            window.webworks.execSync(_ID, "developmentMode", {"developmentMode": value});
        } catch (e) {
            console.error(e);
        }
    }
});

module.exports = _self;
