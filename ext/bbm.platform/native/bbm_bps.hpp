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

#ifndef BBM_BPS_HPP_
#define BBM_BPS_HPP_

#include <bbmsp/bbmsp_contactlist.h>
#include <bbmsp/bbmsp_userprofile.h>
#include <bbmsp/bbmsp_user_profile_box.h>
#include <json/value.h>
#include <pthread.h>
#include <map>
#include <string>

class BBM;

namespace webworks {

enum BBMField {
    BBM_DISPLAY_NAME = 0,
    BBM_STATUS,
    BBM_STATUS_MESSAGE,
    BBM_PERSONAL_MESSAGE,
    BBM_PPID,
    BBM_HANDLE,
    BBM_APP_VERSION,
    BBM_SDK_VERSION,
};

enum BBMInternalEvents {
    INTERNAL_EVENT_REGISTER = 0,
    INTERNAL_EVENT_CONTACT_EVENTS,
    INTERNAL_EVENT_GET_DISPLAY_PICTURE,
    INTERNAL_EVENT_STOP,
};

typedef std::map<std::string, int> ProfileFieldMap;

class BBMBPS {
public:
    explicit BBMBPS(BBM *parent = NULL);
    ~BBMBPS();
    void SetActiveChannel(const int channel);
    // Events related functions
    bool InitializeEvents();
    int WaitForEvents();
    static void SendEndEvent();
    static int GetActiveChannel();
    void StartContactEvents();
    void StopContactEvents();

    // Profile related functions
    void Register(const std::string& uuid);
    std::string GetProfile(const std::string strField);
    std::string GetProfile(const BBMField field);
    void GetDisplayPicture();
    void SetStatus(const int status, const std::string& personalMessage);
    void SetPersonalMessage(const std::string& personalMessage);
    void SetDisplayPicture(const std::string& imgPath);

    // Contact list functions
    std::string GetContact(bbmsp_contact_t *contact, const BBMField field);

    // Profile box functions
    void ProfileBoxAddItem(const Json::Value& item);
    void ProfileBoxRemoveItem(const Json::Value& item);
    void ProfileBoxClearItems();
    void ProfileBoxRegisterIcon(const Json::Value& iconData);
    std::string ProfileBoxGetItems();
    std::string ProfileBoxGetAccessible();

    void InviteToDownload();

private:
    BBM *m_pParent;

    // helper funcitons
    void processAccessCode(const int code);
    void processProfileUpdate(bbmsp_event_t *event);
    void processContactUpdate(bbmsp_event_t *event);
    Json::Value processProfileBoxItem(const bbmsp_user_profile_box_item_t *item);
    void processProfileBoxItemAdded(bbmsp_event_t *event);
    void processProfileBoxItemRemoved(bbmsp_event_t *event);
    void processProfileBoxRegisterIcon(bbmsp_event_t *event);

    // private functions
    void createProfileFieldMap();
    std::string getFullProfile();
    std::string getProfileDisplayPicture(bbmsp_profile_t *profile);
    std::string getFullContact(bbmsp_contact_t *contact);
    size_t loadImage(const std::string& imgPath, bbmsp_image_t **img);
    static bool contactEventsEnabled;
    static pthread_mutex_t m_lock;
    static int m_eventChannel;
    static int m_BBMInternalDomain;
    static ProfileFieldMap *m_pProfileFieldMap;
};

} // namespace webworks

#endif // BBM_BPS_HPP_
