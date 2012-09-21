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
function testNotificationValue(field, value) {
    expect(window.Notification[field]).toBeDefined();
    expect(window.Notification[field]).toEqual(value);
}

function testNotificationReadOnly(field) {
    var before = window.Notification[field];
    window.Notification[field] = "MODIFIED";
    expect(window.Notification[field]).toEqual(before);
}

describe("Notification", function () {
    
    it("permissions granted", function () {
        expect(testNotificationValue("permission", "granted"));
    });

    it("permissions read-only", function () {
        expect(testNotificationReadOnly("permission"));   
    });

    it("request permission does not trigger callback", function () {
        var callback = jasmine.createSpy("permission callback");
        window.Notification.requestPermission(callback);
        expect(callback).not.toHaveBeenCalled();
    });

    it("can create a notification", function () {
        var notification;
        notification = new window.Notification("Simple notification");
        expect(notification).toBeDefined();
        notification.close();
    });

    it("can create a notification with a body", function () {
        var notification;
        notification = new window.Notification("TestApp - Notification!", { 
            body : 'tap to dismiss'
        });
        expect(notification).toBeDefined();
        notification.close();
    });

    it("throws an exception when creating a notification without a title", function () {
        var notification,
            exception;
        try {
            notification = new window.Notification();
        } catch (e) {
            exception = true;
        }

        expect(exception).toEqual(true);
    });

    it("throws an exception when creating a notification with a non-string title", function () {
        var notification,
            exception;
        try {
            notification =  new window.Notification(123); 
        } catch (e) { 
            exception = true;
        }

        expect(exception).toEqual(true);
    });
    
    describe("close", function () {
        it("can close a notification", function () {
            var errorFlag,
                showFlag,
                onError = jasmine.createSpy("onError callback").andCallFake(function () { 
                    errorFlag = true; 
                }),
                onShow = jasmine.createSpy("onShow callback").andCallFake(function () { 
                    showFlag = true; 
                }),
                myNotification;
                
            runs(function () {
                myNotification = new window.Notification("You should not see this notification!", {
                    'onerror' : onError, 
                    'onshow' : onShow
                });
            });

            waitsFor(function () {
                return (errorFlag || showFlag);
            });

            runs(function () {
                myNotification.close();
                expect(onError).not.toHaveBeenCalled();
                expect(onShow).toHaveBeenCalled();
            });
        });
        
        it("events do not fire once notification is closed", function () {
            var errorFlag,
                showFlag,
                onError = jasmine.createSpy("onError callback").andCallFake(function () { 
                    errorFlag = true; 
                }),
                onShow = jasmine.createSpy("onShow callback").andCallFake(function () { 
                    showFlag = true; 
                }),
                myNotification = new window.Notification("You should not see this notification!", {
                    'onerror' : onError, 
                    'onshow' : onShow
                });

            myNotification.close();

            expect(onError).not.toHaveBeenCalled();
            expect(onShow).not.toHaveBeenCalled();
        });
    });

    describe("Notification.remove", function () {
        it("can remove a notification", function () {
            var errorFlag,
                showFlag,
                onError = jasmine.createSpy("onError callback").andCallFake(function () { 
                    errorFlag = true; 
                }),
                onShow = jasmine.createSpy("onShow callback").andCallFake(function () { 
                    showFlag = true; 
                }),
                tagNotification;
                
            runs(function () {
                tagNotification = new window.Notification("You should not see this notification!", {
                    'tag' : "this is a tag",
                    'onerror' : onError, 
                    'onshow' : onShow
                });
            });

            waitsFor(function () {
                return (errorFlag || showFlag);
            });

            runs(function () {
                window.Notification.remove("this is a tag");
                expect(onError).not.toHaveBeenCalled();
                expect(onShow).toHaveBeenCalled();
            });
        });

        it("does not throw an exception when removing a non-existent tag", function () {
            var exceptionThrown = false;
            try {
                window.Notification.remove("winter is coming...");
            } catch (e) {
                exceptionThrown = true;
                console.log(exceptionThrown);
            }

            expect(exceptionThrown).toEqual(false);
        });
    });
});
