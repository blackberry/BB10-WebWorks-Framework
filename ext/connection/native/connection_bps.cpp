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

#include <sstream>
#include <string>
#include "connection_js.hpp"
#include "connection_bps.hpp"

namespace webworks {

int ConnectionBPS::m_eventChannel = -1;
int ConnectionBPS::m_endEventDomain = -1;

ConnectionBPS::ConnectionBPS(Connection *parent) : m_parent(parent)
{
    bps_initialize();
}

ConnectionBPS::~ConnectionBPS()
{
    bps_shutdown();
}

ConnectionTypes ConnectionBPS::GetConnectionType()
{
    bool available;
    char* interface;
    netstatus_interface_details_t* details;
    netstatus_interface_type_t type;
    int status;
    ConnectionTypes returnType;

    netstatus_get_availability(&available);

    if (available) {
        netstatus_get_default_interface(&interface);
        status = netstatus_get_interface_details(interface, &details);

        if (status == BPS_SUCCESS) {
            type = netstatus_interface_get_type(details);

            switch (type) {
            case NETSTATUS_INTERFACE_TYPE_UNKNOWN:
                returnType = UNKNOWN;
                break;
            case NETSTATUS_INTERFACE_TYPE_WIRED:
                returnType = ETHERNET;
                break;
            case NETSTATUS_INTERFACE_TYPE_WIFI:
                returnType = WIFI;
                break;
            case NETSTATUS_INTERFACE_TYPE_BLUETOOTH_DUN:
                returnType = BLUETOOTH_DUN;
                break;
            case NETSTATUS_INTERFACE_TYPE_USB:
                returnType = USB;
                break;
            case NETSTATUS_INTERFACE_TYPE_VPN:
                returnType = VPN;
                break;
            case NETSTATUS_INTERFACE_TYPE_BB:
                returnType = BB;
                break;
            case NETSTATUS_INTERFACE_TYPE_CELLULAR:
                returnType = CELLULAR;
                break;
            };

            netstatus_free_interface_details(&details);
            bps_free(interface);
        }
    } else {
        returnType = NONE;
    }

    return returnType;
}

int ConnectionBPS::InitializeEvents()
{
    m_eventChannel = bps_channel_get_active();
    m_endEventDomain = bps_register_domain();

    return (m_endEventDomain >= 0) ? 0 : 1;
}

int ConnectionBPS::WaitForEvents()
{
    int status = netstatus_request_events(0);

    if (status == BPS_SUCCESS) {
        ConnectionTypes oldType = GetConnectionType();

        for (;;) {
            bps_event_t *event = NULL;
            bps_get_event(&event, -1);   // Blocking

            if (event) {
                int event_domain = bps_event_get_domain(event);

                if (event_domain == netstatus_get_domain()) {
                    if (bps_event_get_code(event) == NETSTATUS_INFO) {
                        ConnectionTypes newType = GetConnectionType();

                        if (newType != oldType)
                        {
                            // Convert to string
                            std::stringstream ss;
                            ss << oldType;
                            ss << " ";
                            ss << newType;
                            std::string result = ss.str();

                            m_parent->NotifyEvent(result);
                            oldType = newType;
                        }
                    }
                }
                else if (event_domain == m_endEventDomain) {
                    break;
                }
            }
        }
    }

    return (status == BPS_SUCCESS) ? 0 : 1;
}

// This function will be called by the primary thread
void ConnectionBPS::SendEndEvent()
{
    bps_event_t *end_event = NULL;
    bps_event_create(&end_event, m_endEventDomain, 0, NULL, NULL);
    bps_channel_push_event(m_eventChannel, end_event);
}

} // namespace webworks

