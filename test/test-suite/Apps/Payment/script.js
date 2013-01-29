/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
function purchase() {
    alert("Trying to call purchase");
    blackberry.payment.developmentMode = true;
    try {
        blackberry.payment.purchase({
            "digitalGoodID": "16823864",
            "digitalGoodSKU": "BB10-CG-02",
            "digitalGoodName": "SomeName",
            "metaData": "metadata",
            "purchaseAppName": "WebWorks APP",
            "purchaseAppIcon": null,
            "extraParameters": {
                "key1": "value1",
                "key2": "value2"
            }
        }, onPurchaseSuccess, onPurchaseError);
    } catch (e) {
        alert("Purchase exception");
        console.log(e);
    }
}

function onPurchaseSuccess(purchasedItem) {
    console.log(purchasedItem);
    var transId = purchasedItem.transactionID;
    var sku = purchasedItem.digitalGoodSKU;
    var dgId = purchasedItem.digitalGoodID;
    alert("My Purchase Item: " + transId + "," + sku +  "," + dgId);
}

function onPurchaseError(error) {
      console.log(error);
      alert("Error occurred: " + error.errorText + ", " + error.errorID);
}


function cancelSub() {
    try {
        blackberry.payment.cancelSubscription("18722506", onCancelSubSuccess, onCancelSubError);
    } catch (e) {
        alert("cancelSubscription exception");
        console.log(e);
    }
}

function onCancelSubSuccess(data) {
    console.log(data);
    alert("Cancellation " + (data.subscriptionCancelled ? "" : "NOT ") + "successful");    
}

function onCancelSubError(error) {
    console.log(error);
    alert("Error occurred: " + error.errorText + ", " + error.errorID);
}


function getExistingPurchases() {
    alert("getExistingPurchases called");
    try {
        blackberry.payment.getExistingPurchases(false, onGetExistingPurchasesSuccess, onGetExistingPurchasesError);
    } catch (e) {
        console.log(e);
    }
}

function onGetExistingPurchasesSuccess(purchases) {
    console.log("getExistingPurchases success");
    console.log(purchases);
}

function onGetExistingPurchasesError(error) {
    alert("getExistingPurchases fail");
    alert("Error occurred: " + error.errorText + ", " + error.errorID);
}

function getPrice() {
    try {
        blackberry.payment.getPrice("BB10-CG-01", onGetPriceSuccess, onGetPriceError);
    } catch (e) {
        console.log(e);
    }
}

function onGetPriceSuccess(data) {
    console.log("price success");
    console.log(data);
    var price = data.price;
    if (data.initialPeriod) {
        var initialPeriod = data.initialPeriod;
        var renewalPrice = data.renewalPrice;
        var renewalPeriod = data.renewalPeriod;
        alert("Subscription Info: " + initialPeriod + "," + renewalPrice + "," + renewalPeriod);
    }
}

function onGetPriceError(error) {
    console.log(error);
    alert("Error occurred: " + error.errorText + ", " + error.errorID);
}


function checkAppSubscription() {
    try {
        blackberry.payment.checkAppSubscription(onCheckAppSubscriptionSuccess, onCheckAppSubscriptionError);
    } catch (e) {
        console.log(e);
    }
}

function onCheckAppSubscriptionSuccess(data) {
    console.log(data);
    alert("User is " + (data.subscriptionExists ? "" : "not ") + "subscribed to the app.");
}

function onCheckAppSubscriptionError(error) {
  console.log(error);
  alert("Error occurred: " + error.errorText + ", " + error.errorID);
}

function checkExisting() {
    try {
        blackberry.payment.checkExisting("BB10-CG-01", onCheckExistingSuccess, onCheckExistingError);
    } catch (e) {
        console.log(e);
    }
}

function onCheckExistingSuccess(data) {
    console.log(data);
    alert("User is " + (data.subscriptionExists ? "" : "not ") + "subscribed to the app.");
}

function onCheckExistingError(error) {
    console.log(error);
    alert("Error occurred: " + error.errorText + ", " + error.errorID);
}