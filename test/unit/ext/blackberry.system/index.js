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

var root = __dirname + "/../../../../",
    Whitelist = require(root + "lib/policy/whitelist").Whitelist,
    sysIndex = require(root + "ext/blackberry.system/index");

describe("blackberry.system index", function () {
    it("hasPermission", function () {
        var success = jasmine.createSpy(),
            env = {
                "request": {
                    "origin": "blah"
                },
                "response": {
                }
            };

        spyOn(Whitelist.prototype, "isFeatureAllowed").andReturn(true);

        sysIndex.hasPermission(success, undefined, {"module": "blackberry.system"}, env);

        expect(Whitelist.prototype.isFeatureAllowed).toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(0);
    });

    it("hasCapability", function () {
        var success = jasmine.createSpy();

        sysIndex.hasCapability(success, undefined, {"capability": "network.wlan"}, undefined);

        expect(success).toHaveBeenCalledWith(true);
    });
});