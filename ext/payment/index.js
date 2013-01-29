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
var paymentJNext,
    _util = require("../../lib/utils");

module.exports = {
    purchase: function (success, fail, args) {
        var purchase_arguments_t = {
                "digitalGoodID" : JSON.parse(decodeURIComponent(args.digitalGoodID)),
                "digitalGoodSKU" : JSON.parse(decodeURIComponent(args.digitalGoodSKU)),
                "digitalGoodName" : JSON.parse(decodeURIComponent(args.digitalGoodName)),
                "metaData" : JSON.parse(decodeURIComponent(args.metaData)),
                "purchaseAppName" : JSON.parse(decodeURIComponent(args.purchaseAppName)),
                "purchaseAppIcon" : JSON.parse(decodeURIComponent(args.purchaseAppIcon)),
                "extraParameters" : JSON.parse(decodeURIComponent(args.extraParameters)),
                "windowGroup" : window.qnx.webplatform.getController().windowGroup
            };

        try {
            success(paymentJNext.getInstance().purchase(purchase_arguments_t));
        } catch (err) {
            fail(-1, err.message);
        }
    },
    cancelSubscription: function (success, fail, args) {
        var cancelSubscription_arguments_t = {
                "transactionID" : JSON.parse(decodeURIComponent(args.transactionID)),
                "windowGroup" : window.qnx.webplatform.getController().windowGroup
            };

        try {
            success(paymentJNext.getInstance().cancelSubscription(cancelSubscription_arguments_t));
        } catch (err) {
            fail(-1, err.message);
        }

    },
    getPrice: function (success, fail, args) {
        var getPrice_arguments_t = {
                "sku" : JSON.parse(decodeURIComponent(args.sku)),
                "windowGroup" : window.qnx.webplatform.getController().windowGroup
            };

        try {
            success(paymentJNext.getInstance().getPrice(getPrice_arguments_t));
        } catch (err) {
            fail(-1, err.message);
        }

    },
    getExistingPurchases: function (success, fail, args) {
        var getExistingPurchases_arguments_t = {
                "refresh" : JSON.parse(decodeURIComponent(args.refresh)),
                "windowGroup" : window.qnx.webplatform.getController().windowGroup
            };

        try {
            success(paymentJNext.getInstance().getExistingPurchases(getExistingPurchases_arguments_t));
        } catch (err) {
            fail(-1, err.message);
        }
    },
    checkExisting: function (success, fail, args) {
        var check_existing_args = {
                "sku" : JSON.parse(decodeURIComponent(args.sku)),
                "windowGroup" : window.qnx.webplatform.getController().windowGroup
            };

        try {
            success(paymentJNext.getInstance().checkExisting(check_existing_args));
        } catch (err) {
            fail(-1, err.message);
        }
    },
    developmentMode: function (success, fail, args) {
        var value, developmentMode_args;
        if (args && args["developmentMode"]) {
            value = JSON.parse(decodeURIComponent(args["developmentMode"]));
            developmentMode_args = {
                "developmentMode" : value
            };
            paymentJNext.getInstance().setDevelopmentMode(developmentMode_args);
            success();
        } else {
            value = paymentJNext.getInstance().getDevelopmentMode();
            success(value === "true");
        }
    }
};

///////////////////////////////////////////////////////////////////
//JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.Payment = function ()
{
    var self = this,
        hasInstance = false;

    self.getErrorObject = function (state, errorID, errorText) {
        var result = {}, successState = {}, errorObject = {};
        successState["state"] = state;
        errorObject["errorID"] = errorID;
        errorObject["errorText"] = errorText;
        result.successState = {};
        result.successState = successState;
        result.errorObject = {};
        result.errorObject = errorObject;
        
        return result;
    };

    self.setDevelopmentMode = function (args) {
        JNEXT.invoke(self.m_id, "setDevelopmentMode " + JSON.stringify(args));
    };

    self.getDevelopmentMode = function () {
        var val = JNEXT.invoke(self.m_id, "getDevelopmentMode");
        return val;
    };

    self.purchase = function (args) {
        var val = JNEXT.invoke(self.m_id, "purchase " + JSON.stringify(args)),
            result;

        if (val === "-1") {
            result = self.getErrorObject("BPS_FAILURE", "-1", "Purchase Failed. Payment Service Error.");
        } else {
            result = JSON.parse(val);
        }

        return result;
    };

    self.getExistingPurchases = function (args) {
        var val = JNEXT.invoke(self.m_id, "getExistingPurchases " + JSON.stringify(args)),
            result;

        if (val === "-1") {
            result = self.getErrorObject("BPS_FAILURE", "-1", "getExistingPurchases Failed. Payment Service Error.");
        } else {
            result = JSON.parse(val);
        }

        return result;
    };

    self.cancelSubscription = function (args) {
        var val = JNEXT.invoke(self.m_id, "cancelSubscription " + JSON.stringify(args)),
            result;

        if (val === "-1") {
            result = self.getErrorObject("BPS_FAILURE", "-1", "cancelSubscription Failed. Payment Service Error.");
        } else {
            result = JSON.parse(val);
        }

        return result;
    };
    
    self.getPrice = function (args) {
        var val = JNEXT.invoke(self.m_id, "getPrice " + JSON.stringify(args)),
            result;
   
        if (val === "-1") {
            result = self.getErrorObject("BPS_FAILURE", "-1", "getPrice Failed. Payment Service Error.");
        } else {
            result = JSON.parse(val);
        }

        return result;
    };
    
    self.checkExisting = function (args) {
        var val = JNEXT.invoke(self.m_id, "checkExisting " + JSON.stringify(args)),
            result;

        if (val === "-1") {
            result = self.getErrorObject("BPS_FAILURE", "-1", "checkExisting Failed. Payment Service Error.");
        } else {
            result = JSON.parse(val);
        }

        return result;
    };    

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libpaymentjnext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libpaymentjnext.Payment");

        if (!self.m_id || self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            hasInstance = true;
            self.init();
        }
        return self;
    };
};

paymentJNext = new JNEXT.Payment();
