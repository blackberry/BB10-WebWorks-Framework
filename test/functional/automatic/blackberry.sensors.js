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

describe("blackberry.sensors", function () {
    describe("sensors", function () {
        var onSensor = jasmine.createSpy(),
            waitForTimeout = 5000;
        
        beforeEach(function () {
            waits(1000);
        });
            
        it('should be able to activate the deviceaccelerometer sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("deviceaccelerometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("deviceaccelerometer", onSensor);
            });
        });
        
        it('should be able to activate the devicemagnetometer sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicemagnetometer", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicegyroscope", onSensor);
            });
        });
        it('should be able to activate the devicegyroscope sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicegyroscope", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicegyroscope", onSensor);
            });
        });
        
        it('should be able to activate the devicecompass sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicecompass", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicecompass", onSensor);
            });
        });
        it('should be able to activate the deviceproximity sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("deviceproximity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("deviceproximity", onSensor);
            });
        });
        
        it('should be able to activate the devicelight sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicelight", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicelight", onSensor);
            });
        });
        
        it('should be able to activate the devicegravity sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicegravity", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicegravity", onSensor);
            });
        });
        
        it('should be able to activate the devicelinearacceleration sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicelinearacceleration", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicelinearacceleration", onSensor);
            });
        });
        
        it('should be able to activate the deviceorientation sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("deviceorientation", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("deviceorientation", onSensor);
            });
        });
        
        it('should be able to activate the devicerotationmatrix sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("devicerotationmatrix", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("devicerotationmatrix", onSensor);
            });
        });
        
        it('should be able to activate the deviceazimuthpitchroll sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("deviceazimuthpitchroll", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("deviceazimuthpitchroll", onSensor);
            });
        });
        
        it('should be able to activate the deviceholster sensor and get valid data', function () {
            runs(function () {
                blackberry.event.addEventListener("deviceholster", onSensor);
            });

            waitsFor(function () {
                return onSensor.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onSensor).toHaveBeenCalledWith(jasmine.any(Object));
                blackberry.event.removeEventListener("deviceholster", onSensor);
            });
        }); 
    });
});

