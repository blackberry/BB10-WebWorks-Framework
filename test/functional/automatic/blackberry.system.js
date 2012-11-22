/*
 * Copyright 2011-2012 Research In Motion Limited.
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

function testSystemValue(field, value) {
    expect(blackberry.system[field]).toBeDefined();
    if (value) {
        expect(blackberry.system[field]).toEqual(value);
    }
}

function testSystemReadOnly(field) {
    var before = blackberry.system[field];
    blackberry.system[field] = "MODIFIED";
    expect(blackberry.system[field]).toEqual(before);
}

describe("blackberry.system", function () {

    it("blackberry.system should exist", function () {
        expect(blackberry.system).toBeDefined();
    });

    it("blackberry.system ALLOW and DENY should be defined", function () {
        testSystemValue("ALLOW", 0);
        testSystemValue("DENY", 1);
    });

    it("blackberry.system ALLOW and DENY should be read-only", function () {
        testSystemReadOnly("ALLOW");
        testSystemReadOnly("DENY");
    });

    it("blackberry.system.hasPermission should exist", function () {
        expect(blackberry.system.hasPermission).toBeDefined();
    });

    it("blackberry.system.hasCapability should exist", function () {
        expect(blackberry.system.hasCapability).toBeDefined();
    });

    it("blackberry.system.hasPermission should return true for module in whitelist", function () {
        expect(blackberry.system.hasPermission("blackberry.system")).toBe(blackberry.system.ALLOW);
    });

    it("blackberry.system.hasPermission should return false for module not in whitelist", function () {
        expect(blackberry.system.hasPermission("blackberry.system.event")).toBe(blackberry.system.DENY);
    });

    it("blackberry.system.hasCapability should return true for wifi", function () {
        expect(blackberry.system.hasCapability("network.wlan")).toBeTruthy();
    });

    it("blackberry.system.hasCapability should return false for unknown capability", function () {
        expect(blackberry.system.hasCapability("bake.cookies")).toBeFalsy();
    });

    describe("font api", function () {
        it("getFontInfo should be defined", function () {
            expect(blackberry.system.getFontInfo).toBeDefined();
        });

        it("getFontInfo should return family and size of system font", function () {
            var fontInfo = blackberry.system.getFontInfo();

            expect(fontInfo).toBeDefined();
            expect(fontInfo.fontFamily).toBeDefined();
            expect(typeof fontInfo.fontFamily === "string").toBeTruthy();
            expect(fontInfo.fontSize).toBeDefined();
            expect(typeof fontInfo.fontSize === 'number').toBeTruthy();
        });
    });

    describe("device properties", function () {
        it('blackberry.system.hardwareId should exist', function () {
            testSystemValue("hardwareId");
        });

        it('blackberry.system.hardwareId should be read-only', function () {
            testSystemReadOnly("hardwareId");
        });

        it('blackberry.system.softwareVersion should exist', function () {
            testSystemValue("softwareVersion");
        });

        it('blackberry.system.softwareVersion should be read-only', function () {
            testSystemReadOnly("softwareVersion");
        });

        it("blackberry.system.name should exist", function () {
            testSystemValue("name");
            expect(blackberry.system.name).toEqual(jasmine.any(String));
            expect(blackberry.system.name).not.toEqual("");
        });

        it("blackberry.system.name should be read only", function () {
            testSystemReadOnly("name");
        });

        it('blackberry.system.region should exist', function () {
            testSystemValue("region");
        });

        it('blackberry.system.language should exist', function () {
            testSystemValue("language");
        });
    });

    describe("getCurrentTimezone", function () {
        it('returns current timezone', function () {
            var timezone = blackberry.system.getCurrentTimezone();
            expect(timezone).toBeDefined();
            expect(timezone).toEqual(jasmine.any(String));
            expect(timezone).not.toEqual("");
        });
    });

    describe("getTimezones", function () {
        it('return array of timezone ids', function () {
            var timezone = blackberry.system.getCurrentTimezone(),
                allTimezones = blackberry.system.getTimezones();
            expect(timezone).toBeDefined();
            expect(Array.isArray(allTimezones)).toBeTruthy();
            expect(allTimezones).toContain(timezone);
        });
    });
});
