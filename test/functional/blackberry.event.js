describe("blackberry.event", function() {
    window.confirm("Please unplug unit from power source.");
    describe("batterystatus", function() {
        it("should be called when the battery level changes", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please drain the battery. [SIM]Change 'StateOfCharge' in battery PPS Object");

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery level never changged", 120000);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });

        it("should be called when the power source is connected", function() {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Please plug in a power source. [SIM]Change 'ChargingState' to 'DC' in charger PPS Object");

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery status never changged", 15000);

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

            waitsFor(function () { return onBatteryStatusChange.callCount } , "Battery status never changged", 15000);

            runs(function () {
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });

        xit("alert battery level change", function() {
            var onBatteryStatusChange = function (a) {
                alert(a.level);
                alert(a.isPlugged);
            };

            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("Please change battery level to 90");

            waits(500);

            runs(function () {
                //expect(onBatteryStatusChange).toHaveBeenCalledWith(expected);
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });
    });   
});