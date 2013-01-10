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
var onShow,
    onError,
    onShowFlag,
    onErrorFlag,
    onClick,
    onClose,
    onShowFlag,
    onErrorFlag,
    onClickFlag,
    onCloseFlag,
    delay = 750,
    exThrown,
    notifTitle = "The Title",
    notifBody = "The Body",
    notifObj;

describe("blackberry.notification", function () {
    beforeEach(function () {
        onShow = jasmine.createSpy("show callback").andCallFake(
            function () {
                onShowFlag = true;
            });
        onError = jasmine.createSpy("error callback").andCallFake(
            function () {
                onErrorFlag = true;
            });
        onClick = jasmine.createSpy("click callback").andCallFake(
            function () {
                onClickFlag = true;
            });
        onClose = jasmine.createSpy("close callback").andCallFake(
            function () {
                onCloseFlag = true;
            });
    });

    afterEach(function () {
        onShow = null;
        onError = null;
        onShowFlag = false;
        onErrorFlag = false;
        onClick = null;
        onClose = null;
        onShowFlag = false;
        onErrorFlag = false;
        onClickFlag = false;
        onCloseFlag = false;
        exThrown = false;
        notifObj = null;
    });

    it('should add notification to uib when tag attribute was not provided', function () {
        var confirm;

        alert("Adds notification with title '" + notifTitle + "' and body '" + notifBody + "' to UIB");

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'onerror': onError, 'onshow': onShow});
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Do you see this notification created?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
        notifObj.close();
    });

    it('should add notification to uib when no options were provided', function () {
        var confirm;

        alert("Adds notification with title '" + notifTitle + "' to UIB");

        try {
            notifObj = new window.Notification(notifTitle);
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Do you see this notification created?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
        notifObj.close();
    });

    it('should close notificaton previously created', function () {
        var confirm;

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'tag': 'someTag', 'onerror': onError, 'onshow': onShow});

            alert("Verify UIB has a notificatoin with title '" + notifTitle + "' and body '" + notifBody + "' it will be deleted by 'close' method'");
            notifObj.close();
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Does notification removed from UIB?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
    });

    it('should remove notificaton previously created', function () {
        var confirm,
            tag = "someTag";

        try {
            new window.Notification(notifTitle, {'body': notifBody, 'tag': tag, 'onerror': onError, 'onshow': onShow});

            alert("Verify UIB has a notificatoin with title '" + notifTitle + "' and body '" + notifBody + "' it will be deleted by 'remove' method'");
            window.Notification.remove(tag);
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Does notification removed from UIB?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
    });

    it('should invoke test app when its notificaton selected in UIB', function () {
        var confirm;

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'target': "com.webworks.test.functional.invoke.target", 'targetAction': "bb.action.WWTEST", 'onerror': onError, 'onshow': onShow});
            alert("To invoke wwTest app itself, in UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Does wwTest app was invoked?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
    });

    it('should invoke test app when no target information is specified', function () {
        var confirm;

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody});
            alert("In UIB, select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Was this app invoked?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
    });

    it('should invoke test app and received all the parameters when its notificaton selected in UIB', function () {
        var confirm,
            invokedFlag,
            invokedData,
            target = "com.webworks.test.functional.invoke.target",
            targetAction = "bb.action.WWTEST",
            payload = "SGksIGZyb20gdGhlIEVhcnRoIQ==",
            payloadType = "text/plain",
            payloadURI = "http://www.google.com";

        runs(function () {
            try {
                blackberry.event.addEventListener("invoked", function (data) {
                    invokedData = data;
                    invokedFlag = true;
                });
                notifObj = new window.Notification(notifTitle, {'body': notifBody, 'target': target, 'targetAction': targetAction, 'payload': payload, 'payloadType': payloadType, 'payloadURI': payloadURI});
                alert("To invoke wwTest app itself, in UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
            } catch (e) {
                exThrown = true;
                console.log(e);
            }
        });

        waitsFor(function () {
            return invokedFlag;
        });

        runs(function () {
            confirm = window.confirm("Does wwTest app was invoked?");

            expect(confirm).toEqual(true);
            expect(exThrown).not.toEqual(true);

            expect(invokedData.target).toEqual(target);
            expect(invokedData.action).toEqual(targetAction);
            expect(invokedData.data).toEqual(payload);
            expect(invokedData.type).toEqual(payloadType);
            expect(invokedData.uri).toEqual(payloadURI);
        });
    });

    it('should invoke another app with its target provided when creates Notification', function () {
        var confirm,
            target = "sys.browser",
            targetAction = "bb.action.OPEN",
            payloadType = "text/html",
            payloadURI = "http://www.google.com";

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'target': target, 'targetAction': targetAction, 'payloadType': payloadType, 'payloadURI': payloadURI});
            alert("To invoke browser app points to google site, in UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Is browser invoked and points to google?");

        expect(confirm).toEqual(true);
        expect(exThrown).not.toEqual(true);
    });

    it('should not throw an exception when manually delete notification from UIB and then remove with an instance', function () {
        var target = "com.webworks.test.functional.invoke.target",
            targetAction = "bb.action.WWTEST";

        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'target': target, 'targetAction': targetAction });
            alert("From UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
            notifObj.close();
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        expect(exThrown).not.toEqual(true);
    });

    it('should never trigger onclick or onclose', function () {
        try {
            notifObj = new window.Notification(notifTitle, {'body': notifBody, 'onclick': onClick, 'onclose': onClose });
            alert("Manually dismiss the newly created notification from the UIB, then dismiss this alert");
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        expect(exThrown).not.toEqual(true);
        expect(onClick).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('should overwrite notifications with the same tags', function () {
        var confirm,
            notify1,
            notify2;

        try {
            notify1 = new window.Notification('notify1', {'tag': 'duplicate tag'});
            notify2 = new window.Notification('notify2', {'tag': 'duplicate tag'});
        } catch (e) {
            exThrown = true;
            console.log(e);
        }

        confirm = window.confirm("Do you see a notification titled notify2?");

        expect(exThrown).not.toEqual(true);
        expect(confirm).toEqual(true);
        notify2.close();
    });


    it('target specified without any action should cause action to default to bb.action.OPEN', function () {
        var confirm,
            invokedFlag,
            invokedData,
            target = "com.webworks.test.functional.invoke.target",
            targetAction = "bb.action.OPEN";

        runs(function () {
            try {
                blackberry.event.addEventListener("invoked", function (data) {
                    invokedData = data;
                    invokedFlag = true;
                });
                notifObj = new window.Notification(notifTitle, {'body': notifBody, 'target': target});
                alert("To invoke wwTest app itself, in UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
            } catch (e) {
                exThrown = true;
                console.log(e);
            }
        });

        waitsFor(function () {
            return invokedFlag;
        });

        runs(function () {
            confirm = window.confirm("Does wwTest app was invoked?");

            expect(confirm).toEqual(true);
            expect(exThrown).not.toEqual(true);

            expect(invokedData.target).toEqual(target);
            expect(invokedData.action).toEqual(targetAction);
        });
    });

    it('no target specified should use user specified action', function () {
        var confirm,
            invokedFlag,
            invokedData,
            targetAction = "bb.action.VIEW";

        runs(function () {
            try {
                blackberry.event.addEventListener("invoked", function (data) {
                    invokedData = data;
                    invokedFlag = true;
                });
                notifObj = new window.Notification(notifTitle, {'body': notifBody, 'targetAction': targetAction});
                alert("To invoke wwTest app itself, in UIB select notificatoin with title '" + notifTitle + "' and body '" + notifBody + "', then dimsiss this alert.");
            } catch (e) {
                exThrown = true;
                console.log(e);
            }
        });

        waitsFor(function () {
            return invokedFlag;
        });

        runs(function () {
            confirm = window.confirm("Does wwTest app was invoked?");

            expect(confirm).toEqual(true);
            expect(exThrown).not.toEqual(true);

            expect(invokedData.action).toEqual(targetAction);
        });
    });
});
