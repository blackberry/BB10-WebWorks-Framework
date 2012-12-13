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
var _ID = "blackberry.ui.contextmenu",
    _extDir = __dirname + "./../../../../ext",
    _apiDir = _extDir + "/" + "ui.contextmenu",
    client = null,
    mockedWebworks = {
        execSync: jasmine.createSpy("execSync").andCallFake(function (service, action, args) {
            return true;
        }),
        execAsync: jasmine.createSpy("execAsync").andCallFake(function (service, action, args) {
            return true;
        })
    },
    mockedEvent = {
        addEventListener : jasmine.createSpy()
    };

describe("blackberry.ui.contextmenu client", function () {

    beforeEach(function () {
        GLOBAL.window = {
            webworks: mockedWebworks,
            blackberry : {
                event : mockedEvent
            },
        };
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
    });

    it("enabled context menu calls execSync", function () {
        client.enabled = true;
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "enabled", {"enabled": true});
    });

    it("disabled context menu calls execSync", function () {
        client.enabled = false;
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, "enabled", {"enabled": false});
    });

    it('expect context menu contexts to be defined properly', function () {
        expect(client.CONTEXT_ALL).toEqual("ALL");
        expect(client.CONTEXT_IMAGE).toEqual("IMAGE");
        expect(client.CONTEXT_IMAGE_LINK).toEqual("IMAGE_LINK");
        expect(client.CONTEXT_LINK).toEqual("LINK");
        expect(client.CONTEXT_INPUT).toEqual("INPUT");
        expect(client.CONTEXT_TEXT).toEqual("TEXT");
    });

    it('expect context menu action Ids to be defined properly', function () {
        expect(client.ACTION_CANCEL).toEqual("Cancel");
        expect(client.ACTION_CLEAR_FIELD).toEqual("ClearField");
        expect(client.ACTION_COPY).toEqual("Copy");
        expect(client.ACTION_COPY_IMAGE_LINK).toEqual("CopyImageLink");
        expect(client.ACTION_COPY_LINK).toEqual("CopyLink");
        expect(client.ACTION_CUT).toEqual("Cut");
        expect(client.ACTION_INSPECT_ELEMENT).toEqual("InspectElement");
        expect(client.ACTION_PASTE).toEqual("Paste");
        expect(client.ACTION_SAVE_IMAGE).toEqual("SaveImage");
        expect(client.ACTION_SAVE_LINK_AS).toEqual("SaveLinkAs");
        expect(client.ACTION_VIEW_IMAGE).toEqual("ViewImage");
        expect(client.ACTION_SELECT).toEqual("Select");
    });

    it("Cannot add a menu item without a context", function () {
        var myItem = {actionId: 'OpenLink', label: 'This is a lable'};
        expect(client.addItem(undefined, myItem, null)).toEqual('Adding a custom menu item requires a context');
    });

    it("Cannot add a menu item without an actionId", function () {
        var myItem = {label: 'OpenLink'},
            contexts = [client.CONTEXT_LINK];
        expect(client.addItem(contexts, myItem, null)).toEqual('Adding a custom menu item requires an actionId');
    });

    it("Cannot remove a menu item without an actionId", function () {
        var contexts = [client.CONTEXT_LINK];
        expect(client.removeItem(contexts, undefined, null)).toEqual('Removing a custom menu item requires an actionId');
    });

    it("Cannot remove a menu item without a context", function () {
        var myItem = {label: 'OpenLink'};
        expect(client.removeItem(undefined, myItem, null)).toEqual('Removing a custom menu item requires a context');
    });

    it("defineCustomContext calls execSync", function () {
        var options = {
            includeContextItems: [client.CONTEXT_IMAGE],
            includePlatformItems: false,
            includeMenuServiceItems: false
        };

        client.defineCustomContext("myContext", options);
        expect(mockedWebworks.execAsync).toHaveBeenCalledWith(_ID, "defineCustomContext", {context: "myContext", options: options});
    });

    it("Can override an item with an action and handler", function () {
        var myItem = {actionId: 'OpenLink', label: 'This is a lable'},
            handler = jasmine.createSpy();
        client.overrideItem(myItem, handler);
        expect(mockedEvent.addEventListener).toHaveBeenCalledWith('contextmenu.executeMenuAction', jasmine.any(Function));
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, 'overrideItem', {action: myItem});
    });

    it("Can clear an item with an actionId", function () {
        var actionId = 'OpenLink';
        client.clearOverride(actionId);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(_ID, 'clearOverride', {actionId: actionId});
    });
});
