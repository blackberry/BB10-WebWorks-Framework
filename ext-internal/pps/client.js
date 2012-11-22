/*
 * Copyright 2010-2011 Research In Motion Limited.
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
var _self = {},
    ID = require("./manifest.json").namespace;

_self.PPSMode = {FULL: 0, DELTA: 1, SERVER: 2, RAW: 4, WAIT: 8};

_self.FileMode = { RDONLY: 0, WRONLY: 1, RDWR: 2, CREATE: 256 };

_self.syncRead = function (path, options) {
    return window.webworks.execSync(ID, "syncRead", { path : path, options : options });
}

_self.syncWrite = function (writeData, path, options) {
    return window.webworks.execSync(
        ID, 
        "syncWrite", 
        { writeData: writeData, path: path, options: options }
    );
}

module.exports = _self;
