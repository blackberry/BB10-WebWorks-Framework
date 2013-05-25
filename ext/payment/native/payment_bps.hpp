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

#ifndef PAYMENT_BPS_H_
#define PAYMENT_BPS_H_

#include <bps/bps.h>
#include <bps/paymentservice.h>
#include <json/writer.h>
#include <string>

class Payment;

namespace webworks {

class PaymentBPS {
public:
    explicit PaymentBPS();
    ~PaymentBPS();
    int InitializeEvents();
    int WaitForEvents(bool developmentMode);
    //Method call from JavaScript side
    BPS_API int Purchase(const Json::Value obj, const bool developmentMode);
    BPS_API int GetExistingPurchases(const Json::Value obj, const bool developmentMode);
    int GetPrice(const Json::Value obj, const bool developmentMode);
    int CheckExisting(const Json::Value obj, const bool developmentMode);
    int CancelSubscription(const Json::Value obj, const bool developmentMode);
    std::string GetResultStr();
private:
    Payment *m_parent;
    int onPurchaseSuccess(bps_event_t *event);
    int onCancelSubscriptionSuccess(bps_event_t *event);
    int onCheckExistingSuccess(bps_event_t *event);
    int onGetPriceSuccess(bps_event_t *event);
    int onFailureCommon(bps_event_t *event);
    int onGetExistingPurchasesSuccess(bps_event_t *event);
    Json::Value getJsonValue(BPS_API const char* value);
    std::string result_str;
};

} // namespace webworks

#endif /* PAYMENT_BPS_H_ */
