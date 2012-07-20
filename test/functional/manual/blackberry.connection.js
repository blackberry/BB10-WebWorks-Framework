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

var callbackArgs = {};

function testConnectionValue(field, value) {
    expect(blackberry.connection[field]).toBeDefined();
    expect(blackberry.connection[field]).toEqual(value);
}

function testConnectionReadOnly(field) {
    var before = blackberry.connection[field];
    blackberry.connection[field] = "MODIFIED";
    expect(blackberry.connection[field]).toEqual(before);
}

function checkConnectionCallbackArgs(args) {
    callbackArgs = args;
}

describe("blackberry.connection", function () {
        
    it('blackberry.connection.type should return blackberry.connection.WIFI if device is connected to wi-fi', function () {
        window.alert("Please make sure device is connected to wi-fi.");
        expect(blackberry.connection.type).toEqual(blackberry.connection.WIFI);
    });

    it('blackberry.connection.type should return blackberry.connection.NONE if device has no connection', function () {
        window.alert("Please make sure device not connected.");
        expect(blackberry.connection.type).toEqual(blackberry.connection.NONE);
    });

    describe("connectionchange", function () {
        var onChange,
            waitForTimeout = 15000;

        it('should invoke callback when connection type is changed', function () {
            runs(function () {
                onChange = jasmine.createSpy();
                blackberry.event.addEventListener("connectionchange", onChange);

                window.confirm("Please toggle wifi off/on.");
            });

            waitsFor(function () {
                return onChange.callCount;
            }, "event never fired", waitForTimeout);

            runs(function () {
                expect(onChange).toHaveBeenCalled();
                blackberry.event.removeEventListener("connectionchange", onChange);
            });
        });

        it('should return the correct old and new connection types', function () {
            runs(function () {
                callbackArgs = {};

                if (blackberry.connection.type !== blackberry.connection.NONE) {
                    window.confirm("Please make sure that the device is not connected.");
                }
            });

            waitsFor(function () {
                return (blackberry.connection.type === blackberry.connection.NONE);
            }, "did not turn off all connections", waitForTimeout);

            runs(function () {
                blackberry.event.addEventListener("connectionchange", checkConnectionCallbackArgs);
                window.confirm("Please turn wifi on.");
            });

            waitsFor(function () {
                return (blackberry.connection.type === blackberry.connection.WIFI);
            }, "did not turn wifi on", waitForTimeout);

            runs(function () {
                expect(callbackArgs.oldType).toEqual(blackberry.connection.NONE);
                expect(callbackArgs.newType).toEqual(blackberry.connection.WIFI);
                
                blackberry.event.removeEventListener("connectionchange", checkConnectionCallbackArgs);
            });
        });
    });
    
});
