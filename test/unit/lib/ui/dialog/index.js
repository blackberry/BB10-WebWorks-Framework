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
var _libDir = __dirname + "./../../../../../lib/",
    webview = require(_libDir + 'webview'),
    overlayWebView = require(_libDir + 'overlayWebView'),
    dialog;

describe("lib/ui/dialog/index", function () {
    beforeEach(function () {
        spyOn(webview, 'continueSSLHandshaking');
        spyOn(overlayWebView, 'setSensitivity');
        spyOn(overlayWebView, 'executeJavascript');
        dialog = require(_libDir + "ui/dialog/index");
    });

    it("can show a dialog", function () {
        var description = '{stuff: "hi"}',
            callback = jasmine.createSpy();
        dialog.show(description, callback);
        expect(overlayWebView.setSensitivity).toHaveBeenCalledWith("SensitivityAlways");
        expect(overlayWebView.executeJavascript).toHaveBeenCalledWith("window.showDialog(" + JSON.stringify(description) + ")");
    });

    it("has an onDialogRequested handler that shows a dialog", function () {
        var description = '{stuff: "hi"}',
            baton = {
                take: jasmine.createSpy()
            };
        dialog.onDialogRequested(description, baton);
        expect(baton.take).toHaveBeenCalled();
        expect(overlayWebView.executeJavascript).toHaveBeenCalledWith("window.showDialog(" + JSON.stringify(description) + ")");
    });

    it("has an onSSLHandshakingFailed handler that handles SSL Trust", function () {
        var context = '{"url": "hi", "streamId": 42}';
        dialog.onSSLHandshakingFailed(context);
        expect(overlayWebView.executeJavascript).toHaveBeenCalled();
        dialog.result({save: true});
        expect(webview.continueSSLHandshaking).toHaveBeenCalledWith(42, "SSLActionTrust");
    });

    it("has an onSSLHandshakingFailed handler that handles SSL Reject", function () {
        var context = '{"url": "hi", "streamId": 42}';
        dialog.onSSLHandshakingFailed(context);
        expect(overlayWebView.executeJavascript).toHaveBeenCalled();
        dialog.result({cancel: true});
        expect(webview.continueSSLHandshaking).toHaveBeenCalledWith(42, "SSLActionReject");
    });

    it("has a result function that returns an OK result to the baton", function () {
        var baton = {
                take: jasmine.createSpy(),
                pass: jasmine.createSpy()
            },
            value = {
                ok: true,
                username: 'SpaceDragon',
                password: 'warpspeed',
                oktext: 'OK'
            },
            expectedResult = '{"setPreventDefault": true, ' +
                '"setUsername": "' + encodeURIComponent(value.username) + '", ' +
                '"setPassword": "' + encodeURIComponent(value.password) + '", ' +
                '"setResult": "' + value.oktext + '"}';

        dialog.onDialogRequested('{}', baton);
        dialog.result(value);
        expect(baton.pass).toHaveBeenCalledWith(expectedResult);
    });

    it("has a result function that returns a save result to the baton", function () {
        var baton = {
                take: jasmine.createSpy(),
                pass: jasmine.createSpy()
            },
            value = {
                save: true
            },
            expectedResult = '{"setPreventDefault": true, "setResult": "save"}';

        dialog.onDialogRequested('{}', baton);
        dialog.result(value);
        expect(baton.pass).toHaveBeenCalledWith(expectedResult);
    });

    it("has a result function that returns a never result to the baton", function () {
        var baton = {
                take: jasmine.createSpy(),
                pass: jasmine.createSpy()
            },
            value = {
                never: true
            },
            expectedResult = '{"setPreventDefault": true, "setResult": "never"}';

        dialog.onDialogRequested('{}', baton);
        dialog.result(value);
        expect(baton.pass).toHaveBeenCalledWith(expectedResult);
    });

    it("has a result function that returns a cancel result to the baton", function () {
        var baton = {
                take: jasmine.createSpy(),
                pass: jasmine.createSpy()
            },
            value = {
                cancel: true
            },
            expectedResult = '{"setPreventDefault": true, "setResult": "null"}';

        dialog.onDialogRequested('{}', baton);
        dialog.result(value);
        expect(baton.pass).toHaveBeenCalledWith(expectedResult);
    });

    it("has a result function that returns a default null result to the baton", function () {
        var baton = {
                take: jasmine.createSpy(),
                pass: jasmine.createSpy()
            },
            value = {},
            expectedResult = '{"setPreventDefault": true, "setResult": "null"}';

        dialog.onDialogRequested('{}', baton);
        dialog.result(value);
        expect(baton.pass).toHaveBeenCalledWith(expectedResult);
    });

});

