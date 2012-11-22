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

#include "service_provider.hpp"

ServiceProvider& ServiceProvider::GetServiceProvider()
{
    static ServiceProvider sp;
    return sp;
}

ServiceProvider::ServiceProvider() :
    m_pCalendarService(new bb::pim::calendar::CalendarService()),
    m_pAccountService(new bb::pim::account::AccountService())
{
}

ServiceProvider::~ServiceProvider()
{
    if (m_pCalendarService != NULL) {
        delete m_pCalendarService;
    }

    if (m_pAccountService != NULL) {
        delete m_pAccountService;
    }
}

bb::pim::calendar::CalendarService* ServiceProvider::GetCalendarService()
{
    return m_pCalendarService;
}

bb::pim::account::AccountService* ServiceProvider::GetAccountService()
{
    return m_pAccountService;
}
