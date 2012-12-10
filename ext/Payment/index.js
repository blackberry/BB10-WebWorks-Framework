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
_methods = ["purchase"],
_event = require("../../lib/event"),
_exports = {};
//_methods = ["startService", "createChannel", "destroyChannel", "extractPushPayload", "launchApplicationOnPush", "acknowledge"],

module.exports = {
	purchase: function (success, fail, args) {
        var purchase_arguments_t = { "digitalGoodID" : JSON.parse(decodeURIComponent(args.digitalGoodID)),
                "digitalGoodSKU" : JSON.parse(decodeURIComponent(args.digitalGoodSKU)),
                "digitalGoodName" : JSON.parse(decodeURIComponent(args.digitalGoodName)),
                "metaData" : JSON.parse(decodeURIComponent(args.metaData)),
                "purchaseAppName" : JSON.parse(decodeURIComponent(args.purchaseAppName)),
                "purchaseAppIcon" : JSON.parse(decodeURIComponent(args.purchaseAppIcon)),
                "extraParameters" : JSON.parse(decodeURIComponent(args.extraParameters)) };		
		
        try {
        	//Not sure from where the success mehod is coming
            success(paymentJNext.purchase(purchase_arguments_t));
        } catch (e) {
            //fail(-1, e);
        	paymentJNext.stopEvents();
        	throw "Purchase Failed with error: " + e;
        }
    }
//	},	//}, will replace } on the line above
//    monitorMemoryServer: function (success, fail, args, env) {
//        try {
//            success(paymentJNext.monitorMemoryJNext());
//        } catch (e) {
//            fail(-1, e);
//        }
//    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.paymentJNext = function ()
{   
    var self = this,
    hasInstance = false;

    self.stopEvents = function () {
        JNEXT.invoke(self.m_id, "stopEvents");
    };
    
    self.purchase = function (args) {
    	var val = JNEXT.invoke(self.m_id, "purchase " + JSON.stringify(args));
    	//----------------------------------------------------------------------------------------------------------    	
        //if (val === "BPS_FAILURE") {
    	//----------------------------------------------------------------------------------------------------------    	
        if (val === "-1") {
        	//return failure
        	//return getConnectionTypeString(JSON.parse(val));
        	
        	//----------------------------------------------------------------------------------------------------------
        	window.webworks.event.remove(_self._ID, "payment.purchase.callback", webworksPurchaseCallback);
        	stopEvents();
        	//----------------------------------------------------------------------------------------------------------        	
        	throw "Purchase Failed. Payment Service Error.";
        }
    	//----------------------------------------------------------------------------------------------------------        
        //else if (val === "BPS_SUCCESS") {
    	//----------------------------------------------------------------------------------------------------------        
        if (val === "0") {
        	//We can wait for the event
        }
    };

    //self.getId, self.init and self.onEvent are most probably the functions that you need to have
    //-----------------------------------------------------------------------------------------------
    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("paymentJNext")) {
            return false;
        }

        self.m_id = JNEXT.createObject("paymentJNext.Payment");

        if (!self.m_id || self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.onEvent = function (strData) {
//        var arData = strData.split(" "),
//            strEventId = arData[0],
//            arg = arData[1];
        
        var arData = strData.split(" "),
        strEventId = arData[0],
        args = arData[1],
        info = {};        

        // Trigger the event handler of specific Push events
        if (strEventId === "payment.purchase.callback") {
            _event.trigger("payment.purchase.callback", JSON.parse(args));
        }
    };
    
    self.m_id = "";
    
  //-----------------------------------------------------------------------------------------------
    //self.init();
    //Not sure if I should call "self.init();" or "self.getInstance"
  //-----------------------------------------------------------------------------------------------    
    self.getInstance = function () {
        if (!hasInstance) {
            hasInstance = true;
            self.init();
        }
        return self;
    };    
    //-----------------------------------------------------------------------------------------------    
};

paymentJNext = new JNEXT.paymentJNext();