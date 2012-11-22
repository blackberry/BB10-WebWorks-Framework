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
    app,
    io,
    filetransfer,
    system,
    builder,
    utils;

describe("builder", function () {

    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window = {
            webworks: {
                execSync: jasmine.createSpy(),
                defineReadOnlyField: jasmine.createSpy()
            }
        };

        app = require(libRoot + "../ext/app/client");
        io = require(libRoot + "../ext/io/client");
        filetransfer = require(libRoot + "../ext/io.filetransfer/client");
        system = require(libRoot + "../ext/system/client");

        delete require.cache[require.resolve(libRoot + "utils")];
        utils = require(libRoot + "utils");
        spyOn(utils, "loadModule").andCallFake(function (module) {
            module = module.replace("blackberry.", "");
            module =  libRoot + "../" +  module.replace(/local:\/\//, "").replace(/\.js$/, "");
            return require(module);
        });

        delete require.cache[require.resolve(libRoot + "public/builder")];
        builder = require(libRoot + "public/builder");
    });

    afterEach(function () {
        delete GLOBAL.window;
        builder = null;
    });

    it("can build an object with a single member", function () {
        var featureIds = ['blackberry.app'],
            target = {};

        builder.build(featureIds).into(target);

        expect(target.blackberry.app).toEqual(app);
        expect(Object.hasOwnProperty.call(target.blackberry.app, "name")).toBeTruthy();
        expect(Object.hasOwnProperty.call(target.blackberry.app, "version")).toBeTruthy();
    });

    it("can build an object with a nested member", function () {
        var featureIds = ['blackberry.io', 'blackberry.io.filetransfer'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
        expect(target.blackberry.io.sandbox).toEqual(io.sandbox);
    });

    it("can build with feature IDs provided in any order", function () {
        var featureIds = ['blackberry.io.filetransfer', 'blackberry.io'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
        expect(target.blackberry.io.sandbox).toEqual(io.sandbox);
    });

    it("can build an object with only the nested member", function () {
        var featureIds = ['blackberry.io.filetransfer'],
            target = {};

        builder.build(featureIds).into(target);
        expect(target.blackberry.io.filetransfer).toEqual(filetransfer);
    });

    it("can build an object with multiple members", function () {
        var featureIds = ['blackberry.app', 'blackberry.system'],
            target = {},
            app = require(libRoot + "../ext/app/client");

        builder.build(featureIds).into(target);
        expect(target.blackberry.app).toEqual(app);
        expect(target.blackberry.system).toEqual(system);
    });
});
