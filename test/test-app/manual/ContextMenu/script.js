/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

var callback = function(id) {
    alert("Callback triggered with id: " + id);
};

function overridePlatform() {
    var myItem = {actionId: blackberry.ui.contextmenu.ACTION_COPY, label: 'CustomCopy!', icon:'local:///manual/ContextMenu/icon.png'};
    blackberry.ui.contextmenu.overrideItem(myItem, function() {
        alert("Wow you succesfully overrode the platform menu item Copy");
    });
}

function overrideMenuServiceShare() {
    var myItem = {actionId: 'MenuService-1', label: 'CustomShare', icon:'local:///manual/ContextMenu/icon.png'};
    blackberry.ui.contextmenu.overrideItem(myItem, function() {
        alert("Wow you succesfully overrode the menu service action");
    });
}

function clearCopyOverride() {
    blackberry.ui.contextmenu.clearOverride(blackberry.ui.contextmenu.ACTION_COPY);
}

function clearMSOverride() {
    blackberry.ui.contextmenu.clearOverride('MenuService-1');
}

function addMenuItemContextAll() {
    var myItem = {actionId: '1', label: 'ALL', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback );
}

function removeMenuItemContextAll() {
    var myItem = {actionId: '1', label: 'ALL', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}

function addMenuItemContextLink() {
    var myItem = {actionId: '2', label: 'LINK', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_LINK];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextLink() {
    var myItem = {actionId: '2', label: 'LINK', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_LINK];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}

function addMenuItemContextInput() {
    var myItem = {actionId: '3', label: 'INPUT', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_INPUT];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextInput() {
    var myItem = {actionId: '3', label: 'INPUT', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_INPUT];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}

function addMenuItemContextIText() {
    var myItem = {actionId: '4', label: 'TEXT', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_TEXT];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextIText() {
    var myItem = {actionId: '4', label: 'TEXT', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_TEXT];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}
function addMenuItemContextImage() {
    var myItem = {actionId: '5', label: 'IMAGE', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextImage() {
    var myItem = {actionId: '5', label: 'IMAGE', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}

function addMenuItemContextImageLink() {
    var myItem = {actionId: '6', label: 'IMAGE_LINK', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextImageLink() {
    var myItem = {actionId: '6', label: 'IMAGE_LINK', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}

function addMenuItemContextCustom() {
    var myItem = {actionId: '7', label: 'CustomContext', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = ["myContext"];

    blackberry.ui.contextmenu.addItem(contexts, myItem, callback);
}

function removeMenuItemContextCustom() {
    var myItem = {actionId: '7', label: 'CustomContext', icon:'local:///manual/ContextMenu/icon.png'},
        contexts = ["myContext" ];

    blackberry.ui.contextmenu.removeItem(contexts, myItem.actionId);
}


//**************************Custom contexts - defineCustomContext()**********************************
function addLinkContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_LINK],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '2'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addInputContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_INPUT],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '3'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addTextContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_TEXT],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '4'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addImageContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_IMAGE],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '5'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addImageLinkContextToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_IMAGE_LINK],
        includePlatformItems: false,
        includeMenuServiceItems: false,
        pinnedItemId: '6'
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addMenuServiceToCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: false,
        includeMenuServiceItems: true
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addPlatformToCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: true,
        includeMenuServiceItems: false
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function addAllContextAndMenuServiceAndPlatformToCustom() {
    var options = {
        includeContextItems: [blackberry.ui.contextmenu.CONTEXT_ALL],
        includePlatformItems: true,
        includeMenuServiceItems: true
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

function removeAdditionalContextsFromCustom() {
    var options = {
        includeContextItems: [],
        includePlatformItems: false,
        includeMenuService: false
    };
    blackberry.ui.contextmenu.defineCustomContext("myContext", options);
}

