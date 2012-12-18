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

describe("blackberry.connection", function () {

    var timeout = 5000;

    it('blackberry.connection.type should return blackberry.connection.WIFI if device is connected to wi-fi', function () {
        internal.automation.toggleWifi(true);
        waits(timeout);
        runs(function () {
            expect(blackberry.connection.type).toEqual(blackberry.connection.WIFI);
        });
    });

    it('blackberry.connection.type should return blackberry.connection.NONE if device has no connection', function () {
        internal.automation.toggleWifi(false);
        waits(timeout);
        runs(function () {
            expect(blackberry.connection.type).toEqual(blackberry.connection.NONE);
        });
    });

    describe("connectionchange", function () {
        var onChange;

        it('should invoke callback when connection type is changed', function () {

            onChange = jasmine.createSpy();
            blackberry.event.addEventListener("connectionchange", onChange);
            internal.automation.toggleWifi(true);

            waitsFor(function () {
                return onChange.callCount;
            }, "event never fired", timeout * 4);

            runs(function () {
                expect(onChange).toHaveBeenCalled();
                blackberry.event.removeEventListener("connectionchange", onChange);
            });
        });

        it('should return the correct old and new connection types', function () {
            var callbackArgs,
                checkConnectionCallbackArgs = function (args) {
                    callbackArgs = args;
                };

            internal.automation.toggleWifi(false);

            waitsFor(function () {
                return (blackberry.connection.type === blackberry.connection.NONE);
            }, "did not turn off all connections", timeout * 4);

            runs(function () {
                blackberry.event.addEventListener("connectionchange", checkConnectionCallbackArgs);
                internal.automation.toggleWifi(true);

                waitsFor(function () {
                    return callbackArgs;
                }, "did not fire connectionchange", timeout * 4);

                runs(function () {
                    expect(callbackArgs.oldType).toEqual(blackberry.connection.NONE);
                    expect(callbackArgs.newType).toEqual(blackberry.connection.WIFI);
                    blackberry.event.removeEventListener("connectionchange", checkConnectionCallbackArgs);
                });
            });

        });

    });

});
