describe("blackberry.event", function() {
    window.confirm("Please unplug unit from power source.");

    describe("EventListener", function() {
        it("should not be called when the EventListener is removed", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);
            blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please connect power source. [SIM]Change 'StateOfCharge' to battery PPS Object");

            waitsFor(function () { return (onBatteryStatusChange.callCount == 0) } , "Battery event fired", 5000);

            runs(function () {
                expect(onBatteryStatusChange).not.toHaveBeenCalled();
            });
        });
    });

    describe("batterystatus", function() {
        it("should be called when the battery level changes", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please drain the battery. [SIM]Change 'StateOfCharge' in battery PPS Object");

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery event never fired", 120000);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });

        it("should be called when the power source is connected", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please plug in a power source. [SIM]Change 'ChargingState' to 'DC' in charger PPS Object");

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery event never fired", 15000);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeTruthy();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });

        it("should be called when the power source is disconnected", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please unplug a power source. [SIM]Change 'ChargingState' to 'NC' in charger PPS Object");

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery event never fired", 15000);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });
    });   
});