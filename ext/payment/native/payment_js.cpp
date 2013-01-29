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

#include <json/reader.h>
#include <stdio.h>
#include <webworks_utils.hpp>
#include <string>
#include <vector>
#include "payment_js.hpp"
#include "payment_bps.hpp"

Payment::Payment(const std::string& id) : m_id(id)
{
    developmentMode = false;
    payment = new webworks::PaymentBPS();
}

Payment::~Payment()
{
    delete payment;
}

char* onGetObjList()
{
    static char name[] = "Payment";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    if (className != "Payment") {
        return NULL;
    }

    return new Payment(id);
}

std::string Payment::processResponse(const BPS_API int response, std::stringstream* ss)
{
    if (response == -1) {
        *ss << webworks::Utils::intToStr(response);
    } else {
        int returnVal = payment->WaitForEvents(developmentMode); // blocking

        if (returnVal == 1) {
            *ss << payment->GetResultStr();
        }
    }

    return ss->str();
}

std::string Payment::InvokeMethod(const std::string& command)
{
    unsigned int index = command.find_first_of(" ");
    string strCommand = command.substr(0, index);

    // Parse JSON object
    Json::Value obj;

    if (command.length() > index) {
        std::string jsonObject = command.substr(index + 1, command.length());

        bool parse = Json::Reader().parse(jsonObject, obj);
        if (!parse) {
            return "Cannot parse JSON object";
        }
    }

    std::stringstream ss;
    BPS_API int paymentResponse;

    if (strCommand == "purchase") {
        payment->InitializeEvents();
        paymentResponse = payment->Purchase(obj, developmentMode);
        return processResponse(paymentResponse, &ss);
    } else if (strCommand == "getExistingPurchases") {
        payment->InitializeEvents();
        paymentResponse = payment->GetExistingPurchases(obj, developmentMode);
        return processResponse(paymentResponse, &ss);
    } else if (strCommand == "cancelSubscription") {
        payment->InitializeEvents();
        paymentResponse = payment->CancelSubscription(obj, developmentMode);
        return processResponse(paymentResponse, &ss);
    } else if (strCommand == "getPrice") {
        payment->InitializeEvents();
        paymentResponse = payment->GetPrice(obj, developmentMode);
        return processResponse(paymentResponse, &ss);
    } else if (strCommand == "checkExisting") {
        payment->InitializeEvents();
        paymentResponse = payment->CheckExisting(obj, developmentMode);
        return processResponse(paymentResponse, &ss);
    } else if (strCommand == "setDevelopmentMode") {
        if (obj.isMember("developmentMode") && obj["developmentMode"].isBool()) {
            developmentMode = obj["developmentMode"].asBool();
        }

        return "";
    } else if (strCommand == "getDevelopmentMode") {
        if (developmentMode) {
            ss << "true";
        } else {
            ss << "false";
        }
        return ss.str();
    }

    return NULL;
}

bool Payment::CanDelete()
{
    return true;
}
