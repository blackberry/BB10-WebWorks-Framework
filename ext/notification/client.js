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
var _ID = require("./manifest.json").namespace,
    _self = {},
    Notification,
    globalId = 0,
    globalItemId = 0;

function generateId() {
    var id = globalId++;
    if (!window.isFinite(id)) {
        globalId = 0;
        id = 0;
    }
    return id.toString();
}

function generateItemId() {
    var itemId = globalItemId++;
    if (!window.isFinite(itemId)) {
        globalItemId = 0;
        itemId = 0;
    }

    return itemId.toString();
}

Notification = function (title, options) {
    var id;

    options = options || {};
    this.title = title;
    this.options = options;

    if (!title || typeof title !== "string") {
        throw new Error("Title is not provided or is not a string.");
    }

    id = generateId();

    // itemId is required parameter that identifies the notification. If tag is provided it serves as an itemId, when tag isn't provided itemId is generated.
    if (!options.tag) {
        options.tag = "itemId" + generateItemId();
    }

    if (options.onerror || options.onshow) {
        options.eventName = "notification.event_" + options.tag;

        if (!window.webworks.event.isOn(options.eventName)) {
            window.webworks.event.once(_ID, options.eventName, function (errorMsg) {
                if (errorMsg) {
                    if (options.onerror) {
                        options.onerror();
                    }
                }
                else if (options.onshow) {
                    options.onshow();
                }
            });
        }
    }

    window.webworks.execAsync(_ID, "notify", {'id': id, 'title': title, 'options': options});

    this.getId = function () {
        return id;
    };
};

Notification.requestPermission = function (callback) {
    // Method Stub - each WebWorks app has 'granted' permission by default
};

Notification.remove = function (tag) {
    if (tag) {
        window.webworks.execAsync(_ID, "remove", {'tag': tag});
    }
};

Notification.prototype.close = function () {
    if (this.options && this.options.tag) {
        window.webworks.execAsync(_ID, "remove", {'tag': this.options.tag});
    }
};

window.webworks.defineReadOnlyField(Notification, "permission", "granted");

// Notification is globally accessible as a window property and complies to W3C Specification http://www.w3.org/TR/notifications/#notificationoptions and fully supported by this implementation,
// it also can be accessed as property of blackberry.notification.
// Two implementations are match and result in unified experience by choosing any of the implementations.
window.Notification = Notification;

module.exports = _self;
