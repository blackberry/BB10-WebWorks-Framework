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

#ifndef DIALOG_BPS_H_
#define DIALOG_BPS_H_

#include <bps/event.h>
#include <bps/dialog.h>
#include <map>
#include <string>
#include <vector>

namespace webworks {

struct DialogConfig {
    std::string title;
    std::string message;
    std::string windowGroup;
    std::vector<std::string> buttons;
    bool global;
};

class DialogBPS {
public:
    DialogBPS();
    ~DialogBPS();
    int Show(DialogConfig *dialogInfo);
private:
    dialog_instance_t m_dialog;
};

} // namespace webworks

#endif // DIALOG_BPS_H_
