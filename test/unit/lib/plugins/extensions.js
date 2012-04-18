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

describe("extensions", function () {
    var extensions = require("../../../../lib/plugins/extensions"),
        Whitelist = require('../../../../lib/policy/whitelist').Whitelist;

    beforeEach(function () {
        spyOn(console, "log");
    });

    describe("when handling get requests", function () {
        var req, succ, fail;

        beforeEach(function () {
            req = {
                params: {}
            };
            succ = jasmine.createSpy();
            fail = jasmine.createSpy();
        });
        
        it("gets the list of features for the request url", function () {
            spyOn(Whitelist.prototype, "getFeaturesForUrl");

            extensions.get(req, succ, fail);
            expect(Whitelist.prototype.getFeaturesForUrl).toHaveBeenCalled();
        });
        
        it("calls the success callback with featureIds", function () {
            spyOn(Whitelist.prototype, "getFeaturesForUrl").andReturn(["MyFeatureId"]);
            
            req.params.ext = "blackberry.identity";
            req.params.method = "uuid";

            extensions.get(req, succ, fail);
            expect(succ).toHaveBeenCalledWith(["MyFeatureId"]);
        });
    });
});  
