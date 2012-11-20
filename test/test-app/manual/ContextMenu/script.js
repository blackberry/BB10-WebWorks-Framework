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
function overridePlatform() {

    var myItem = {actionId: blackberry.ui.contextmenu.ACTION_COPY, label: 'CustomCopy!',
        icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.addItem(contexts, myItem, function() {
        alert("Wow you succesfully overrode the platform menu item Copy");
    });
}

function overrideMenuService() {

    var myItem = {actionId: 'MenuService-Share', label: 'CustomShare',
        icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.addItem(contexts, myItem, function() {
        alert("Wow you succesfully overrode the menu service action");
    });
}

function addCustomItem() {

    var myItem = {actionId: 'CustomAction', label: 'Custom Action',
        icon:'local:///manual/ContextMenu/icon.png'},
        contexts = [blackberry.ui.contextmenu.CONTEXT_ALL];

    blackberry.ui.contextmenu.addItem(contexts, myItem, function() {
        alert("Wow you succesfully added a custom item");
    });
}
