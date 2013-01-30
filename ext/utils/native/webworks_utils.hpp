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

#ifndef WW_UTILS_HPP_
#define WW_UTILS_HPP_

#include <string.h>
#include <string>

namespace webworks {

class Utils {
public:
    static std::string intToStr(const int val);
    static int strToInt(const std::string& val);
    static std::string toBase64(const unsigned char *input, const size_t size);
};

} // namespace webworks

#endif // WW_UTILS_HPP_
