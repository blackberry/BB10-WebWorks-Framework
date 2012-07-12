/*
 *  Copyright 2012 Research In Motion Limited.
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

var listBuilder,
    listItems;

function init(request) {
    listItems = [];
}

function invokeApp(key) {
    // invoke some app based on ID
    console.log("invoking");
    var invokeRequest = listItems[key],
        args = [invokeRequest];

    window.qnx.webplatform.getController().remoteExec(1, "invocation.invoke", args);
    listBuilder.hide();
}

function handleMouseDown(evt) {
    evt.preventDefault();
}

listBuilder = {
    init: init,
    setHeader: function (headerText) {
        var listHeader = document.getElementById('listHeader');
        listHeader.innerHTML = "";
        listHeader.appendChild(document.createTextNode(headerText));
    },
    populateList: function (targets, request) {
        var listContent = document.getElementById('listContent'),
            listItem,
            i;

        // Reset listContent
        listContent.innerHTML = "";
        // create a bunch of subdivs
        for (i in targets) {
            listItem = document.createElement('div');
            listItem.appendChild(document.createTextNode(targets[i].label));
            listItem.setAttribute('class', 'listItem');
            listItem.addEventListener('mousedown', handleMouseDown, false);
            listItem.ontouchend = invokeApp.bind(this, targets[i].key);
            listItems[targets[i].key] = {
                target : targets[i].key,
                action : request.action,
                type: request.type,
                uri : request.uri,
                data : window.btoa(request.data)
            };
            listContent.appendChild(listItem);
        }
        // subdivs will have a click handler to run stuff
        // hide menu after handling a click
    },
    show: function () {
        // set css class to visible
        var listContainer = document.getElementById('listContainer');
        listContainer.setAttribute('class', 'showList');
    },
    hide: function () {
        // set css class to hidden
        var listContainer = document.getElementById('listContainer');
        listContainer.setAttribute('class', 'hideList');
    }
};

module.exports = listBuilder;
