describe("blackberry.event", function () {
    it("should exist", function () {
        expect(blackberry.event).toBeDefined();
    });

    it("addEventListener should exist", function () {
        expect(blackberry.event.addEventListener).toBeDefined();
    });

    it("removeEventListener should exist", function () {
        expect(blackberry.event.removeEventListener).toBeDefined();
    });

    describe("EventListener", function () {

        afterEach(function () {
            window.confirm("Unplug unit from power source OR make sure ChargingState is 'NC'");
        });

        it("should not be called when the EventListener is removed", function () {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);
            blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Connect to a power source. [SIM]Change 'StateOfCharge' to 'DC' in battery PPS Object");

            waitsFor(function () { 
                return (onBatteryStatusChange.callCount === 0); 
            }, "Battery event fired", 5000);

            runs(function () {
                expect(onBatteryStatusChange).not.toHaveBeenCalled();
            });
        });

        it("should call two eventListeners listening to the same event", function () {
            var onBatteryStatusChangeA = jasmine.createSpy("onBatteryStatusChangeA"),
                onBatteryStatusChangeB = jasmine.createSpy("onBatteryStatusChangeB");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChangeA);
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChangeB);

            window.confirm("[Device]Connect to a power source. [SIM]Change 'StateOfCharge' to 'DC' in battery PPS Object");

            waitsFor(function () { 
                return onBatteryStatusChangeA.callCount && onBatteryStatusChangeB.callCount; 
            }, "Battery event fired", 15000);

            runs(function () {
                expect(onBatteryStatusChangeA).toHaveBeenCalled();
                expect(onBatteryStatusChangeB).toHaveBeenCalled();
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChangeA);
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChangeB);
            });
        });

        xit("should fire event once even if same eventListeners called multiple times", function () {
            var onBatteryStatusChange = jasmine.createSpy("onBatteryStatusChange");
                
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);
            blackberry.event.addEventListener('batterystatus', onBatteryStatusChange);

            window.confirm("[Device]Connect to a power source. [SIM]Change 'StateOfCharge' to 'DC' in battery PPS Object");

            waits(3000);

            runs(function () {
                expect(onBatteryStatusChange.callCount).toEqual(1);
                blackberry.event.removeEventListener('batterystatus', onBatteryStatusChange);
            });
        });
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
            }, "event never fired", 15000);

            runs(function () {
                console.log(onBatteryStatusChange.mostRecentCall.args[0]);
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
            });
        });

        it("should be called when the power source is connected", function () {
            window.confirm("[Device]Connect to a power source. [SIM]Change 'ChargingState' to 'DC' in charger PPS Object");

            waitsFor(function () { 
                return onBatteryStatusChange.callCount;
            }, "event never fired", 15000);

            runs(function () {
                console.log(onBatteryStatusChange.mostRecentCall.args[0]);
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
            }, "event never fired", 15000);

            runs(function () {
                console.log(onBatteryStatusChange.mostRecentCall.args[0]);
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeTruthy();
            });
        });

        it("should be called when the power source is disconnected", function () {
            window.confirm("[Device]Please unplug the power source. [SIM]Change 'ChargingState' to 'NC' in charger PPS Object");

            waitsFor(function () {
                return onBatteryStatusChange.callCount;
            }, "event never fired", 000);

            runs(function () {
                console.log(onBatteryStatusChange.mostRecentCall.args[0]);
                expect(onBatteryStatusChange).toHaveBeenCalled();
                expect(onBatteryStatusChange.mostRecentCall.args[0].level).toBeDefined();
                expect(onBatteryStatusChange.mostRecentCall.args[0].isPlugged).toBeFalsy();
            });
        });
    });   
});