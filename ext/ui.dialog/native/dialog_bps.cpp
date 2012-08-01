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

#include <string>
#include <vector>

#include "dialog_bps.hpp"

namespace webworks {

DialogBPS::DialogBPS()
{
    m_dialog = NULL;

    bps_initialize();
}

DialogBPS::~DialogBPS()
{
    bps_shutdown();
}

int DialogBPS::Show(DialogConfig *dialogInfo)
{
    if (dialog_create_alert(&m_dialog) != BPS_SUCCESS) {
        return -1;
    }

    if (dialog_set_alert_message_text(m_dialog, dialogInfo->message.c_str()) != BPS_SUCCESS) {
        dialog_destroy(m_dialog);
        m_dialog = NULL;
        return -1;
    }

    if (dialog_set_title_text(m_dialog, dialogInfo->title.c_str()) != BPS_SUCCESS) {
          dialog_destroy(m_dialog);
          m_dialog = NULL;
          return -1;
    }

    if (!dialogInfo->global)
    {
        if (dialog_set_group_id(m_dialog, dialogInfo->windowGroup.c_str()) != BPS_SUCCESS) {
            dialog_destroy(m_dialog);
            m_dialog = NULL;
            return -1;
        }
    }

    for (std::vector<std::string>::iterator it = dialogInfo->buttons.begin(); it < dialogInfo->buttons.end(); it++) {
        if (dialog_add_button(m_dialog, it->c_str(), true, 0, true) != BPS_SUCCESS) {
              dialog_destroy(m_dialog);
              m_dialog = NULL;
              return -1;
        }
    }

    if (dialog_show(m_dialog) != BPS_SUCCESS) {
        dialog_destroy(m_dialog);
        m_dialog = NULL;
        return -1;
    }

    dialog_request_events(0);
    bps_event_t *event;
    bps_get_event(&event, -1);

    if (event) {
        if (bps_event_get_domain(event) == dialog_get_domain()) {
            int selectedIndex = dialog_event_get_selected_index(event);
            dialog_destroy(m_dialog);
            return selectedIndex;
        }
    }
    dialog_destroy(m_dialog);
    return -1;
}
} // namespace webworks
