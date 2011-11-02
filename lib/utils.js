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

var LOCAL_PROTOCOL = "local:///",
    FILE_PROTOCOL = "file://",
    HTTP_PROTOCOL = "http://",
    HTTPS_PROTOCOL = "https://",
    DATA_URI = "data:";

module.exports = {
    mixin: function (mixin, to) {
        for (var prop in mixin) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                to[prop] = mixin[prop];
            }
        }
        return to;
    },
    
    startsWith : function (str, substr) {
        return str.match("^" + substr) === str;
    },

    endsWith : function (str, substr) {
        return str.match(str + "$") === str;
    },

    parseUri : function (str) {
        var i, uri = {},
            key = [ "source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
            matcher = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(str);

        for (i = key.length - 1; i >= 0; i--) {
            uri[key[i]] = matcher[i] || "";
        }

        return uri;
    },

    // uri - output from parseUri
    isAbsoluteUri : function (uri) {
        if (uri && uri.relative !== undefined && uri.source !== undefined) {
            return uri.relative !== uri.source;
        }

        return false;
    },

    isLocalURI : function (uri) {
        return uri.scheme !== null && LOCAL_PROTOCOL.indexOf(uri.scheme) !== -1;
    },

    isFileURI : function (uri) {
        return uri.scheme !== null && FILE_PROTOCOL.indexOf(uri.scheme) !== -1;
    },

    isHttpURI : function (uri) {
        return uri.scheme !== null && HTTP_PROTOCOL.indexOf(uri.scheme) !== -1;
    },

    isHttpsURI : function (uri) {
        return uri.scheme !== null && HTTPS_PROTOCOL.indexOf(uri.scheme) !== -1;
    },
    
    // Checks if the specified uri starts with 'data:'
    isDataURI : function (uri) {
        return uri.scheme !== null && DATA_URI.indexOf(uri.scheme) !== -1;
    }    
};

