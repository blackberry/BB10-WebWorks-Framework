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

#include "bbm_bps.hpp"
#include "bbm_js.hpp"
#include <bbmsp/bbmsp.h>
#include <bbmsp/bbmsp_events.h>
#include <bbmsp/bbmsp_context.h>
#include <bbmsp/bbmsp_userprofile.h>
#include <bbmsp/bbmsp_util.h>
#include <fcntl.h>
#include <resolv.h>
#include <stdio.h>
#include <sys/stat.h>
#include <sstream>
#include <string>
#include <vector>

#define MUTEX_LOCK() pthread_mutex_lock(&m_lock)
#define MUTEX_UNLOCK() pthread_mutex_unlock(&m_lock)

namespace webworks {

pthread_mutex_t BBMBPS::m_lock = PTHREAD_MUTEX_INITIALIZER;
int BBMBPS::m_eventChannel = -1;
int BBMBPS::m_endEventDomain = -1;

BBMBPS::BBMBPS(BBM *parent) : m_pParent(parent)
{
    bps_initialize();
}

BBMBPS::~BBMBPS()
{
    bps_shutdown();
}

void BBMBPS::SetActiveChannel(int channel)
{
    bps_channel_set_active(channel);
}

int BBMBPS::InitializeEvents()
{
    m_eventChannel = bps_channel_get_active();
    m_endEventDomain = bps_register_domain();

    return (m_endEventDomain >= 0) ? 0 : 1;
}

void BBMBPS::processAccessCode(int code)
{
    std::string accessString = "onaccesschanged ";

    switch (code) {
        case BBMSP_ACCESS_ALLOWED:
            accessString.append("allowed");
            break;
        case BBMSP_ACCESS_UNKNOWN:
            accessString.append("unknown");
            break;
        case BBMSP_ACCESS_UNREGISTERED:
            accessString.append("unregistered");
            break;
        case BBMSP_ACCESS_PENDING:
            accessString.append("pending");
            break;
        case BBMSP_ACCESS_BLOCKED_BY_USER:
            accessString.append("user");
            break;
        case BBMSP_ACCESS_BLOCKED_BY_RIM:
            accessString.append("rim");
            break;
        case BBMSP_ACCESS_NO_DATA_CONNECTION:
            accessString.append("nodata");
            break;
        case BBMSP_ACCESS_UNEXPECTED_ERROR:
            accessString.append("unexpectederror");
            break;
        case BBMSP_ACCESS_INVALID_UUID:
            accessString.append("invaliduuid");
            break;
        case BBMSP_ACCESS_TEMPORARY_ERROR:
            accessString.append("temperror");
            break;
        case BBMSP_ACCESS_MAX_DOWNLOADS_REACHED:
            accessString.append("limitreached");
            break;
        case BBMSP_ACCESS_EXPIRED:
            accessString.append("expired");
            break;
        case BBMSP_ACCESS_CANCELLED_BY_USER:
            accessString.append("cancelled");
            break;
        case BBMSP_ACCESS_MAX_APPS_REACHED:
            accessString.append("maxappsreached");
            break;
        default:
            accessString.append("unknown");
            break;
    }
        m_pParent->NotifyEvent(accessString);
}

int BBMBPS::WaitForEvents()
{
    MUTEX_LOCK();
    int status = bbmsp_request_events(0);

    bps_event_t *event = NULL;
    bbmsp_event_t *bbmEvent;
    bbmsp_profile_t *bbmProfile;

    for (;;) {
        MUTEX_UNLOCK();
        bps_get_event(&event, -1);

        if (event) {
            int event_domain = bps_event_get_domain(event);

            MUTEX_LOCK();
            if (event_domain == bbmsp_get_domain()) {
                int eventCategory = 0;
                int eventType = 0;
                int code = 0;

                bbmsp_event_get(event, &bbmEvent);

                if (bbmsp_event_get_category(event, &eventCategory) == BBMSP_SUCCESS) {
                    switch (eventCategory) {
                        case BBMSP_REGISTRATION:
                        {
                            if (bbmsp_event_get_type(event, &eventType) == BBMSP_SUCCESS) {
                                switch (eventType) {
                                    case BBMSP_SP_EVENT_ACCESS_CHANGED:
                                        processAccessCode(bbmsp_event_access_changed_get_access_error_code(bbmEvent));
                                        break;
                                }
                            }
                            break;
                        }
                        case BBMSP_USER_PROFILE:
                        {
                            if (bbmsp_event_get_type(event, &eventType) == BBMSP_SUCCESS) {
                                switch (eventType) {
                                    case BBMSP_SP_EVENT_PROFILE_CHANGED:
                                    {
                                        int profileUpdateType;
                                        bbmsp_event_profile_changed_get_profile(bbmEvent, &bbmProfile);
                                        profileUpdateType = bbmsp_event_profile_changed_get_presence_update_type(bbmEvent);
                                        if (profileUpdateType == BBMSP_DISPLAY_PICTURE) {
                                            bbmsp_image_t *avatar;
                                            char *imgData = NULL;
                                            char *output = NULL;

                                            bbmsp_image_create_empty(&avatar);
                                            if (bbmsp_profile_get_avatar(bbmProfile, avatar) == BBMSP_SUCCESS) {
                                                imgData = bbmsp_image_get_data(avatar);

                                                int size = bbmsp_image_get_data_size(avatar);
                                                output = new char[size*4];

                                                int bufferSize = b64_ntop((unsigned char *)imgData, bbmsp_image_get_data_size(avatar), output, size*4);
                                                output[bufferSize] = 0;

                                                m_pParent->NotifyEvent(std::string("self.getDisplayPicture ").append(output));

                                                delete output;
                                            }
                                            bbmsp_image_destroy(&avatar);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                MUTEX_UNLOCK();
            } else if (event_domain == m_endEventDomain) {
                break;
            }
        }
    }
    return (status == BPS_SUCCESS) ? 0 : 1;
}

int BBMBPS::GetActiveChannel()
{
    return m_eventChannel;
}

void BBMBPS::SendEndEvent()
{
    bps_event_t *end_event = NULL;
    bps_event_create(&end_event, m_endEventDomain, 0, NULL, NULL);
    bps_channel_push_event(m_eventChannel, end_event);
}

void BBMBPS::Register(const std::string& uuid)
{
    MUTEX_LOCK();
    bbmsp_register(uuid.c_str());
    MUTEX_UNLOCK();
}

std::string BBMBPS::GetProfile(const BBMField field)
{
    MUTEX_LOCK();
    bbmsp_profile_t *profile;
    bbmsp_profile_create(&profile);
    bbmsp_get_user_profile(profile);
    std::string value;
    char buffer[4096];

    switch (field)
    {
        case BBM_DISPLAY_NAME:
        {
            if (bbmsp_profile_get_display_name(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_STATUS:
        {
            int val;
            val = bbmsp_profile_get_status(profile);
            if (val == 0) {
                value = "available";
            }
            else if (val == 1) {
                value = "busy";
            }
            break;
        }
        case BBM_STATUS_MESSAGE:
        {
            if (bbmsp_profile_get_status_message(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_PERSONAL_MESSAGE:
        {
            if (bbmsp_profile_get_personal_message(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_PPID:
        {
            if (bbmsp_profile_get_ppid(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_HANDLE:
        {
            if (bbmsp_profile_get_handle(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_APP_VERSION:
        {
            if (bbmsp_profile_get_app_version(profile, buffer, sizeof(buffer)) == BBMSP_SUCCESS) {
                value = buffer;
            }
            break;
        }
        case BBM_SDK_VERSION:
        {
            int val;
            val = bbmsp_profile_get_platform_version(profile);
            std::stringstream ss;
            ss << val;
            value = ss.str();
        }
    }
    bbmsp_profile_destroy(&profile);
    MUTEX_UNLOCK();
    return value;
}

void BBMBPS::GetDisplayPicture()
{
    MUTEX_LOCK();
    bbmsp_profile_t *profile;
    bbmsp_profile_create(&profile);

    if (bbmsp_get_user_profile(profile) == BBMSP_SUCCESS) {
        // Send request for user profile
        bbmsp_profile_get_avatar(profile, NULL);
    }

    bbmsp_profile_destroy(&profile);
    MUTEX_UNLOCK();
}

void BBMBPS::SetStatus(int status, const std::string& statusMessage)
{
    MUTEX_LOCK();
    bbmsp_set_user_profile_status(status, statusMessage.c_str(), statusMessage.length());
    MUTEX_UNLOCK();
}

void BBMBPS::SetPersonalMessage(const std::string& personalMessage)
{
    MUTEX_LOCK();
    bbmsp_set_user_profile_personal_message(personalMessage.c_str(), personalMessage.length());
    MUTEX_UNLOCK();
}

void BBMBPS::SetDisplayPicture(const std::string& imgPath)
{
    MUTEX_LOCK();
    std::string fileType = imgPath.substr(imgPath.find_last_of(".") + 1, imgPath.length());
    bbmsp_image_type_t type;

    if (fileType == "jpg" || fileType == "jpeg") {
        type = BBMSP_IMAGE_TYPE_JPG;
    } else if (fileType == "png") {
        type = BBMSP_IMAGE_TYPE_PNG;
    } else if (fileType == "gif") {
        type = BBMSP_IMAGE_TYPE_GIF;
    } else if (fileType == "bmp") {
        type = BBMSP_IMAGE_TYPE_BMP;
    } else {
        //unsupported format
        return;
    }

    bbmsp_image_t *avatar;
    int img = 0;
    int size = 0;
    struct stat fstats;
    char *imgData;

    img = open(imgPath.c_str(), O_RDONLY);

    if (img != -1) {
        fstat(img, &fstats);
        size = fstats.st_size;
        imgData = new char[size];
        size = read(img, imgData, size);
        if (size) {
            bbmsp_image_create(&avatar, type, imgData, size);
            bbmsp_set_user_profile_avatar(avatar);
            bbmsp_image_destroy(&avatar);
        }
        delete imgData;
        close(img);
    }
    MUTEX_UNLOCK();
}

int BBMBPS::GetGid()
{
    return static_cast<int>(getgid());
}

} // namespace webworks
