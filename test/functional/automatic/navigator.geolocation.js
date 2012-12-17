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
describe('navigator.geolocation', function () {

    var timeout = 5000;

    it('getCurrentPosition should return a position', function () {
        var pos,
            flag,
            error = jasmine.createSpy('error').andCallFake(function () {
                flag = true;
            }),
            success = jasmine.createSpy('success').andCallFake(function (result) {
                pos = result;
                flag = true;
            });

        waitsFor(function () {
            return flag;
        }, timeout);

        runs(function () {
            expect(success).toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
            expect(pos).toBeDefined();
            expect(pos.coords).toBeDefined();
            expect(pos.coords.latitude).toBeGreaterThan(-90);
            expect(pos.coords.latitude).toBeLessThan(90);
            expect(pos.coords.longitude).toBeGreaterThan(-180);
            expect(pos.coords.longitude).toBeLessThan(180);
            expect(pos.timestamp).toBeDefined();
        });

        navigator.geolocation.getCurrentPosition(success, error);
    });

    it('watchPosition should return a watch id', function () {
        var watchId = navigator.geolocation.watchPosition(function () {}, function () {});
        expect(watchId).toBeGreaterThan(0);
        navigator.geolocation.clearWatch(watchId);
    });
});
