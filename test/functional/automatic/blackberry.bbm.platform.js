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

function testBBMProfileReadOnly(field) {
    var before = blackberry.bbm.platform.self[field];
    blackberry.bbm.platform.self[field] = "MODIFIED";
    expect(blackberry.bbm.platform.self[field]).toEqual(before);
}

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
    describe("self", function () {
        it('makes sure all the profile fields are read only', function () {
            runs(function () {
                testBBMProfileReadOnly("displayName");
                testBBMProfileReadOnly("status");
                testBBMProfileReadOnly("statusMessage");
                testBBMProfileReadOnly("personalMessage");
                testBBMProfileReadOnly("ppid");
                testBBMProfileReadOnly("handle");
                testBBMProfileReadOnly("appVersion");
                testBBMProfileReadOnly("bbmsdkVersion");
            });
        });

        it('make sure required fieids are not blank', function () {
            runs(function () {
                expect(blackberry.bbm.platform.self.displayName).toNotEqual("");
                expect(blackberry.bbm.platform.self.status).toNotEqual("");
                expect(blackberry.bbm.platform.self.ppid).toNotEqual("");
                expect(blackberry.bbm.platform.self.handle).toNotEqual("");
                expect(blackberry.bbm.platform.self.appVersion).toNotEqual("");
                expect(blackberry.bbm.platform.self.bbmsdkVersion).toNotEqual("");
            });
        });

    });

    describe("getDisplayPicture", function () {
        var onDisplayPicture,
            waitForTimeout = 3000;

        it('should invoke callback when getDisplayPicture is called', function () {
            runs(function () {
                onDisplayPicture = jasmine.createSpy();
                blackberry.bbm.platform.self.getDisplayPicture(onDisplayPicture);
            });

            waitsFor(function () {
                return onDisplayPicture.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onDisplayPicture).toHaveBeenCalled();
            });

        });
    });

    describe("profilebox", function () {
        var onSuccess = jasmine.createSpy(),
            onError = jasmine.createSpy(),
            waitForTimeout = 10000,
            item,
            itemIconId,
            itemAdded = function (data) {
                            item = data;
                        };

        beforeEach(function () {
            onSuccess.reset();
            onError.reset();
        });

        it("should be able to check the profile box is accessible", function () {
            expect(blackberry.bbm.platform.self.profilebox.accessible).toEqual(true);
        });

        it("should invoke success callback when adding an item", function () {
            runs(function () {
                item = { text: "hello", cookie: "chocolate" };
                blackberry.bbm.platform.self.profilebox.addItem(item, onSuccess.andCallFake(itemAdded), onError);
            });

            waitsFor(function () {
                return onSuccess.callCount;
            }, "success never fired", waitForTimeout);

            runs(function () {
                expect(onSuccess).toHaveBeenCalledWith(item);
            });
        });
        
        it("should invoke error callback when adding an item", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.addItem({ }, onSuccess, onError);
            });

            waitsFor(function () {
                return onError.callCount;
            }, "error never fired", waitForTimeout);

            runs(function () {
                expect(onError).toHaveBeenCalled();
            });
        });

        it("should invoke success callback when removing an item", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.removeItem(item, onSuccess, onError);
            });

            waitsFor(function () {
                return onSuccess.callCount;
            }, "success never fired", waitForTimeout);

            runs(function () {
                expect(onSuccess).toHaveBeenCalledWith(item);
            });
        });
        
        it("should invoke error callback when removing an item", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.removeItem({}, onSuccess, onError);
            });

            waitsFor(function () {
                return onError.callCount;
            }, "error never fired", waitForTimeout);

            runs(function () {
                expect(onError).toHaveBeenCalled();
            });
        });

        it("should invoke success callback when registering an icon", function () {
            itemIconId = Math.floor(Math.random() * 32000);

            runs(function () {
                blackberry.bbm.platform.self.profilebox.registerIcon({ icon: "local:///default-icon.png", iconId: itemIconId }, onSuccess, onError); 
            });

            waitsFor(function () {
                return onSuccess.callCount;
            }, "success never fired", waitForTimeout);

            runs(function () {
                expect(onSuccess).toHaveBeenCalledWith({ iconId: itemIconId });
            });
        });

        it("should invoke error callback when registering an icon with an invalid file", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.registerIcon({ icon: "local:///no-icon.png", iconId: itemIconId }, onSuccess, onError); 
            });

            waitsFor(function () {
                return onError.callCount;
            }, "error never fired", waitForTimeout);

            runs(function () {
                expect(onError).toHaveBeenCalled();
            });
        });

        it("should invoke error callback when registering an icon with an invalid iconId", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.registerIcon({ icon: "local:///no-icon.png", iconId: "9000" }, onSuccess, onError); 
            });

            waitsFor(function () {
                return onError.callCount;
            }, "error never fired", waitForTimeout);

            runs(function () {
                expect(onError).toHaveBeenCalled();
            });
        });

        it("should invoke success callback when adding an item with an icon", function () {
            runs(function () {
                item = { text: "text", cookie: "iconItem", iconId: itemIconId };
                blackberry.bbm.platform.self.profilebox.addItem(item, onSuccess.andCallFake(itemAdded), onError);
            });
            
            waitsFor(function () {
                return onSuccess.callCount;
            }, "success never fired", waitForTimeout);

            runs(function () {
                expect(onSuccess).toHaveBeenCalledWith(item);
            });
        });
        
        it("should be able to get the amount of items in the profile box", function () {
            runs(function () {
                expect(blackberry.bbm.platform.self.profilebox.item.length).toBeGreaterThan(0);
            });
        });

        it("should be able to clear the items in the profile box", function () {
            runs(function () {
                blackberry.bbm.platform.self.profilebox.clearItems();
                waits(3000);
            });
        });

        it("should be able to check the array length", function () {
            expect(blackberry.bbm.platform.self.profilebox.item.length).toEqual(0);
        });
    });
});

