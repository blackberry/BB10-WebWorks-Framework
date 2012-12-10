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

#include <json/value.h>
#include <json/writer.h>
#include <bb/pim/calendar/CalendarFolder>
#include <bb/pim/calendar/Notification>
#include <bb/pim/calendar/Recurrence>
#include <bb/pim/calendar/Frequency>
#include <bb/pim/calendar/Attendee>
#include <bb/pim/calendar/AttendeeRole>
#include <bb/pim/calendar/EventSearchParameters>
#include <bb/pim/calendar/SortField>
#include <bb/pim/calendar/FolderKey>
#include <bb/pim/calendar/Sensitivity>
#include <bb/pim/calendar/BusyStatus>
#include <bb/pim/calendar/BbmConference>
#include <bb/pim/calendar/BbmConferencePreferredData>
#include <bb/pim/calendar/BbmConferenceUserData>
#include <bb/pim/calendar/ICalendarData>
#include <bb/pim/calendar/MeetingHistory>
#include <bb/pim/account/AccountService>
#include <bb/pim/account/Account>
#include <bb/pim/account/Service>

#include <stdio.h>
#include <string.h>
#include <webworks_utils.hpp>
#include <string>
#include <utility>
#include <map>
#include <algorithm>

#include "pim_calendar_qt.hpp"
#include "timezone_utils.hpp"

