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

    xit("name should have a valid value", function () {
        var message = "Device Name: " + blackberry.system.name + "\n\n" +
                "Is the device name valid?",
            confirm = window.confirm(message);

        expect(confirm).toBeTruthy();
    });

    describe("batterystatus", function () {
        var onBatteryStatusChange;

        beforeEach(function () {
            onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);
        });

        afterEach(function () {
            blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            onBatteryStatusChange = null;
        });

        it("should be called when the battery level decreases", function () {
            window.confirm("[Device]Drain the battery. [SIM]Decrease the 'StateOfCharge' in battery PPS Object");

            waitsFor(function () {
                return onBatteryStatusChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
            });
        });

        it("should be called when the power source is connected", function () {
            window.confirm("[Device]Connect to a power source. [SIM]Change 'ChargingState' to 'DC' in charger PPS Object");

            waitsFor(function () {
                return onBatteryStatusChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeTruthy();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });

        it("should be called when the battery level increases", function () {
            window.confirm("[Device]Please wait for battery to increase charge by 1%. [SIM]Increase the 'StateOfCharge' in battery PPS Object");

            waitsFor(function () {
                return onBatteryStatusChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeTruthy();
            });
        });

        it("should be called when the power source is disconnected", function () {
            window.confirm("[Device]Please unplug the power source. [SIM]Change 'ChargingState' to 'NC' in charger PPS Object");

            waitsFor(function () {
                return onBatteryStatusChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
            });
        });
    });

    describe("batterylow", function () {
        var onBatteryLow;

        beforeEach(function () {
            onBatteryLow = jasmine.createSpy("onBatteryLow");
            blackberry.event.addEventListener('batterylow', onBatteryLow);
        });

        afterEach(function () {
            blackberry.event.removeEventListener('batterylow', onBatteryLow);
            onBatteryLow = null;
        });

        it("should be called when the battery level decreases to lower than 15%", function () {
            window.confirm("[Device]Drain the battery to level lower than 15%. [SIM]Set 'StateOfCharge' in battery PPS Object to level lower than 15%");

            waitsFor(function () {
                return onBatteryLow.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).toHaveBeenCalledWith(jasmine.any(Object));
                expect(onBatteryLow.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryLow.mostRecentCall.args[0].isPlugged).toBeDefined();
            });
        });

        it("should not be called when the battery level decreases but still higher or equal to 15%", function () {
            window.confirm("[Device]Drain the battery to level higher or equal to 15%. [SIM]Set 'StateOfCharge' in battery PPS Object to level higher or equal to 15%");

            waitsFor(function () {
                return (onBatteryLow.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).not.toHaveBeenCalled();
            });
        });

        it("should not be called to any change to power source state", function () {
            window.confirm("[Device]Change the power source state (Plug/Unplug). [SIM]Tweak 'ChargingState' to 'NC' or 'DC' in charger PPS Object");

            waitsFor(function () {
                return (onBatteryLow.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).not.toHaveBeenCalled();
            });
        });

        it("should trigger callback for low event when re-entering threshold after adding event lister after all were removed", function () {

            window.confirm("[Device]Drain the battery to level lower than 15%. [SIM]Set 'StateOfCharge' in battery PPS Object to level lower than 15%");
            blackberry.event.removeEventListener('batterylow', onBatteryLow);
            window.confirm("[Device]Charge the battery to level higher or equal to 15%. [SIM]Set 'StateOfCharge' in battery PPS Object to level higher or equal to 15");
            window.confirm("[Device]Drain the battery to level lower than 15%. [SIM]Set 'StateOfCharge' in battery PPS Object to level lower than 15%");
            blackberry.event.addEventListener('batterylow', onBatteryLow);

            waitsFor(function () {
                return onBatteryLow.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).toHaveBeenCalledWith(jasmine.any(Object));
                expect(onBatteryLow.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryLow.mostRecentCall.args[0].isPlugged).toBeDefined();
            });
        });
    });

    describe("batterycritical", function () {
        var onBatteryCritical;

        beforeEach(function () {
            onBatteryCritical = jasmine.createSpy("onBatteryCritical");
            blackberry.event.addEventListener('batterycritical', onBatteryCritical);
        });

        afterEach(function () {
            blackberry.event.removeEventListener('batterycritical', onBatteryCritical);
            onBatteryCritical = null;
        });

        it("should be called when the battery level decreases to lower than 5%", function () {
            window.confirm("[Device]Drain the battery to level lower than 5%. [SIM]Set 'StateOfCharge' in battery PPS Object to level lower than 5%");

            waitsFor(function () {
                return onBatteryCritical.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryCritical).toHaveBeenCalledWith(jasmine.any(Object));
                expect(onBatteryCritical.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryCritical.mostRecentCall.args[0].isPlugged).toBeDefined();
            });
        });

        it("should not be called when the battery level decreases but still higher or equal to 5%", function () {
            window.confirm("[Device]Drain the battery to level higher or equal to 5%. [SIM]Set 'StateOfCharge' in battery PPS Object to level higher or equal to 5%");

            waitsFor(function () {
                return (onBatteryCritical.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryCritical).not.toHaveBeenCalled();
            });
        });

        it("should not be called to any change to power source state", function () {
            window.confirm("[Device]Change the power source state (Plug/Unplug). [SIM]Tweak 'ChargingState' to 'NC' or 'DC' in charger PPS Object");

            waitsFor(function () {
                return (onBatteryCritical.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryCritical).not.toHaveBeenCalled();
            });
        });
    });

    xdescribe("regionchanged", function () {
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
                //expect(onRegionChanged).toHaveBeenCalledWith("en-GB");
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

    xdescribe("languagechanged", function () {
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

    xdescribe("fontchanged event", function () {
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
