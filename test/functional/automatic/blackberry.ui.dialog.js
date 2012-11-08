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

var called;
var option = -1;

function dialogCallback(btn) {
    called = true;
}

function checkForCallback(callback) {
    if (called) {
        called = false;
        return true;
    } else {
        return false;
    }
}

function dialogCallbackCheckOption(btn) {
    option = btn;
    dialogCallback(btn);
}

function testDialogValue(field, value) {
    expect(blackberry.ui.dialog[field]).toBeDefined();
    expect(blackberry.ui.dialog[field]).toEqual(value);
}

function testDialogReadOnly(field) {
    var before = blackberry.ui.dialog[field];
    blackberry.ui.dialog[field] = -1;
    expect(blackberry.ui.dialog[field]).toEqual(before);
}

describe("blackberry.ui.dialog", function () {
    it('blackberry.ui.dialog should exist', function () {
        expect(blackberry.ui.dialog).toBeDefined();
    });

    it('blackberry.ui.dialog.customAskAsync should exist', function () {
        expect(blackberry.ui.dialog.customAskAsync).toBeDefined();
    });
    
    it('blackberry.ui.dialog should exist', function () {
        expect(blackberry.ui.dialog).toBeDefined();
    });

    it('blackberry.ui.dialog.customAskAsync should exist', function () {
        expect(blackberry.ui.dialog.customAskAsync).toBeDefined();
    });
    
    it('blackberry.ui.dialog.standardAskAsync should exist', function () {
        expect(blackberry.ui.dialog.standardAskAsync).toBeDefined();
    });

    it('blackberry.ui.* should be defined', function () {
        testDialogValue("D_OK", 0);
        testDialogValue("D_SAVE", 1);
        testDialogValue("D_DELETE", 2);
        testDialogValue("D_YES_NO", 3);
        testDialogValue("D_OK_CANCEL", 4);
        testDialogValue("D_PROMPT", 5);
    });
    
    it('blackberry.ui.* should be read-only', function () {
        testDialogReadOnly("D_OK");
        testDialogReadOnly("D_SAVE");
        testDialogReadOnly("D_DELETE");
        testDialogReadOnly("D_YES_NO");
        testDialogReadOnly("D_OK_CANCEL");
        testDialogReadOnly("D_PROMPT");
    });
});