namespace webworks {


ServiceProvider& PimCalendarQt::m_provider = ServiceProvider::GetServiceProvider();
AccountFolderManager PimCalendarQt::m_mgr = AccountFolderManager(&m_provider);

PimCalendarQt::PimCalendarQt()
{
    pthread_mutex_init(&m_lock, NULL);
}

PimCalendarQt::~PimCalendarQt()
{
    pthread_mutex_destroy(&m_lock);
}

/****************************************************************
 * Public Functions
 ****************************************************************/

Json::Value PimCalendarQt::Find(const Json::Value& args)
{
    Json::Value returnObj;
    bbpim::EventSearchParameters searchParams;
    bool isParamsValid = getSearchParams(searchParams, args);
    bbpim::Result::Type result;
    int rc = 0;

    if (isParamsValid) {
        QList<bbpim::CalendarEvent> events;

        if ((rc = mutex_lock()) == 0) {
            bbpim::CalendarService* service = getCalendarService();
            events = service->events(searchParams, &result);
            mutex_unlock();
        }

        if (rc != 0 || result == bbpim::Result::BackEndError) {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
            return returnObj;
        }

        Json::Value searchResults;
        Json::Value folders;
        std::map<std::string, bbpim::CalendarFolder> localMap;

        // fetch folders once to make sure the folders are fresh
        m_mgr.GetFolders();

        for (QList<bbpim::CalendarEvent>::const_iterator i = events.constBegin(); i != events.constEnd(); i++) {
            bbpim::CalendarEvent event = *i;
            bbpim::CalendarFolder folder = m_mgr.GetFolder(event.accountId(), event.folderId(), false);
            std::string key = m_mgr.GetFolderKey(event.accountId(), event.folderId());
            localMap.insert(std::pair<std::string, bbpim::CalendarFolder>(key, folder));
            searchResults.append(populateEvent(event, true));
        }

        for (std::map<std::string, bbpim::CalendarFolder>::const_iterator j = localMap.begin(); j != localMap.end(); j++) {
            std::string key = j->first;
            bbpim::CalendarFolder folder = j->second;
            folders[key] = m_mgr.GetFolderJson(folder, false);
        }

        returnObj["_success"] = true;
        returnObj["events"] = searchResults;
        returnObj["folders"] = folders;
    } else {
        returnObj["_success"] = false;
        returnObj["code"] = INVALID_ARGUMENT_ERROR;
    }

    return returnObj;
}

Json::Value PimCalendarQt::Save(const Json::Value& attributeObj)
{
    Json::Value returnObj;

    if (!attributeObj.isMember("id") || attributeObj["id"].isNull() || !attributeObj["id"].isInt()) {
        returnObj = CreateCalendarEvent(attributeObj);
    } else {
        int eventId = attributeObj["id"].asInt();
        int accountId = attributeObj["accountId"].asInt();
        bbpim::Result::Type result;
        bbpim::CalendarService* service = getCalendarService();
        if (mutex_lock() == 0) {
            bbpim::CalendarEvent event = service->event(accountId, eventId, &result);
            mutex_unlock();

            if (result == bbpim::Result::Success && event.isValid()) {
                // Check the hash code
                unsigned int currentHash = getEventHash(event);
                if (attributeObj["hash"].asUInt() != currentHash) {
                    returnObj["_success"] = false;
                    returnObj["code"] = UNKNOWN_ERROR;
                    return returnObj;
                }
                returnObj = EditCalendarEvent(event, attributeObj);
            }
        } else {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
        }
    }

    if (returnObj.empty()) {
        returnObj["_success"] = false;
        returnObj["code"] = UNKNOWN_ERROR; //INVALID_ARGUMENT_ERROR;
    }

    return returnObj;
}

Json::Value PimCalendarQt::GetCalendarFolders()
{
    Json::Value folders;
    QList<bbpim::CalendarFolder> folderList =  m_mgr.GetFolders();

    for (int i = 0; i < folderList.size(); i++) {
        if (folderList[i].isValid()) {
            folders.append(m_mgr.GetFolderJson(folderList[i], false));
        }
    }

    return folders;
}

Json::Value PimCalendarQt::GetDefaultCalendarFolder()
{
    Json::Value folderJson;
    bbpim::CalendarFolder folder = m_mgr.GetDefaultFolder();

    if (folder.isValid()) {
        folderJson = m_mgr.GetFolderJson(folder, true, false);
    }

    return folderJson;
}

Json::Value PimCalendarQt::GetCalendarAccounts()
{
    Json::Value accounts;
    const QList<bbpimAccount::Account>accountList = m_mgr.GetAccounts();
    for (int i = 0; i < accountList.size(); i++) {
        if (accountList[i].isValid()) {
            accounts.append(m_mgr.GetAccountJson(accountList[i], false));
        }
    }

    return accounts;
}

Json::Value PimCalendarQt::GetDefaultCalendarAccount()
{
    Json::Value accountJson;
    bbpimAccount::Account account = m_mgr.GetDefaultAccount(true);

    if (account.isValid()) {
        accountJson = m_mgr.GetAccountJson(m_mgr.GetDefaultAccount(true));
    }

    return accountJson;
}

Json::Value PimCalendarQt::GetEvent(const Json::Value& args)
{
    Json::Value returnObj;
    Json::Value searchResult;

    if (args.isMember("eventId") && args.isMember("accountId")) {
        bbpim::CalendarService* service = getCalendarService();
        bbpim::CalendarEvent event;
        bbpim::Result::Type result;
        bbpim::AccountId accountId = Utils::strToInt(args["accountId"].asString());
        bbpim::EventId eventId = Utils::strToInt(args["eventId"].asString());
        if (accountId == -1 || eventId == -1) {
            returnObj["_success"] = false;
            returnObj["code"] = INVALID_ARGUMENT_ERROR;
        } else {
            if (mutex_lock() == 0) {
                event = service->event(accountId, eventId, &result);
                mutex_unlock();
                if (result == bbpim::Result::Success) {
                    returnObj["_success"] = true;
                    if (event.isValid()) {
                        returnObj["event"] = populateEvent(event, false);
                    } else {
                        returnObj["event"] = Json::Value();
                    }
                }
            }
        }
    } else {
        returnObj["_success"] = false;
        returnObj["code"] = INVALID_ARGUMENT_ERROR;
    }

    if (returnObj.empty()) {
        returnObj["_success"] = false;
        returnObj["code"] = UNKNOWN_ERROR;
    }

    return returnObj;
}

Json::Value PimCalendarQt::CreateCalendarEvent(const Json::Value& args)
{
    Json::Value returnObj;

    bbpim::CalendarEvent ev;
    QList<QDateTime> exceptionDates;

    if (args.isMember("accountId") && args["accountId"].isInt() &&
        args.isMember("folderId") && args["folderId"].isInt()) {
        ev.setAccountId(args["accountId"].asInt());
        ev.setFolderId(args["folderId"].asInt());
    } else {
        // no account id and folder id specified from JS, makes event goes to default calendar
        bbpimAccount::Account defaultCalAccnt = m_mgr.GetDefaultAccount();

        if (defaultCalAccnt.isValid()) {
            ev.setAccountId(defaultCalAccnt.id());
            ev.setFolderId(m_mgr.GetDefaultFolder().id());
        } else {
            // if it reaches here, it means the app does not have permission to get the REAL default folder,
            // which is possible if the app is in work perimeter
            returnObj["_success"] = false;
            returnObj["code"] = PERMISSION_DENIED_ERROR;
            return returnObj;
        }
    }

    exceptionDates = setEventFields(ev, args, returnObj);

    if (!returnObj.empty()) {
        return returnObj;
    }

    bbpim::CalendarService *service = getCalendarService();

    if (args.isMember("parentId") && !args["parentId"].isNull() && args["parentId"].asInt() != 0) {
        QString targetTimezone = QString(args["targetTimezone"].asCString());
        QString sourceTimezone = QString(args["sourceTimezone"].asCString());

        if (mutex_lock() == 0) {
            bbpim::Result::Type result = service->createRecurrenceException(ev, TimezoneUtils::ConvertToTargetFromUtc(getDate(args["originalStartTime"]), true, targetTimezone, sourceTimezone));
            mutex_unlock();
            if (result != bbpim::Result::Success) {
                returnObj["_success"] = false;
                returnObj["code"] = UNKNOWN_ERROR;
                return returnObj;
            }
        } else {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
            return returnObj;
        }
    } else {
        if (mutex_lock() == 0) {
            bbpim::Result::Type result = service->createEvent(ev);
            mutex_unlock();
            if (result != bbpim::Result::Success) {
                returnObj["_success"] = false;
                returnObj["code"] = UNKNOWN_ERROR;
                return returnObj;
            }
       } else {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
            return returnObj;
       }
    }

    for (int i = 0; i < exceptionDates.size(); i++) {
        bbpim::CalendarEvent exceptionEvent;
        exceptionEvent.setStartTime(exceptionDates[i]);
        exceptionEvent.setId(ev.id());
        exceptionEvent.setAccountId(ev.accountId());
        bbpim::Result::Type result;
        if (mutex_lock() == 0) {
            result = service->createRecurrenceExclusion(exceptionEvent);
            mutex_unlock();
            if (result == bbpim::Result::BackEndError) {
                returnObj["_success"] = false;
                returnObj["code"] = UNKNOWN_ERROR;
                return returnObj;
            }
        } else {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
            return returnObj;
        }
    }

    if (ev.isValid()) {
        // Refresh the event by retrieving it from database
        if (mutex_lock() == 0) {
            ev = service->event(ev.accountId(), ev.id());
            mutex_unlock();
        }
        returnObj["event"] = populateEvent(ev, false);
        returnObj["_success"] = true;
        returnObj["id"] = Json::Value(ev.id());
    } else {
        returnObj["_success"] = false;
        returnObj["code"] = UNKNOWN_ERROR;
    }

    return returnObj;
}

Json::Value PimCalendarQt::DeleteCalendarEvent(const Json::Value& calEventObj)
{
    Json::Value returnObj;

    if (calEventObj.isMember("calEventId") && calEventObj["calEventId"].isInt() && calEventObj.isMember("accountId") && calEventObj["accountId"].isInt()) {
        int accountId = calEventObj["accountId"].asInt();
        int eventId = calEventObj["calEventId"].asInt();
        bool removeAll = calEventObj.isMember("removeAll") && calEventObj["removeAll"].asBool();

        if (removeAll) {
            if (mutex_lock() == 0) {
                bbpim::CalendarService* service = getCalendarService();
                bbpim::CalendarEvent event = service->event(accountId, eventId);

                if (event.isValid()) {
                    if (service->deleteEvent(event) == bbpim::Result::Success) {
                        returnObj["_success"] = true;
                    }
                }

                mutex_unlock();
            }
        } else {
            if (calEventObj.isMember("sourceTimezone") && calEventObj["sourceTimezone"].isString() &&
                calEventObj.isMember("dateToRemove") && calEventObj["dateToRemove"].isString()) {
                QString sourceTimezone = QString(calEventObj["sourceTimezone"].asCString());
                QDateTime dateToRemove = TimezoneUtils::ConvertToTargetFromUtc(getDate(calEventObj["dateToRemove"]), false, "", sourceTimezone);

                if (mutex_lock() == 0) {
                    bbpim::CalendarService* service = getCalendarService();
                    bbpim::CalendarEvent occurrence;

                    occurrence.setStartTime(dateToRemove);
                    occurrence.setId(eventId);
                    occurrence.setAccountId(accountId);

                    if (service->createRecurrenceExclusion(occurrence) == bbpim::Result::Success) {
                        returnObj["_success"] = true;
                    }

                    mutex_unlock();
                }
            } else {
                returnObj["_success"] = false;
                returnObj["code"] = INVALID_ARGUMENT_ERROR;
            }
        }
    } else {
        returnObj["_success"] = false;
        returnObj["code"] = INVALID_ARGUMENT_ERROR;
    }

    if (returnObj.empty()) {
        returnObj["_success"] = false;
        returnObj["code"] = UNKNOWN_ERROR;
    }

    return returnObj;
}

Json::Value PimCalendarQt::EditCalendarEvent(bbpim::CalendarEvent& calEvent, const Json::Value& attributeObj)
{
    Json::Value returnObj;
    QList<QDateTime> exceptionDates = setEventFields(calEvent, attributeObj, returnObj);

    if (!returnObj.empty()) {
        return returnObj;
    }

    bbpim::CalendarService* service = getCalendarService();
    if (mutex_lock() == 0) {
        bbpim::Result::Type result = service->updateEvent(calEvent);
        mutex_unlock();
        if (result == bbpim::Result::Success) {
            for (int i = 0; i < exceptionDates.size(); i++) {
                bbpim::CalendarEvent exceptionEvent;
                exceptionEvent.setStartTime(exceptionDates[i]);
                exceptionEvent.setId(calEvent.id());
                exceptionEvent.setAccountId(calEvent.accountId());

                if (mutex_lock() == 0) {
                    result = service->createRecurrenceExclusion(exceptionEvent);
                    mutex_unlock();
                }
            }

            if (calEvent.isValid()) {
                if (mutex_lock() == 0) {
                    calEvent = service->event(calEvent.accountId(), calEvent.id());
                    mutex_unlock();
                }
                returnObj["event"] = populateEvent(calEvent, false);
                returnObj["_success"] = true;
            }
        }
    }
    if (returnObj.empty()) {
        returnObj["_success"] = false;
        returnObj["code"] = UNKNOWN_ERROR;
    }
    return returnObj;
}

/****************************************************************
 * Helper functions for Find
 ****************************************************************/

QVariant PimCalendarQt::getFromMap(QMap<QString, QVariant> map, QStringList keys) {
    QVariant variant;
    QMap<QString, QVariant> currentMap = map;
    QStringList::iterator i;
    for (i = keys.begin(); i != keys.end(); ++i) {
        if (currentMap.contains(*i)) {
            variant = currentMap.value(*i);
        } else {
            variant.clear();
            break;
        }

        if (variant.type() == QVariant::Map) {
            currentMap = variant.toMap();
        }
    }
    return variant;
}

bool PimCalendarQt::getSearchParams(bbpim::EventSearchParameters& searchParams, const Json::Value& args) {
    if (args.isMember("options")) {
        Json::Value options = args["options"];
        Json::Value filter = options.isMember("filter") ? options["filter"] : Json::Value();
        QDateTime now = QDateTime::currentDateTime();

        // filter - substring - optional
        if (filter.isMember("substring") && filter["substring"].isString()) {
            searchParams.setPrefix(QString(filter["substring"].asCString()));
        }

        // detail - optional - defaults to Agenda if not set
        if (options.isMember("detail") && options["detail"].isInt()) {
            searchParams.setDetails((bbpim::DetailLevel::Type) options["detail"].asInt());
        } else {
            searchParams.setDetails(bbpim::DetailLevel::Agenda);
        }

        // filter - start - optional
        if (!filter["start"].empty()) {
            QString sourceTimezone = QString(options["sourceTimezone"].asCString());
            QDateTime date = getDate(filter["start"].asCString());
            searchParams.setStart(TimezoneUtils::ConvertToTargetFromUtc(date, false, "", sourceTimezone));
        } else {
            searchParams.setStart(now.addYears(-100));
        }

        // filter - end - optional
        if (!filter["end"].empty()) {
            QString sourceTimezone = QString(options["sourceTimezone"].asCString());
            QDateTime date = getDate(filter["end"].asCString());
            searchParams.setEnd(TimezoneUtils::ConvertToTargetFromUtc(date, false, "", sourceTimezone));
        } else {
            searchParams.setEnd(now.addYears(100));
        }

        // filter - expand recurring - optional
        if (!filter["expandRecurring"].empty() && filter["expandRecurring"].isBool()) {
            searchParams.setExpand(filter["expandRecurring"].asBool());
        } else {
            searchParams.setExpand(false);
        }

        // filter - folders - optional
        if (!filter["folders"].empty()) {
            for (unsigned int i = 0; i < filter["folders"].size(); i++) {
                Json::Value folder = filter["folders"][i];
                bbpim::FolderKey folderKey;

                folderKey.setFolderId(folder["id"].asInt());
                folderKey.setAccountId(folder["accountId"].asInt());

                searchParams.addFolder(folderKey);
            }
        }

        // sort - optional
        if (!options["sort"].empty() && options["sort"].isArray()) {
            QList<QPair<bbpim::SortField::Type, bool > > sortSpecsList;

            for (unsigned int i = 0; i < options["sort"].size(); i++) {
                Json::Value sort = options["sort"][i];
                QPair<bbpim::SortField::Type, bool> sortSpec;

                sortSpec.first = (bbpim::SortField::Type) sort["fieldName"].asInt();
                sortSpec.second = !sort["desc"].asBool();

                sortSpecsList.append(sortSpec);
            }

            searchParams.setSort(sortSpecsList);
        }

        // limit - optional
        if (!options["limit"].empty()) {
            int limit = 0;

            if (options["limit"].isString()) {
                limit = Utils::strToInt(options["limit"].asString());
            } else {
                limit = options["limit"].asInt();
            }

            if (limit > 0) {
                searchParams.setLimit(limit);
            }
        }

        return true;
    }

    return false;
}

QList<QDateTime> PimCalendarQt::setEventFields(bbpim::CalendarEvent& ev, const Json::Value& args, Json::Value& returnObj)
{
    QList<QDateTime> exceptionDates;
    QString targetTimezone = "";

    // source timezone is ALWAYS set in index.js
    QString sourceTimezone = QString(args["sourceTimezone"].asCString());

    if (args.isMember("targetTimezone") && args["targetTimezone"].isString()) {
        targetTimezone = QString(args["targetTimezone"].asCString());
        ev.setTimezone(targetTimezone);
    }

    QDateTime startTime = getDate(args["start"]);
    QDateTime endTime = getDate(args["end"]);

    ev.setStartTime(TimezoneUtils::ConvertToTargetFromUtc(startTime, false, targetTimezone, sourceTimezone));
    ev.setEndTime(TimezoneUtils::ConvertToTargetFromUtc(endTime, false, targetTimezone, sourceTimezone));

    if (args.isMember("allDay") && args["allDay"].isBool()) {
        ev.setAllDay(args["allDay"].asBool());
    } else {
        ev.setAllDay(false); // default to false if not specified
    }

    if (args.isMember("summary") && args["summary"].isString()) {
        ev.setSubject(args["summary"].asCString());
    }

    if (args.isMember("location") && args["location"].isString()) {
        ev.setLocation(args["location"].asCString());
    }

    if (args.isMember("description") && args["description"].isString()) {
        ev.setBody(args["description"].asCString());
    }

    if (args.isMember("transparency") && args["transparency"].isInt()) {
        ev.setBusyStatus(bbpim::BusyStatus::Type(args.get("transparency", bbpim::BusyStatus::Busy).asInt())); // use busy as default, same as calendar app
    }

    if (args.isMember("sensitivity") && args["sensitivity"].isInt()) {
        ev.setSensitivity(bbpim::Sensitivity::Type(args.get("sensitivity", bbpim::Sensitivity::Normal).asInt()));
    }

    if (args.isMember("reminder") && args["reminder"].isInt()) {
        ev.setReminder(args["reminder"].asInt());
    }

    if (args.isMember("birthday") && args["birthday"].isBool()) {
        ev.setBirthday(args["birthday"].asBool());
    }

    if (args.isMember("url") && args["url"].isString()) {
        ev.setUrl(args["url"].asCString());
    }

    if (args.isMember("recurrence") && !args["recurrence"].isNull()) {
        Json::Value recArgs = args["recurrence"];

        if (!recArgs.isMember("frequency") || recArgs["frequency"].isNull()) {
            returnObj["_success"] = false;
            returnObj["code"] = INVALID_ARGUMENT_ERROR;
        }

        bbpim::Recurrence recurrence;
        recurrence.setFrequency(bbpim::Frequency::Type(recArgs["frequency"].asInt()));
        recurrence.setInterval(recArgs.get("interval", 1).asInt());

        if (recArgs.isMember("expires") && !recArgs["expires"].isNull()) {
            recurrence.setUntil(TimezoneUtils::ConvertToTargetFromUtc(getDate(recArgs["expires"]), false, targetTimezone, sourceTimezone));
        }

        if (recArgs.isMember("numberOfOccurrences") && !recArgs["numberOfOccurrences"].isNull()) {
            recurrence.setNumberOfOccurrences(recArgs["numberOfOccurrences"].asInt());
        }

        recurrence.setDayInWeek(recArgs.get("dayInWeek", 1 << (startTime.date().dayOfWeek()%7)).asInt());
        recurrence.setWeekInMonth(recArgs.get("weekInMonth", (startTime.date().day()/7) + 1).asInt());
        recurrence.setDayInMonth(recArgs.get("dayInMonth", startTime.date().day()).asInt());
        recurrence.setMonthInYear(recArgs.get("monthInYear", startTime.date().month()).asInt());

        // Note: exceptionDates cannot be added manually. They must be added using CalendarService::createRecurrenceExclusion
        for (unsigned int i = 0; i < recArgs["exceptionDates"].size(); i++) {
            exceptionDates.append(TimezoneUtils::ConvertToTargetFromUtc(getDate(recArgs["exceptionDates"][i]), false, targetTimezone, sourceTimezone));
        }

        if (!recurrence.isValid()) {
            returnObj["_success"] = false;
            returnObj["code"] = UNKNOWN_ERROR;
        }

        ev.setRecurrence(recurrence);
    }

    if (args.isMember("attendees")) {
        for (unsigned int i = 0; i < args["attendees"].size(); i++) {
            bbpim::Attendee attendee;
            Json::Value attArgs = args["attendees"][i];

            attendee.setName(QString(attArgs.get("name", "").asCString()));
            attendee.setEmail(QString(attArgs.get("email", "").asCString()));
            attendee.setType((bbpim::Attendee::Type)(attArgs.get("type", bbpim::Attendee::Host).asInt()));
            attendee.setRole((bbpim::AttendeeRole::Type)(attArgs.get("role", bbpim::AttendeeRole::Chair).asInt()));
            attendee.setStatus((bbpim::AttendeeStatus::Type)(attArgs.get("status", bbpim::AttendeeStatus::Unknown).asInt()));
            attendee.setContactId(attArgs.get("contactId", 0).asInt());
            attendee.setOwner(attArgs.get("owner", false).asBool());

            if (!attendee.isValid()) {
                returnObj["_success"] = false;
                returnObj["code"] = UNKNOWN_ERROR;
            }

            ev.addAttendee(attendee);
        }
    }

    if (args.isMember("parentId") && !args["parentId"].isNull() && args["parentId"].asInt() != 0) {
        // This is a recurrence exception event
        if (!args.isMember("originalStartTime") || args["originalStartTime"].isNull()) {
            returnObj["_success"] = false;
            returnObj["code"] = INVALID_ARGUMENT_ERROR;
        }

        ev.setId(args["parentId"].asInt());
        ev.setStartTime(TimezoneUtils::ConvertToTargetFromUtc(startTime, true, targetTimezone, sourceTimezone));
        ev.setEndTime(TimezoneUtils::ConvertToTargetFromUtc(endTime, true, targetTimezone, sourceTimezone));
    }

    return exceptionDates;
}

/****************************************************************
 * Helper functions shared by Find and Save
 ****************************************************************/
bbpim::CalendarService* PimCalendarQt::getCalendarService() {
    return m_provider.GetCalendarService();
}

QDateTime PimCalendarQt::getDate(const Json::Value& arg) {
    QString datetime = QString(arg.asCString());
    datetime.chop(5);
    return QDateTime::fromString(datetime, "yyyy-MM-dd'T'hh:mm:ss");
}

std::string PimCalendarQt::getSafeString(const std::string& s) {
    return replaceAll(replaceAll(replaceAll(replaceAll(s), "\n", "\\\\n"), "\r", ""), "\t", "\\\\t");
}

std::string PimCalendarQt::replaceAll(const std::string& s, const std::string& source, const std::string& target) {
    size_t start = 0;
    std::string temp(s);
    while ((start = temp.find(source, start)) != std::string::npos) {
        temp.replace(start, source.length(), target);
        start += target.length();
    }
    return temp;
}

Json::Value PimCalendarQt::populateEvent(const bbpim::CalendarEvent& event, bool isFind)
{
    Json::Value e;

    e = eventToJson(event);

    if (event.id() > 0 && event.isValid()) {
        e["hash"] = getEventHash(event);
    } else {
        e["hash"] = 0;
    }

    if (!isFind) {
        bbpim::CalendarFolder folder = m_mgr.GetFolder(event.accountId(), event.folderId());
        e["folder"] = m_mgr.GetFolderJson(folder, false);
    }

    return e;
}

unsigned int PimCalendarQt::getEventHash(const bbpim::CalendarEvent& event)
{
    std::string strEvent = eventToString(event);
    return qHash(QString::fromStdString(strEvent));
}

// Convert event to string
std::string PimCalendarQt::eventToString(const bbpim::CalendarEvent& event)
{
    return Json::FastWriter().write(eventToJson(event));
}

// Convert event to JSON
Json::Value PimCalendarQt::eventToJson(const bbpim::CalendarEvent& event)
{
    Json::Value jsonEvent;

    jsonEvent["id"] = Utils::intToStr(event.id());
    jsonEvent["accountId"] = Utils::intToStr(event.accountId());
    jsonEvent["start"] =  QString::number(event.startTime().toUTC().toMSecsSinceEpoch()).toStdString();
    jsonEvent["end"] =  QString::number(event.endTime().toUTC().toMSecsSinceEpoch()).toStdString();
    jsonEvent["description"] = getSafeString(event.body().toStdString());
    jsonEvent["summary"] = getSafeString(event.subject().toStdString());
    jsonEvent["location"] = getSafeString(event.location().toStdString());
    jsonEvent["timezone"] = event.timezone().toStdString();
    jsonEvent["url"] = event.url().toStdString();

    jsonEvent["recurrence"] = Json::Value();
    jsonEvent["recurrence"]["isValid"] = event.recurrence().isValid();
    jsonEvent["recurrence"]["start"] = QString::number(event.recurrence().start().toUTC().toMSecsSinceEpoch()).toStdString();
    jsonEvent["recurrence"]["end"] = QString::number(event.recurrence().end().toUTC().toMSecsSinceEpoch()).toStdString();
    jsonEvent["recurrence"]["until"] = QString::number(event.recurrence().until().toUTC().toMSecsSinceEpoch()).toStdString();
    jsonEvent["recurrence"]["exceptionDates"] = Json::Value();

    for (QList<QDateTime>::const_iterator i = event.recurrence().exceptions().constBegin(); i != event.recurrence().exceptions().constEnd(); ++i) {
        jsonEvent["recurrence"]["exceptionDates"].append(QString::number(i->toUTC().toMSecsSinceEpoch()).toStdString());
    }

    jsonEvent["recurrence"]["frequency"] = event.recurrence().frequency();
    jsonEvent["recurrence"]["interval"] = event.recurrence().interval();
    jsonEvent["recurrence"]["numberOfOccurrences"] = event.recurrence().numberOfOccurrences();
    jsonEvent["recurrence"]["dayInWeek"] = event.recurrence().dayInWeek();
    jsonEvent["recurrence"]["dayInMonth"] = event.recurrence().dayInMonth();
    jsonEvent["recurrence"]["weekInMonth"] = event.recurrence().weekInMonth();
    jsonEvent["recurrence"]["monthInYear"] = event.recurrence().monthInYear();

    jsonEvent["attendees"] = Json::Value();

    for (QList<bbpim::Attendee>::const_iterator i = event.attendees().constBegin(); i != event.attendees().constEnd(); ++i) {
        Json::Value jsonAttendee;
        jsonAttendee["email"] = getSafeString(i->email().toStdString());
        jsonAttendee["name"] = getSafeString(i->name().toStdString());
        jsonAttendee["type"] = i->type();
        jsonAttendee["role"] = i->role();
        jsonAttendee["id"] = Utils::intToStr(i->id());
        jsonAttendee["eventId"] = Utils::intToStr(i->eventId());
        jsonAttendee["contactId"] = Utils::intToStr(i->contactId());
        jsonAttendee["status"] = i->status();
        jsonAttendee["isOwner"] = i->isOwner();

        jsonEvent["attendees"].append(jsonAttendee);
    }

    jsonEvent["sensitivity"] = event.sensitivity();
    jsonEvent["transparency"] = event.busyStatus();
    jsonEvent["folderId"] = Utils::intToStr(event.folderId());
    jsonEvent["parentId"] = Utils::intToStr(event.parentId());
    jsonEvent["sequence"] = event.sequence();
    jsonEvent["reminder"] = event.reminder();
    jsonEvent["birthday"] = event.isBirthday();
    jsonEvent["allDay"] = event.isAllDay();

    jsonEvent["bbmConference"] = Json::Value();
    jsonEvent["bbmConference"]["phoneLabels"] = Json::Value();

    for (QStringList::const_iterator i = event.bbmConference().phoneLabels().constBegin(); i != event.bbmConference().phoneLabels().constEnd(); ++i) {
        jsonEvent["bbmConference"]["phoneLabels"].append(i->toStdString());
    }

    jsonEvent["bbmConference"]["phoneNumbers"] = Json::Value();

    for (QStringList::const_iterator i = event.bbmConference().phoneNumbers().constBegin(); i != event.bbmConference().phoneNumbers().constEnd(); ++i) {
        jsonEvent["bbmConference"]["phoneNumbers"].append(i->toStdString());
    }
    jsonEvent["bbmConference"]["preferredData"] = Json::Value();
    jsonEvent["bbmConference"]["preferredData"]["accessCode"] = event.bbmConference().preferredData().accessCode().toStdString();
    jsonEvent["bbmConference"]["preferredData"]["moderatorCode"] = event.bbmConference().preferredData().moderatorCode().toStdString();
    jsonEvent["bbmConference"]["preferredData"]["isModerator"] = event.bbmConference().preferredData().isModerator();
    jsonEvent["bbmConference"]["preferredData"]["participantCode"] = event.bbmConference().preferredData().participantCode().toStdString();
    jsonEvent["bbmConference"]["preferredData"]["phoneNumber"] = event.bbmConference().preferredData().phoneNumber().toStdString();
    jsonEvent["bbmConference"]["preferredData"]["isValid"] = event.bbmConference().preferredData().isValid();

    jsonEvent["bbmConference"]["userData"] = Json::Value();
    jsonEvent["bbmConference"]["userData"]["accessCode"] = event.bbmConference().userData().accessCode().toStdString();
    jsonEvent["bbmConference"]["userData"]["phoneNumber"] = event.bbmConference().userData().phoneNumber().toStdString();
    jsonEvent["bbmConference"]["userData"]["isValid"] = event.bbmConference().userData().isValid();

    jsonEvent["iCalendarData"] = Json::Value();
    jsonEvent["iCalendarData"]["method"] = event.iCalendarData().method().toStdString();
    jsonEvent["iCalendarData"]["eventSequence"] = event.iCalendarData().eventSequence();

    jsonEvent["iCalendarData"]["history"] = Json::Value();
    jsonEvent["iCalendarData"]["history"]["ownerStatus"] = event.iCalendarData().history().ownerStatus();
    jsonEvent["iCalendarData"]["history"]["statusDate"] = event.iCalendarData().history().statusDate().toString().toStdString();
    jsonEvent["iCalendarData"]["history"]["meetingSequence"] = event.iCalendarData().history().meetingSequence();
    jsonEvent["iCalendarData"]["history"]["updatedDate"] = event.iCalendarData().history().updatedDate().toString().toStdString();
    jsonEvent["iCalendarData"]["history"]["canceledDate"] = event.iCalendarData().history().canceledDate().toString().toStdString();

    jsonEvent["iCalendarData"]["isValid"] = event.iCalendarData().isValid();

    jsonEvent["status"] = event.meetingStatus();
    jsonEvent["guid"] = event.guid().toStdString();
    jsonEvent["isValid"] = event.isValid();

    return jsonEvent;
}

} // namespace webworks

