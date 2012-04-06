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

var libRoot = __dirname + "/../../../../lib/",
    utils = require(libRoot + "utils"),
    builder = require(libRoot + "public/builder"),
    mockedWebworks = {
        exec : function () {},
        execSync: function () {}
    };

describe("builder", function () {

    beforeEach(function () {
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;

        spyOn(utils, "performExec").andCallFake(function () {
            return "some dummy text";
        });
    });

    it("can build an object with a single member", function () {
        var featureIds = ['blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toBeDefined();
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.version).toBeDefined();
    });

    it("can build an object with a nested member", function () {
        var featureIds = ['blackberry.app', 'blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build with feature IDs provided in any order", function () {
        var featureIds = ['blackberry.app.event', 'blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeDefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build an object with only the nested member", function () {
        var featureIds = ['blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app.name).toBeUndefined();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    it("can build an object with multiple members", function () {
        var featureIds = ['blackberry.app', 'blackberry.system'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toBeDefined();
        expect(target.blackberry.system).toBeDefined();
    });
});