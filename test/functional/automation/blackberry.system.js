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

function setBatteryLevel(level) {
    var batteryStatus = internal.automation.getBatteryStatus(),
        curState = batteryStatus.status.ChargerInfo;
    internal.automation.setBatteryStatus(level, curState);
}

function setBatteryChargingState(state) {
    var batteryStatus = internal.automation.getBatteryStatus(),
        curLevel = batteryStatus.status.BatteryInfo.BatteryStatus.StateOfCharge;
    internal.automation.setBatteryStatus(curLevel, state);
}

describe("blackberry.system", function () {
    var waitForTimeout = 15000;

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
            var batteryStatus = internal.automation.getBatteryStatus(),
                curCharge = batteryStatus.status.BatteryInfo.BatteryStatus.StateOfCharge;
            internal.automation.setBatteryStatus(curCharge - 1, "NONE");
            
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
            setBatteryChargingState("CHARGING");
            
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
            var batteryStatus = internal.automation.getBatteryStatus(),
                curCharge = batteryStatus.status.BatteryInfo.BatteryStatus.StateOfCharge;
            internal.automation.setBatteryStatus(curCharge + 1, "CHARGING");

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
            setBatteryChargingState("NONE");

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
            // need to set battery level out of batterylow range first in order to trigger batterylow event
            setBatteryLevel(15);
            setBatteryLevel(14);
            
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
            setBatteryLevel(16);
            setBatteryLevel(15);

            waitsFor(function () {
                return (onBatteryLow.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).not.toHaveBeenCalled();
            });
        });

        it("should not be called to any change to power source state", function () {
            setBatteryChargingState("NONE");
            setBatteryChargingState("CHARGING");
            setBatteryChargingState("PLUGGED");
            setBatteryChargingState("WEAK_CHARGER");
            setBatteryChargingState("ERROR");
            
            waitsFor(function () {
                return (onBatteryLow.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryLow).not.toHaveBeenCalled();
            });
        });


        it("should trigger callback for low event when re-entering threshold after adding event listener after all were removed", function () {
            blackberry.event.removeEventListener('batterylow', onBatteryLow);
            setBatteryLevel(15);
            setBatteryLevel(14);
            setBatteryLevel(15);
            blackberry.event.addEventListener('batterylow', onBatteryLow);
            setBatteryLevel(14);

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
            // need to set battery level out of batterycritical range first in order to trigger batterycritical event
            setBatteryLevel(5);
            setBatteryLevel(4);

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
            setBatteryLevel(6);
            setBatteryLevel(5);

            waitsFor(function () {
                return (onBatteryCritical.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryCritical).not.toHaveBeenCalled();
            });
        });

        it("should not be called to any change to power source state", function () {
            setBatteryChargingState("NONE");
            setBatteryChargingState("CHARGING");
            setBatteryChargingState("PLUGGED");
            setBatteryChargingState("WEAK_CHARGER");
            setBatteryChargingState("ERROR");
            
            waitsFor(function () {
                return (onBatteryCritical.callCount === 0);
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onBatteryCritical).not.toHaveBeenCalled();
            });
        });
    });
});
