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
    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog', function () {
		var buttons = ["Ok"],
            settings = {title : "Dialog"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog should have one button", buttons, dialogCallbackCheckOption, settings);

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option).toEqual(0);
        });
    });
    
    it('blackerry.ui.dialog.customAskAsync should be able to create a dialog with two buttons and a title', function () {
		var buttons = ["Hello", "Ok"],
            settings = {title : "Dialog"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog should have two buttons, click the Ok button to proceed", buttons, dialogCallbackCheckOption, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option).toEqual(1);
        });
    });
    
    it('blackerry.ui.dialog.customAskAsync should be able to create a global dialog with three buttons and a title', function () {
		var buttons = ["Hello", "World", "Ok"],
            settings = {title : "Dialog", global: true},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.customAskAsync("Click the button, this dialog should have three buttons, click the Ok button to proceed", buttons, dialogCallbackCheckOption, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option).toEqual(2);
        });
    });
    
    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok dialog and return Ok', function () {
        var type = blackberry.ui.dialog.D_OK,
            settings = {title : "Ok Dialog"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have an OK button", type, dialogCallbackCheckOption, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Ok');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Delete dialog and return Delete', function () {
        var type = blackberry.ui.dialog.D_DELETE,
            settings = {title : "Delete Dialog, Click Delete"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Delete/Cancel). Click the Delete button", type, dialogCallbackCheckOption, settings);

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Delete');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Delete dialog and return Cancel', function () {
        var type = blackberry.ui.dialog.D_DELETE,
            settings = {title : "Delete Dialog, Click Cancel"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Delete/Cancel). Click the Cancel button", type, dialogCallbackCheckOption, settings);

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Cancel');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Yes/No dialog and return Yes', function () {
        var type = blackberry.ui.dialog.D_YES_NO,
            settings = {title : "Yes/No Dialog, Click Yes"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Yes/No). Click the Yes button", type, dialogCallbackCheckOption, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Yes');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create a Yes/No dialog and return No', function () {
        var type = blackberry.ui.dialog.D_YES_NO,
            settings = {title : "Yes/No Dialog, Click No"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Yes/No). Click the No button", type, dialogCallbackCheckOption, settings);
        
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('No');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok/Cancel dialog and return Ok', function () {
        var type = blackberry.ui.dialog.D_OK_CANCEL,
            settings = {title : "Ok/Cancel Dialog, Click Ok"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Ok/Cancel). Click the Ok button", type, dialogCallbackCheckOption, settings);
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Ok');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should be able to create an Ok/Cancel dialog and return Cancel', function () {
        var type = blackberry.ui.dialog.D_OK_CANCEL,
            settings = {title : "Ok/Cancel Dialog, Click Cancel"},
            callback = jasmine.createSpy();

        blackberry.ui.dialog.standardAskAsync("Click the button, this dialog is not a global dialog and should have two buttons (Ok/Cancel). Click the Cancel button", type, dialogCallbackCheckOption, settings);
        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);
        runs(function () {
            expect(option.return).toEqual('Cancel');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option index and return Save', function () {
        var type = blackberry.ui.dialog.D_SAVE,
            settings = {title : "Save Dialog, Click Save"},
            callback = jasmine.createSpy();

        runs(function () {
            blackberry.ui.dialog.standardAskAsync("This dialog is not a global dialog and should have two buttons (Save/Discard).  Click the Save button.", type, dialogCallbackCheckOption, settings);
        });

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);

        runs(function () {
            expect(option.return).toEqual('Save');
        });
    });  

    it('blackberry.ui.dialog.standardAskAsync should return the correct option index and return Discard', function () {
        var type = blackberry.ui.dialog.D_SAVE,
            settings = {title : "Save Dialog, Click Discard"},
            callback = jasmine.createSpy();

        runs(function () {
            blackberry.ui.dialog.standardAskAsync("This dialog is not a global dialog and should have two buttons (Save/Discard).  Click the Discard button.", type, dialogCallbackCheckOption, settings);
        });

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);

        runs(function () {
            expect(option.return).toEqual('Discard');
        });
    });

    it('blackberry.ui.dialog.standardAskAsync should return the correct option for Prompt dialog and return when Ok', function () {
        var type = blackberry.ui.dialog.D_PROMPT,
            settings = {title : "Prompt Dialog, Insert and click Ok"},
            callback = jasmine.createSpy();

        runs(function () {
            blackberry.ui.dialog.standardAskAsync("This dialog is not a global dialog and should have two buttons (Save/Discard).  Insert 'test' and click the Ok button.", type, dialogCallbackCheckOption, settings);
        });

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);

        runs(function () {
            expect(option.return).toEqual('Ok');
            expect(option.promptText).toEqual('test');
        });
    });
    
    it('blackberry.ui.dialog.standardAskAsync should return the correct option for Prompt dialog and return when Cancel', function () {
        var type = blackberry.ui.dialog.D_PROMPT,
            settings = {title : "Prompt Dialog, Insert and click Cancel"},
            callback = jasmine.createSpy();

        runs(function () {
            blackberry.ui.dialog.standardAskAsync("This dialog is not a global dialog and should have two buttons (Save/Discard).  Insert 'test' and click the Cancel button.", type, dialogCallbackCheckOption, settings);
        });

        waitsFor(function () {
            return checkForCallback(callback);
        }, "dialog callback was never called", 10000);

        runs(function () {
            expect(option.return).toEqual('Cancel');
            expect(option.promptText).toEqual(null);
        });
    });

    it('blackberry.ui.dialog SSL Certificate Exception dialog should be shown, and add the exception', function () {
        window.alert("You will see an SSL certificate exception dialog, and please select [Add Exception].");
        runs(function () {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "https://atg05-yyz.labyyz.testnet.rim.net/", false);
            xmlhttp.onreadystatechange = function (res) {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    alert("Request success");
                }
            };
            xmlhttp.send();
        });
        runs(function () {
            expect(window.confirm("Did you see the SSL Certificate Exception Dialog and then a Request Success dialog?")).toBeTruthy();
        });
    });

    it('blackberry.ui.dialog SSL Certificate Exception dialog should be shown, and deny the certificate', function () {
        window.alert("You will see an SSL certificate exception dialog, and please select [Don\'t Trust].");
        function sendXHRRequest() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "https://atg05-yyz.labyyz.testnet.rim.net/", false);
            xmlhttp.onreadystatechange = function (res) {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    alert("Request success");
                }
            };
            xmlhttp.send();
        }

        expect(function () {
            sendXHRRequest();
        }).toThrow();

        runs(function () {
            expect(window.confirm("Did you see the SSL Certificate Exception Dialog?")).toBeTruthy();
        });
    });
});
