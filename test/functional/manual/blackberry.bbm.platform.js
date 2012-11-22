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

describe("blackberry.bbm.platform", function () {
    describe("onacccesschange", function () {
        var onChange,
            waitForTimeout = 15000,
            flag = false;

        it('should invoke callback when BBM access is registered', function () {
            runs(function () {
                onChange = jasmine.createSpy().andCallFake(function (allowed, reason) {
                    if (reason === "unregistered") {
                        blackberry.bbm.platform.register({ uuid : "68de53d0-e701-11e1-aff1-0800200c9a66" });
                    } else if (reason === "allowed") {
                        flag = true;
                    }
                });
                blackberry.event.addEventListener("onaccesschanged", onChange);
            });

            waitsFor(function () {
                return flag;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onChange).toHaveBeenCalledWith(true, "allowed");
            });
        });
    });
});

describe("blackberry.bbm.platform.self", function () {
    describe("blackberry.platform.bbm.self.setStatus", function () {

        it('should be able to set the BBM status to busy with text', function () {
            runs(function () {
                blackberry.bbm.platform.self.setStatus("busy", "I am busy");
                alert("Press OK to continue");
                expect(blackberry.bbm.platform.self.status).toEqual("busy");
                expect(blackberry.bbm.platform.self.statusMessage).toEqual("I am busy");
            });
        });

        it('should be able to set the BBM status to available with text', function () {
            runs(function () {
                blackberry.bbm.platform.self.setStatus("available", "I am available");
                alert("Press OK to continue");
                expect(blackberry.bbm.platform.self.status).toEqual("available");
                expect(blackberry.bbm.platform.self.statusMessage).toEqual("I am available");
            });
        });
    });

    describe("setPersonalMessage", function () {
        it('should be able to set the BBM personal message', function () {
            runs(function () {
                blackberry.bbm.platform.self.setPersonalMessage("Hello World");
                alert("Press OK to continue");
                expect(blackberry.bbm.platform.self.personalMessage).toEqual("Hello World");
            });
        });
    });
    
    describe("setDisplayPicture", function () {
        var onDisplayPicture,
            waitForTimeout = 5000;

        it('should be able to set the BBM display picture', function () {
            runs(function () {
                onDisplayPicture = jasmine.createSpy();

                blackberry.bbm.platform.self.setDisplayPicture("./app/native/default-icon.png");
                blackberry.bbm.platform.self.getDisplayPicture(onDisplayPicture);
            });

            waitsFor(function () {
                return onDisplayPicture.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onDisplayPicture).toHaveBeenCalledWith("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");
            });
        });
    });
});

describe("blackberry.bbm.platform.users", function () {
    describe("bbm cards", function () {
        it("inviteToDownload", function () {
            var confirmation;
        
            runs(function () {
                blackberry.bbm.platform.users.inviteToDownload();
            });

            waitsFor(function () {
                confirmation = window.confirm("Did it invoke?");
                return confirmation;
            });

            runs(function () {
                expect(confirmation).toEqual(true);
            });
        });
    });

    describe("onupdate", function () {
        var onUpdate,
            waitForTimeout = 15000;

        it('can receive updates when the current user profile is changed', function () {
            runs(function () {
                onUpdate = jasmine.createSpy();
                blackberry.event.addEventListener("onupdate", onUpdate);
                blackberry.bbm.platform.self.setPersonalMessage("test");
            });

            waitsFor(function () {
                return onUpdate.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onUpdate).toHaveBeenCalled();
            });
        });

        it("can receive updates from other users", function () {
            runs(function () {
                onUpdate = jasmine.createSpy();
                blackberry.event.addEventListener("onupdate", onUpdate);
                alert("Update the contact on the other device to continue");
            });
            
            waitsFor(function () {
                return onUpdate.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onUpdate).toHaveBeenCalled();
            });
        });
    });
});

