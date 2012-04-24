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
function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var config = requireLocal("lib/config");

module.exports = {
    author: function (success, fail, args, env) {
        success(config.author);
    },

    authorEmail: function (success, fail, args, env) {
        success(config.authorEmail);
    },

    authorURL: function (success, fail, args, env) {
        success(config.authorURL);
    },

    copyright: function (success, fail, args, env) {
        success(config.copyright);
    },

    description: function (success, fail, args, env) {
        success(config.description);
    },

    id: function (success, fail, args, env) {
        success(config.id);
    },

    license: function (success, fail, args, env) {
        success(config.license);
    },

    licenseURL: function (success, fail, args, env) {
        success(config.licenseURL);
    },

    name: function (success, fail, args, env) {
        success(config.name);
    },

    version: function (success, fail, args, env) {
        success(config.version);
    }
};
