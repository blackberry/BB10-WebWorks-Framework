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

describe("blackberry.ui.dialog", function () {
    it('blackberry.ui.dialog should exist', function () {
        expect(blackberry.ui.dialog).toBeDefined();
    });

    it('blackberry.ui.dialog.customAskAsync should exist', function () {
        expect(blackberry.ui.dialog.customAskAsync).toBeDefined();
    });
    
    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog', function () {
		var buttons = ["Ok"],
            settings = {title : "Dialog", size : blackberry.ui.dialog.SIZE_FULL, position : blackberry.ui.dialog.TOP},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog is not a global dialog and should have one button", buttons, dialogCallback, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
    });

    it('blackberry.ui.dialog should exist', function () {
        expect(blackberry.ui.dialog).toBeDefined();
    });

    it('blackberry.ui.dialog.customAskAsync should exist', function () {
        expect(blackberry.ui.dialog.customAskAsync).toBeDefined();
    });
    
    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog with two buttons and a title', function () {
		var buttons = ["Hello", "World"],
            settings = {title : "Dialog", size : blackberry.ui.dialog.SIZE_LARGE, position : blackberry.ui.dialog.CENTER},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog is not a global dialog and should have two buttons, click the pass button to proceed", buttons, dialogCallback, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
    });
    
    it('blackerry.ui.dialog.customAskAsync should be able to create a global dialog with three buttons and a title', function () {
		var buttons = ["OK", "Hello", "World"],
            settings = {title : "Dialog", size : blackberry.ui.dialog.SIZE_LARGE, position : blackberry.ui.dialog.CENTER, global: true},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog is not a global dialog and should have three buttons and should be a global dialog, click the pass button to proceed", buttons, dialogCallback, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
    });
});
