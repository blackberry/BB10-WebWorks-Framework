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
    builder = require(libRoot + "public/builder"),
    utils = require(libRoot + "utils"),
    mockedWebworks = {
        exec : function () {},
        execSync: function () {
            return "";
        },
        defineReadOnlyField: function () {}
    };

describe("builder", function () {

    beforeEach(function () {
        //Create window object like in DOM and have it act the same way
        GLOBAL.window = GLOBAL;

        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window.webworks = mockedWebworks;

        spyOn(utils, "loadModule").andCallFake(function (module) {
            module = module.replace("blackberry.", "");
            return require(__dirname + "/../../../../" +  module.replace(/local:\/\//, "").replace(/\.js$/, ""));
        });
    });

    afterEach(function () {
        delete GLOBAL.window;        
    });

    it("can build an object with a single member", function () {
        var featureIds = ['blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);

        expect(target.blackberry.app).toBeDefined();
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeTruthy();
        expect(Object.hasOwnProperty.call(target.blackberry.app, "version")).toBeTruthy();
    });

    // blackberry.app.event is removed since it does not contain any functional API
    // there is no nested namespace at this point, comment out test case for now
    xit("can build an object with a nested member", function () {
        var featureIds = ['blackberry.app', 'blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeTruthy();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    // blackberry.app.event is removed since it does not contain any functional API
    // there is no nested namespace at this point, comment out test case for now
    xit("can build with feature IDs provided in any order", function () {
        var featureIds = ['blackberry.app.event', 'blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeTruthy();
        expect(target.blackberry.app.event).toBeDefined();
        expect(target.blackberry.app.event.onExit).toBeDefined();
    });

    // blackberry.app.event is removed since it does not contain any functional API
    // there is no nested namespace at this point, comment out test case for now
    xit("can build an object with only the nested member", function () {
        var featureIds = ['blackberry.app.event'],
            target = {};

        builder.build(featureIds).into(target);
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeFalsy();
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