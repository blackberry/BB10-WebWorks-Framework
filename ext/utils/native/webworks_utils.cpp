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

#include "webworks_utils.hpp"

namespace webworks {

std::string Utils::intToStr(const int val)
{
    std::string s;
    std::stringstream out;
    out << val;
    return out.str();
}

int Utils::strToInt(const std::string val) {
    int number;

    if (!(std::istringstream(val) >> number)) {
        return -1;
    }
    return number;
}

} // namespace webworks
