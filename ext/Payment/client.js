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
    _ID = require("./manifest.json").namespace,
    onCreateSuccess = null,
    onCreateFail = null;


function webworksPurchaseCallback(result) {
	
	paymentJNext.stopEvents();
	
    //if (result === SUCCESS) {
    if (result && result.length > 0) {	//making sure that we get a value from the result
    	// if onCreateSuccess is defined (I assume)
    	var arData = result.split(" ;;;; ");
    	var isSuccessful = arData[0];
    	
        if (onCreateSuccess) {
        	if (isSuccessful === "SUCCESS")
        	{
                onCreateSuccess(JSON.parse(Purchase));    		
        	}
        	else if (isSuccessful === "FAILURE")
        	{
                if (onCreateFail) {
                	onCreateFail(JSON.parse(error));
                }        		
        	}
        }
    }
    else {
    	//something wrong happneed. throw to user
    	
    	//JSON.parse ???
    	throw "Purchase Failed. Unexpected Error Occured.";
    	
//    	// if onCreateFail is defined (I assume)
//    	//It shouldn't hit this line since we expect result
//        if (onCreateFail) {
//            onCreateFail(result);
//        }
    }
    onCreateSuccess = null;
    onCreateFail = null;
}

_self.purchase = function (purchase_arguments_t, successCallback, failCallback) {
    var args = { "digitalGoodID" : purchase_arguments_t.digitalGoodID || "",
    			"digitalGoodSKU" : purchase_arguments_t.digitalGoodSKU || "",
    			"digitalGoodName" : purchase_arguments_t.digitalGoodName || "",
    			"metaData" : purchase_arguments_t.metaData || "",
    			"purchaseAppName" : purchase_arguments_t.purchaseAppName || "",
    			"purchaseAppIcon" : purchase_arguments_t.purchaseAppIcon || "",
    			"extraParameters" : purchase_arguments_t.extraParameters || "" };

//    // Check if create() called more than once
//    if (createInvokeTargetId !== null) {
//        if (args.invokeTargetId !== createInvokeTargetId) {
//            throw "push.PushService.create: cannot call create() multiple times with different invokeTargetId's";
//        }
//    }
//
//    if (createAppId !== null) {
//        if (args.appId !== createAppId) {
//            throw "push.PushService.create: cannot call create() multiple times with different appId's";
//        }
//    }
//
//    createInvokeTargetId = args.invokeTargetId;
//    createAppId = args.appId;

    // Register callbacks for push.create()
    onCreateSuccess = successCallback;
    onCreateFail = failCallback;
    window.webworks.event.once(_ID, "payment.purchase.callback", webworksPurchaseCallback);

    // Send command to framework to start Push service
    return window.webworks.execSync(_ID, "purchase", args);
};


module.exports = _self;
