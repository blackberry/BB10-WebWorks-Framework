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

#include <json/writer.h>
#include <sstream>
#include <string>
#include "payment_js.hpp"
#include "payment_bps.hpp"
#include <stdio.h>

namespace webworks {

int PaymentBPS::m_eventChannel = -1;
int PaymentBPS::m_endEventDomain = -1;

PaymentBPS::PaymentBPS(Payment *parent) : m_parent(parent)
{
    bps_initialize();
}

PaymentBPS::~PaymentBPS()
{
    bps_shutdown();
}

int PaymentBPS::InitializeEvents()
{
    m_eventChannel = bps_channel_get_active();
    m_endEventDomain = bps_register_domain();

    return (m_endEventDomain >= 0) ? 0 : 1;
}

BPS_API int PaymentBPS::purchase(purchase_arguments_t *purchase_arguments)
{
	return paymentservice_purchase_request_with_arguments(purchase_arguments);
}

int PaymentBPS::WaitForEvents()
{
    // We request PaymentService events so we can be notified when the payment service
    // responds to our requests/queries. (Copied from main.c)
	int status = paymentservice_request_events(0);

    /*
     * Define a request ID to hold the returned value from the purchase request.
     */
    unsigned request_id = 0;

    //not sure what is the best place to put that value
    //paymentservice_set_connection_mode(true);
    //true = local mode

    if (status == BPS_SUCCESS) {
        for (;;) {
            bps_event_t *event = NULL;
            bps_get_event(&event, -1);   // Blocking

            if (event) {
                /*
                 * If it is a Payment Service event, determine the response code
                 * and handle the event accordingly.
                 */

                if (bps_event_get_domain(event) == paymentservice_get_domain()) {
                    if (SUCCESS_RESPONSE == paymentservice_event_get_response_code(event)) {
                        if (PURCHASE_RESPONSE == bps_event_get_code(event)) {
                            onPurchaseSuccess(event);
                        }
                        else if (GET_EXISTING_PURCHASES_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (GET_PRICE_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (CHECK_EXISTING_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                        else if (CANCEL_SUBSCRIPTION_RESPONSE == bps_event_get_code(event)) {
                            //onGetExistingPurchasesSuccess(event);
                        }
                    }
                    //Else if the response comes as fail
                    else {
                        onFailureCommon(event);
                    }
                }
            }
        }
    }

    return (status == BPS_SUCCESS) ? 0 : 1;
}// End Method


void PaymentBPS::onPurchaseSuccess(bps_event_t *event)
{
    if (event == NULL) {
        fprintf(stderr, "Invalid event.\n");
        return;
    }

    std::stringstream ss;
    std::string separator= " ;;;; ";
    Json::Value purchasedItem;
    Json::Value extraParameter;
    Json::FastWriter writer;

    try
    {
    	//unsigned request_id = paymentservice_event_get_request_id(event);	//NOT USED YET
    	//We are using PurchaseID instead of TransactionID
    	purchasedItem["purchase_id"] =  Json::Value(paymentservice_event_get_purchase_id(event, 0));
    	purchasedItem["date"] =  Json::Value(paymentservice_event_get_date(event, 0));
    	purchasedItem["digitalGoodID"] =  Json::Value(paymentservice_event_get_digital_good_id(event, 0));
    	purchasedItem["digitalGoodSKU"] =  Json::Value(paymentservice_event_get_digital_good_sku(event, 0));
    	purchasedItem["licenseKey"] =  Json::Value(paymentservice_event_get_license_key(event, 0));
    	purchasedItem["metaData"] =  Json::Value(paymentservice_event_get_metadata(event, 0));

        int extra_parameter_count = paymentservice_event_get_extra_parameter_count(event, 0);
        //if (extra_parameter_count != NULL)
        if (extra_parameter_count)
        {
			//int i;
			for (int i = 0; i > extra_parameter_count; i++)
			{
				const char* key = paymentservice_event_get_extra_parameter_key_at_index(event, i, 0);
				std::string key_Str(key);
				const char* value = paymentservice_event_get_extra_parameter_value_at_index(event, i, 0);
				//extraParameter[Json::Value(key)] =extraParameter[Json::Value(value)];
				extraParameter[key_Str] =Json::Value(value);
			}
        }
        purchasedItem["extraParameters"]= extraParameter;

        ss << "SUCCESS";
        ss << separator;
        ss << writer.write(purchasedItem);

        std::string result_str = ss.str();
        fprintf(stderr, "stop: Failed to write to pipe\n");
        //fprintf(stderr, result_str);
    }
    catch (int e)
    {
    	ss.str("");
    }

    //std::string result = ss.str();
    //m_parent->NotifyEvent(result);

    m_parent->NotifyEvent("payment.purchase.callback", ss.str());
}

void PaymentBPS::onFailureCommon(bps_event_t *event)
{
    std::stringstream ss;
    std::string separator= " ;;;; ";
    Json::FastWriter writer;

    try
    {
    	int error_id = paymentservice_event_get_error_id(event);
    	const char* error_text = paymentservice_event_get_error_text(event);

        Json::Value error;
        error["errorID"] = Json::Value(error_id);
        error["errorText"] = Json::Value(error_text);

    //    fprintf(stderr, "Purchase Failed.
    //        error_id,
    //        error_text ? error_text : "N/A",

        // Convert to string

        ss << "FAILURE";
        ss << separator;
        ss << writer.write(error);
    }
    catch (int e)
    {
    	ss.str("");
    }

    //std::string result = ss.str();
    //m_parent->NotifyEvent(result);

    m_parent->NotifyEvent("payment.purchase.callback", ss.str());

}

// This function will be called by the primary thread
void PaymentBPS::SendEndEvent()
{
    bps_event_t *end_event = NULL;
    bps_event_create(&end_event, m_endEventDomain, 0, NULL, NULL);
    bps_channel_push_event(m_eventChannel, end_event);
}

} // namespace webworks

