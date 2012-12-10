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

//---------------------------------------------------------------------------------
//Not sure if reader.h is available and if I need to add that in the build settings
//---------------------------------------------------------------------------------
#include <json/reader.h>
#include <stdio.h>
//---------------------
#include <string>
#include "payment_js.hpp"
#include "payment_bps.hpp"

bool eventsInitialized = false;

void* PaymentEventThread(void *args)
{
	Payment *parent = static_cast<Payment *>(args);
    webworks::PaymentBPS *payment  = new webworks::PaymentBPS(parent);

    if (payment) {
        if (payment->InitializeEvents() == 0) {
            eventsInitialized = true;

            // Poll for events in ConnectionBPS. This will run until StopEvents() disables events.
            payment->WaitForEvents();

            delete payment;
        }
    }

    eventsInitialized = true;
    return NULL;
}

Payment::Payment(const std::string& id) : m_id(id)
{
    m_thread = 0;
    //StartEvents();	//Whenever Payment is initialized, we start listening for events
}

Payment::~Payment()
{
    if (m_thread) {
        StopEvents();
    }
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

std::string Payment::InvokeMethod(const std::string& command)
{
//    int index = command.find_first_of(" ");
//    string strCommand = command.substr(0, index);

    int index = command.find_first_of(" ");
    string strCommand = command.substr(0, index);

    // Parse JSON object
    Json::Value obj;

    if (command.length() > index) {
        std::string jsonObject = command.substr(index + 1, command.length());
        Json::Reader reader;

        bool parse = reader.parse(jsonObject, obj);
        if (!parse) {
            fprintf(stderr, "%s", "error parsing\n");
            return "Cannot parse JSON object";
        }
    }

    if (strCommand == "purchase") {
    	StartEvents();

    	purchase_arguments_t* args  = NULL;
    	std::stringstream ss;
		try{
			paymentservice_purchase_arguments_create(&args);
			paymentservice_purchase_arguments_set_digital_good_id(args, obj["digitalGoodID"].asCString());
			paymentservice_purchase_arguments_set_digital_good_sku(args, obj["digitalGoodSKU"].asCString());
			paymentservice_purchase_arguments_set_digital_good_name(args, obj["digitalGoodName"].asCString());
			paymentservice_purchase_arguments_set_metadata(args, obj["metaData"].asCString());
			paymentservice_purchase_arguments_set_app_name(args, obj["purchaseAppName"].asCString());
			paymentservice_purchase_arguments_set_app_icon(args, obj["purchaseAppIcon"].asCString());

			Json::Value::Members extraParameters_vector = obj["extraParameters"].getMemberNames();
			std::vector<std::string>::iterator itr;
			for ( itr = extraParameters_vector.begin(); itr < extraParameters_vector.end(); ++itr )
			{
				paymentservice_purchase_arguments_set_extra_parameter(args, itr->c_str(), obj["extraParameters"].operator[](itr->c_str()).asCString());
			}

			webworks::PaymentBPS *payment = new webworks::PaymentBPS();
			ss << payment->purchase(args);
			paymentservice_purchase_arguments_destroy(args);
			delete payment;
			return ss.str();
			//return "";
		}
		catch (int e)
		{
			StopEvents();

			ss.str("");
			//BPS_FAILURE will it get passed properly?
			ss << BPS_FAILURE;
			paymentservice_purchase_arguments_destroy(args);
		}
    }
    else if (strCommand == "stopEvents") {
        StopEvents();
        return "";
    }

//    else if (strCommand == "startEvents") {
//        StartEvents();
//        return "";
//    }

    return NULL;
}

bool Payment::CanDelete()
{
    return true;
}

//// Notifies JavaScript of an event
//void Payment::NotifyEvent(const std::string& event)
//{
//    std::string eventString = m_id + " paymentchange ";
//    eventString.append(event);
//    SendPluginEvent(eventString.c_str(), m_pContext);
//}


// Notifies JavaScript of an event
void Payment::NotifyEvent(const std::string& eventId, const std::string& eventArgs)
{
    std::string eventString = m_id;
    eventString.append(" ");
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(eventArgs);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

void Payment::StartEvents()
{
    if (!m_thread) {
        eventsInitialized = false;
        int error = pthread_create(&m_thread, NULL, PaymentEventThread, static_cast<void *>(this));

        if (error) {
            m_thread = 0;
        }
    }
}

void Payment::StopEvents()
{
    if (m_thread) {
        // Ensure that the secondary thread was initialized
        while (!eventsInitialized);

        webworks::PaymentBPS::SendEndEvent();
        pthread_join(m_thread, NULL);
        m_thread = 0;
    }
}
