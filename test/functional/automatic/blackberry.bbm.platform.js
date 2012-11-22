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
});

