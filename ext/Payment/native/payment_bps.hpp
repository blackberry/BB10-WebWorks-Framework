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

class Payment;

namespace webworks {

class PaymentBPS {
public:
    explicit PaymentBPS(Payment *parent = NULL);
    ~PaymentBPS();
    int InitializeEvents();
    int WaitForEvents();
    static void SendEndEvent();

    //Method call from JavaScript side
    BPS_API int purchase(purchase_arguments_t *purchase_arguments);
private:
    Payment *m_parent;
    static int m_eventChannel;
    static int m_endEventDomain;

    void onPurchaseSuccess(bps_event_t *event);
    void onFailureCommon(bps_event_t *event);
};

} // namespace webworks

#endif /* PAYMENT_BPS_H_ */
