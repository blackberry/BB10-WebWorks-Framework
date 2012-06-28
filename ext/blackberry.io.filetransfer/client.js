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

var _self = {},
    _ID = "blackberry.io.filetransfer";

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function createEventHandler(_eventId, callback) {
    if (!window.webworks.event.isOn(_eventId)) {
        window.webworks.event.once(_ID, _eventId, callback);
    }
}

_self.upload = function (filePath, server, successCallback, errorCallback, options) {
    var _eventId = guid(),
        args = {
            "_eventId": _eventId,
            "filePath": filePath,
            "server": server,
            "options": options || {}
        };

    createEventHandler(_eventId, function (args) {
        var obj = {};
        
        if (args.result === "success") {
            obj.bytesSent = args.bytesSent;
            obj.responseCode = args.responseCode;
            obj.response = unescape(args.response);

            successCallback(obj);
        } else if (args.result === "error") {
            obj.code = args.code;
            obj.source = args.source;
            obj.target = args.target;
            obj.http_status = args.http_status;

            errorCallback(obj);
        }
    });

    window.webworks.execAsync(_ID, "upload", args);
};

_self.download = function (source, target, successCallback, errorCallback) {
    var _eventId = guid(),  
        args = {
            "_eventId": _eventId,
            "source": source,
            "target": target
        };

    createEventHandler(_eventId, function (args) {
        var obj = {};
        
        if (args.result === "success") {
            obj.isFile = args.isFile;
            obj.isDirectory = args.isDirectory;
            obj.name = args.name;
            obj.fullPath = unescape(args.fullPath);

            successCallback(obj);
        } else if (args.result === "error") {
            obj.code = args.code;
            obj.source = args.source;
            obj.target = args.target;
            obj.http_status = args.http_status;

            errorCallback(obj);
        }
    });

    window.webworks.execAsync(_ID, "download", args);
};

window.webworks.defineReadOnlyField(_self, "FILE_NOT_FOUND_ERR", 1);
window.webworks.defineReadOnlyField(_self, "INVALID_URL_ERR", 2);
window.webworks.defineReadOnlyField(_self, "CONNECTION_ERR", 3);

module.exports = _self;