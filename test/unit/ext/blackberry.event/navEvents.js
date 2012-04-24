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

var _apiDir = __dirname + "./../../../../ext/blackberry.event/",
    _libDir = __dirname + "./../../../../lib/",
    navEvents = require(_apiDir + "navEvents"),
    framework = require(_libDir + "framework");

describe("blackberry.event navEvents", function () {
    describe("addEventListener", function () {
        var trigger = function () {};

        it("calls framework setOnPause for 'pause' event", function () {
            spyOn(framework, "setOnPause");
            navEvents.addEventListener("pause", trigger);
            expect(framework.setOnPause).toHaveBeenCalledWith(trigger);
        });

        it("calls framework setOnResume for 'resume' event", function () {
            spyOn(framework, "setOnResume");
            navEvents.addEventListener("resume", trigger);
            expect(framework.setOnResume).toHaveBeenCalledWith(trigger);
        });
    });

    describe("removeEventListener", function () {
        it("calls framework setOnPause for 'pause' event", function () {
            spyOn(framework, "setOnPause");
            navEvents.removeEventListener("pause");
            expect(framework.setOnPause).toHaveBeenCalledWith(null);
        });

        it("calls framework setOnResume for 'resume' event", function () {
            spyOn(framework, "setOnResume");
            navEvents.removeEventListener("resume");
            expect(framework.setOnResume).toHaveBeenCalledWith(null);
        });
    });
});
