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
        return str.indexOf(substr) === 0;
    },

    endsWith : function (str, substr) {
        return str.indexOf(substr, str.length - substr.length) !== -1;
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
    isAbsoluteURI : function (uri) {
        if (uri && uri.source) {	
            return uri.relative !== uri.source;
        }

        return false;
    },

    isLocalURI : function (uri) {
        return uri && uri.scheme && "local:///".indexOf(uri.scheme) !== -1;
    },

    isFileURI : function (uri) {
        return uri && uri.scheme && "file://".indexOf(uri.scheme) !== -1;
    },

    isHttpURI : function (uri) {
        return uri && uri.scheme && "http://".indexOf(uri.scheme) !== -1;
    },

    isHttpsURI : function (uri) {
        return uri && uri.scheme && "https://".indexOf(uri.scheme) !== -1;
    },

    // Checks if the specified uri starts with 'data:'
    isDataURI : function (uri) {
        return uri && uri.scheme && "data:".indexOf(uri.scheme) !== -1;
    }
};
