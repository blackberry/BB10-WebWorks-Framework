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

#include <stdio.h>
#include <string>
#include <vector>
#include <sstream>
#include "payment_bps.hpp"
#include "payment_js.hpp"

namespace webworks {

PaymentBPS::PaymentBPS()
{
    bps_initialize();
}

PaymentBPS::~PaymentBPS()
{
    bps_shutdown();
}

int PaymentBPS::InitializeEvents()
{
    paymentservice_request_events(0);
    return 1;
}

std::string PaymentBPS::GetResultStr()
{
    return result_str;
}

BPS_API int PaymentBPS::Purchase(const Json::Value obj, const bool developmentMode)
{
    BPS_API int paymentResponse;
    paymentservice_set_connection_mode(developmentMode);

    purchase_arguments_t* args  = NULL;
    paymentservice_purchase_arguments_create(&args);
    paymentservice_purchase_arguments_set_digital_good_id(args, obj["digitalGoodID"].asCString());
    paymentservice_purchase_arguments_set_digital_good_sku(args, obj["digitalGoodSKU"].asCString());
    paymentservice_purchase_arguments_set_digital_good_name(args, obj["digitalGoodName"].asCString());
    paymentservice_purchase_arguments_set_metadata(args, obj["metaData"].asCString());
    paymentservice_purchase_arguments_set_app_name(args, obj["purchaseAppName"].asCString());
    paymentservice_purchase_arguments_set_group_id(args, obj["windowGroup"].asCString() );
    paymentservice_purchase_arguments_set_app_icon(args, obj["purchaseAppIcon"].asCString());

    Json::Value::Members extraParameters_vector = obj["extraParameters"].getMemberNames();
    std::vector<std::string>::iterator itr;
    for ( itr = extraParameters_vector.begin(); itr < extraParameters_vector.end(); ++itr ) {
        paymentservice_purchase_arguments_set_extra_parameter(args, itr->c_str(), obj["extraParameters"].operator[](itr->c_str()).asCString());
    }

    paymentResponse = paymentservice_purchase_request_with_arguments(args);
    paymentservice_purchase_arguments_destroy(args);
    return paymentResponse;
}

BPS_API int PaymentBPS::GetExistingPurchases(const Json::Value obj, const bool developmentMode)
{
    unsigned request_id = 0;
    paymentservice_set_connection_mode(developmentMode);
    return paymentservice_get_existing_purchases_request(obj["refresh"].asBool(), obj["windowGroup"].asCString(), &request_id);
}

int PaymentBPS::CancelSubscription(const Json::Value obj, const bool developmentMode)
{
    unsigned int requestID;
    paymentservice_set_connection_mode(developmentMode);
    return paymentservice_cancel_subscription(obj["transactionID"].asCString(), obj["windowGroup"].asCString(), &requestID);
}

int PaymentBPS::GetPrice(const Json::Value obj, const bool developmentMode)
{
    unsigned int requestID;
    paymentservice_set_connection_mode(developmentMode);
    return paymentservice_get_price(obj["sku"].asCString(), obj["sku"].asCString(), obj["windowGroup"].asCString(), &requestID);
}

int PaymentBPS::CheckExisting(const Json::Value obj, const bool developmentMode)
{
    unsigned int requestID;
    paymentservice_set_connection_mode(developmentMode);
    return paymentservice_check_existing(obj["sku"].asCString(), obj["sku"].asCString(), obj["windowGroup"].asCString(), &requestID);
}

int PaymentBPS::WaitForEvents(bool developmentMode)
{
    for (;;) {
        bps_event_t *event = NULL;
        bps_get_event(&event, -1);   // Blocking
        if (event) {
            int event_domain = bps_event_get_domain(event);
            if (event_domain == paymentservice_get_domain()) {
                if (SUCCESS_RESPONSE == paymentservice_event_get_response_code(event)) {
                    if (PURCHASE_RESPONSE == bps_event_get_code(event)) {
                        if (!developmentMode) {
                            paymentservice_stop_events(0);
                        }
                        return onPurchaseSuccess(event);
                    }
                    else if (GET_EXISTING_PURCHASES_RESPONSE == bps_event_get_code(event)) {
                        if (!developmentMode) {
                            paymentservice_stop_events(0);
                        }
                        return onGetExistingPurchasesSuccess(event);
                    }
                    else if (GET_PRICE_RESPONSE == bps_event_get_code(event)) {
                        if (!developmentMode) {
                            paymentservice_stop_events(0);
                        }
                        return onGetPriceSuccess(event);
                    }
                    else if (CHECK_EXISTING_RESPONSE == bps_event_get_code(event)) {
                        if (!developmentMode) {
                            paymentservice_stop_events(0);
                        }
                        return onCheckExistingSuccess(event);
                    }
                    else if (CANCEL_SUBSCRIPTION_RESPONSE == bps_event_get_code(event)) {
                        if (!developmentMode) {
                            paymentservice_stop_events(0);
                        }
                        return onCancelSubscriptionSuccess(event);
                    }
                } else {
                    if (!developmentMode) {
                        paymentservice_stop_events(0);
                    }
                    return onFailureCommon(event);
                }
            }
        }
    }

    return 0;
}

Json::Value PaymentBPS::getJsonValue(BPS_API const char* value)
{
    Json::Value null_value = "NOT SPECIFIED";
    if (value) {
        if (value == NULL)
        {
            return null_value;
        } else {
            return Json::Value(value);
        }
    } else {
        return null_value;
    }
}

int PaymentBPS::onPurchaseSuccess(bps_event_t *event)
{
    if (event == NULL) {
        return 0;
    }

    std::stringstream ss;
    Json::Value result;
    Json::Value successState;
    successState["state"] = "SUCCESS";
    Json::Value purchasedItem;
    Json::Value extraParameter;

    purchasedItem["purchaseID"] = Json::Value(getJsonValue(paymentservice_event_get_purchase_id(event, 0)));
    purchasedItem["transactionID"] = Json::Value(getJsonValue(paymentservice_event_get_transaction_id(event, 0)));
    purchasedItem["date"] = Json::Value(getJsonValue(paymentservice_event_get_date(event, 0)));
    purchasedItem["digitalGoodID"] = Json::Value(getJsonValue(paymentservice_event_get_digital_good_id(event, 0)));
    purchasedItem["digitalGoodSKU"] = Json::Value(getJsonValue(paymentservice_event_get_digital_good_sku(event, 0)));
    purchasedItem["licenseKey"] = Json::Value(getJsonValue(paymentservice_event_get_license_key(event, 0)));
    purchasedItem["metaData"] = Json::Value(getJsonValue(paymentservice_event_get_metadata(event, 0)));

    int extra_parameter_count = paymentservice_event_get_extra_parameter_count(event, 0);
    if (extra_parameter_count)
    {
        for (int i = 0; i < extra_parameter_count; i++)
        {
            const char* key = paymentservice_event_get_extra_parameter_key_at_index(event, 0, i);
            std::string key_Str(key);
            const char* value = paymentservice_event_get_extra_parameter_value_at_index(event, 0, i);
            extraParameter[key_Str] = Json::Value(value);
        }
        purchasedItem["extraParameters"] = extraParameter;
    }

    result["successState"] = successState;
    result["purchasedItem"] = purchasedItem;
    ss << Json::FastWriter().write(result);
    result_str = ss.str();

    return 1;
}

int PaymentBPS::onGetExistingPurchasesSuccess(bps_event_t *event)
{
    if (event == NULL) {
        return 0;
    }
    std::stringstream ss;
    Json::Value null_arr_value(Json::arrayValue);
    Json::Value result;
    Json::Value successState;
    successState["state"] = "SUCCESS";
    Json::Value purchases;
    int purchases_count = paymentservice_event_get_number_purchases(event);

    //IF COUNT IS AT LEAST ONE
    if (purchases_count >= 1) {
        for (int current_purchase_index = 0; current_purchase_index < purchases_count; current_purchase_index++)
        {
            Json::Value purchasedItem;
            Json::Value extraParameter;

            purchasedItem["purchaseID"] = Json::Value(getJsonValue(paymentservice_event_get_purchase_id(event, current_purchase_index)));
            purchasedItem["transactionID"] = Json::Value(getJsonValue(paymentservice_event_get_transaction_id(event, current_purchase_index)));
            purchasedItem["date"] = Json::Value(getJsonValue(paymentservice_event_get_date(event, current_purchase_index)));
            purchasedItem["digitalGoodID"] = Json::Value(getJsonValue(paymentservice_event_get_digital_good_id(event, current_purchase_index)));
            purchasedItem["digitalGoodSKU"] = Json::Value(getJsonValue(paymentservice_event_get_digital_good_sku(event, current_purchase_index)));
            purchasedItem["licenseKey"] = Json::Value(getJsonValue(paymentservice_event_get_license_key(event, current_purchase_index)));
            purchasedItem["metaData"] = Json::Value(getJsonValue(paymentservice_event_get_metadata(event, current_purchase_index)));

            int extra_parameter_count = paymentservice_event_get_extra_parameter_count(event, current_purchase_index);
            if (extra_parameter_count)
            {
                for (int i = 0; i < extra_parameter_count; i++)
                {
                    const char* key = paymentservice_event_get_extra_parameter_key_at_index(event, current_purchase_index, i);
                    std::string key_Str(key);
                    const char* value = paymentservice_event_get_extra_parameter_value_at_index(event, current_purchase_index, i);
                    extraParameter[key_Str] =Json::Value(value);
                }
                purchasedItem["extraParameters"]= extraParameter;
            }
            purchases[current_purchase_index] =Json::Value(purchasedItem);
        }
        result["purchases"] = purchases;
    } else {
        result["purchases"] = null_arr_value;
    }

    result["successState"] = successState;
    ss << Json::FastWriter().write(result);
    result_str = ss.str();

    return 1;
}

int PaymentBPS::onCancelSubscriptionSuccess(bps_event_t *event)
{
    if (event == NULL) {
        return 0;
    }

    std::stringstream ss;
    Json::Value result;
    Json::Value dataItem;
    Json::Value successState;
    successState["state"] = "SUCCESS";

    dataItem["subscriptionCancelled"] = Json::Value(paymentservice_event_get_cancelled(event));
    result["dataItem"] = dataItem;
    result["successState"] = successState;

    ss << Json::FastWriter().write(result);
    result_str = ss.str();
    return 1;
}

int PaymentBPS::onGetPriceSuccess(bps_event_t *event)
{
    if (event == NULL) {
        return 0;
    }

    std::stringstream ss;
    Json::Value result;
    Json::Value dataItem;
    Json::Value successState;
    successState["state"] = "SUCCESS";

    dataItem["price"] = Json::Value(getJsonValue(paymentservice_event_get_price(event)));
    const char* initialPeriod = paymentservice_event_get_initial_period(event);
    const char* renewalPrice = paymentservice_event_get_renewal_price(event);
    const char* renewalPeriod = paymentservice_event_get_renewal_period(event);

    if (initialPeriod) {
        if (initialPeriod != NULL)
        {
            dataItem["initialPeriod"] = Json::Value(getJsonValue(initialPeriod));
            dataItem["renewalPrice"] = Json::Value(getJsonValue(renewalPrice));
            dataItem["renewalPeriod"] = Json::Value(getJsonValue(renewalPeriod));
        } else {
            //NOT A SUBSCRIPTION
        }
    } else {
        //NOT A SUBSCRIPTION
    }

    result["dataItem"] = dataItem;
    result["successState"] = successState;

    ss << Json::FastWriter().write(result);
    result_str = ss.str();
    return 1;
}

int PaymentBPS::onCheckExistingSuccess(bps_event_t *event)
{
    if (event == NULL) {
        return 0;
    }
    std::stringstream ss;
    Json::Value result;
    Json::Value dataItem;
    Json::Value successState;
    successState["state"] = "SUCCESS";

    dataItem["subscriptionExists"] = Json::Value(paymentservice_event_get_subscription_exists(event));
    result["dataItem"] = dataItem;
    result["successState"] = successState;

    ss << Json::FastWriter().write(result);
    result_str = ss.str();
    return 1;
}

int PaymentBPS::onFailureCommon(bps_event_t *event)
{
    const int error_id = paymentservice_event_get_error_id(event);
    const char* error_text = paymentservice_event_get_error_text(event);

    std::stringstream ss;
    Json::Value result;
    Json::Value successState;
    successState["state"] = "FAILURE";
    Json::Value errorObject;
    errorObject["errorID"] = Json::Value(error_id);
    errorObject["errorText"] = Json::Value(error_text);
    result["successState"] = successState;
    result["errorObject"] = errorObject;

    ss << Json::FastWriter().write(result);
    result_str = ss.str();
    return 1;
}

} // namespace webworks
