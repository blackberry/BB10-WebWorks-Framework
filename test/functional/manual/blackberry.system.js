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
    if (arguments.length > 1) {
        expect(blackberry.system[field]).toEqual(value);
    }
}

function testSystemReadOnly(field) {
    var before = blackberry.system[field];
    blackberry.system[field] = "MODIFIED";
    expect(blackberry.system[field]).toEqual(before);
}

describe("blackberry.system", function () {
    var waitForTimeout = 15000;

    it("name should have a valid value", function () {
        var message = "Device Name: " + blackberry.system.name + "\n\n" +
                "Is the device name valid?",
            confirm = window.confirm(message);

        expect(confirm).toBeTruthy();
    });

    describe("regionchanged", function () {
        var onRegionChanged = null;

        beforeEach(function () {
            onRegionChanged = jasmine.createSpy("onRegionChanged");
            blackberry.event.addEventListener("regionchanged", onRegionChanged);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("regionchanged", onRegionChanged);
            onRegionChanged = null;
        });

        it("should be called when the region is changed", function () {
            window.confirm("Change the region on device to English (UK)");

            waitsFor(function () {
                return onRegionChanged.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onRegionChanged).toHaveBeenCalledWith("en-GB");
            });
        });

        it("should not be called when the language is changed", function () {
            var onLanguageChanged = jasmine.createSpy("onLanguageChanged");

            blackberry.event.addEventListener("languagechanged", onLanguageChanged);
            window.confirm("Change the language on device");

            waitsFor(function () {
                return onLanguageChanged.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onRegionChanged).not.toHaveBeenCalled();

                blackberry.event.removeEventListener("languagechanged", onLanguageChanged);
                onLanguageChanged = null;
            });
        });
    });

    describe("languagechanged", function () {
        var onLanguageChanged = null;

        beforeEach(function () {
            onLanguageChanged = jasmine.createSpy("onLanguageChanged");
            blackberry.event.addEventListener("languagechanged", onLanguageChanged);
        });

        afterEach(function () {
            blackberry.event.removeEventListener("languagechanged", onLanguageChanged);
            onLanguageChanged = null;
        });

        it("should be called when the language is changed", function () {
            window.confirm("Change the language on device to English (UK)");

            waitsFor(function () {
                return onLanguageChanged.callCount;
            }, "event to fire", waitForTimeout);

            runs(function () {
                expect(onLanguageChanged).toHaveBeenCalledWith("en-GB");
            });
        });

        it("should not be called when the region is changed", function () {
            var onRegionChanged = jasmine.createSpy("onRegionChanged");

            blackberry.event.addEventListener("regionchanged", onRegionChanged);
            window.confirm("Change the region on device");

            waitsFor(function () {
                return onRegionChanged.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onLanguageChanged).not.toHaveBeenCalled();

                blackberry.event.removeEventListener("regionchanged", onRegionChanged);
                onRegionChanged = null;
            });
        });
    });

    describe("fontchanged event", function () {
        it("should call fontchanged callback when it registered to listend for the event", function () {
            var fontChangedCB = jasmine.createSpy("fontchanged");

            blackberry.event.addEventListener('fontchanged', fontChangedCB);

            window.confirm("Change the font event settings and press 'OK'");

            waitsFor(function () {
                return fontChangedCB.callCount;
            }, "fontchanged even never fired", waitForTimeout);

            runs(function () {
                expect(fontChangedCB).toHaveBeenCalled();
                blackberry.event.removeEventListener('fontchanged', fontChangedCB);
            });
        });

        it("should not call fontchanged callback when it was un-registered", function () {
            var fontChangedCB = jasmine.createSpy("fontchanged");

            blackberry.event.addEventListener('fontchanged', fontChangedCB);
            blackberry.event.removeEventListener('fontchanged', fontChangedCB);

            window.confirm("Change the font event settings and press 'OK'");

            waitsFor(function () {
                return fontChangedCB.callCount === 0;
            }, "fontchanged even never fired", waitForTimeout);


            runs(function () {
                expect(fontChangedCB).not.toHaveBeenCalled();
            });
        });
    });
});
