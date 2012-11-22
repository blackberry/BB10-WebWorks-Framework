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

#ifndef PIM_CAL_SERVICE_PROVIDER_HPP_
#define PIM_CAL_SERVICE_PROVIDER_HPP_

#include <bb/pim/account/AccountService>
#include <bb/pim/calendar/CalendarService>

class ServiceProvider {
public:
    static ServiceProvider& GetServiceProvider();
    bb::pim::calendar::CalendarService* GetCalendarService();
    bb::pim::account::AccountService* GetAccountService();

private:
    bb::pim::calendar::CalendarService* m_pCalendarService;
    bb::pim::account::AccountService* m_pAccountService;
    ServiceProvider();
    ~ServiceProvider();
    explicit ServiceProvider(ServiceProvider const&);
    void operator=(ServiceProvider const&);
};

#endif // PIM_CAL_SERVICE_PROVIDER_HPP_
