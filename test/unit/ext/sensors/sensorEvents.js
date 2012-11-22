/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/sensors/",
    sensorsEvents;

describe("sensor sensorEvents", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy().andReturn(true),
            createObject: jasmine.createSpy().andReturn("1"),
            invoke: jasmine.createSpy().andReturn(2),
            registerEvents: jasmine.createSpy().andReturn(true),
            Sensor: function () {},
        };
        sensorsEvents = require(_apiDir + "sensorsEvents");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        sensorsEvents = null;
    });

    describe("addEventListener", function () {
        var trigger = function () {};

        it("invokes JNEXT startSensor for 'deviceaccelerometer' event", function () {
            sensorsEvents.addEventListener("deviceaccelerometer", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "deviceaccelerometer");
        });

        it("invokes JNEXT startSensor for 'devicemagnetometer' event", function () {
            sensorsEvents.addEventListener("devicemagnetometer", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicemagnetometer");
        });

        it("invokes JNEXT startSensor for 'devicegyroscope' event", function () {
            sensorsEvents.addEventListener("devicegyroscope", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicegyroscope");
        });

        it("invokes JNEXT startSensor for 'devicecompass' event", function () {
            sensorsEvents.addEventListener("devicecompass", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicecompass");
        });

        it("invokes JNEXT startSensor for 'deviceproximity' event", function () {
            sensorsEvents.addEventListener("deviceproximity", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "deviceproximity");
        });

        it("invokes JNEXT startSensor for 'devicelight' event", function () {
            sensorsEvents.addEventListener("devicelight", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicelight");
        });

        it("invokes JNEXT startSensor for 'devicegravity' event", function () {
            sensorsEvents.addEventListener("devicegravity", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicegravity");
        });

        it("invokes JNEXT startSensor for 'devicelinearacceleration' event", function () {
            sensorsEvents.addEventListener("devicelinearacceleration", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicelinearacceleration");
        });

        it("invokes JNEXT startSensor for 'devicerotationmatrix' event", function () {
            sensorsEvents.addEventListener("devicerotationmatrix", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "devicerotationmatrix");
        });

        it("invokes JNEXT startSensor for 'deviceorientation' event", function () {
            sensorsEvents.addEventListener("deviceorientation", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "deviceorientation");
        });

        it("invokes JNEXT startSensor for 'deviceazimuthpitchroll' event", function () {
            sensorsEvents.addEventListener("deviceazimuthpitchroll", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "deviceazimuthpitchroll");
        });

        it("invokes JNEXT startSensor for 'deviceholster' event", function () {
            sensorsEvents.addEventListener("deviceholster", trigger);
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "startSensor " + "deviceholster");
        });

    });

    describe("removeEventListener", function () {
        it("invokes JNEXT stopSensor for 'deviceaccelerometer' event", function () {
            sensorsEvents.removeEventListener("deviceaccelerometer");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "deviceaccelerometer");
        });

        it("invokes JNEXT stopSensor for 'devicemagnetometer' event", function () {
            sensorsEvents.removeEventListener("devicemagnetometer");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicemagnetometer");
        });

        it("invokes JNEXT stopSensor for 'devicegyroscope' event", function () {
            sensorsEvents.removeEventListener("devicegyroscope");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicegyroscope");
        });

        it("invokes JNEXT stopSensor for 'devicecompass' event", function () {
            sensorsEvents.removeEventListener("devicecompass");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicecompass");
        });

        it("invokes JNEXT stopSensor for 'deviceproximity' event", function () {
            sensorsEvents.removeEventListener("deviceproximity");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "deviceproximity");
        });

        it("invokes JNEXT stopSensor for 'devicelight' event", function () {
            sensorsEvents.removeEventListener("devicelight");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicelight");
        });

        it("invokes JNEXT stopSensor for 'devicegravity' event", function () {
            sensorsEvents.removeEventListener("devicegravity");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicegravity");
        });

        it("invokes JNEXT stopSensor for 'devicelinearacceleration' event", function () {
            sensorsEvents.removeEventListener("devicelinearacceleration");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicelinearacceleration");
        });
        
        it("invokes JNEXT stopSensor for 'devicerotationmatrix' event", function () {
            sensorsEvents.removeEventListener("devicerotationmatrix");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "devicerotationmatrix");
        });

        it("invokes JNEXT stopSensor for 'deviceorientation' event", function () {
            sensorsEvents.removeEventListener("deviceorientation");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "deviceorientation");
        });

        it("invokes JNEXT stopSensor for 'deviceazimuthpitchroll' event", function () {
            sensorsEvents.removeEventListener("deviceazimuthpitchroll");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "deviceazimuthpitchroll");
        });

        it("invokes JNEXT stopSensor for 'deviceholster' event", function () {
            sensorsEvents.removeEventListener("deviceholster");
            expect(JNEXT.invoke).toHaveBeenCalledWith(jasmine.any(String), "stopSensor " + "deviceholster");
        });        
    });
});

