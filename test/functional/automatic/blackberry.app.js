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
function testAppValue(field, value) {
    expect(blackberry.app[field]).toBeDefined();
    expect(blackberry.app[field]).toEqual(value);
}

function testAppReadOnly(field) {
    var before = blackberry.app[field];
    blackberry.app[field] = "MODIFIED";
    expect(blackberry.app[field]).toEqual(before);
}

describe("blackberry.app", function () {

    it('blackberry.app.author should exist', function () {
        testAppValue("author", "Research In Motion Ltd.");
    });

    it('blackberry.app.author should be read-only', function () {
        testAppReadOnly("author");
    });

    it('blackberry.app.authorEmail should exist', function () {
        testAppValue("authorEmail", "hello.bob@blah.com");
    });

    it('blackberry.app.authorEmail should be read-only', function () {
        testAppReadOnly("authorEmail");
    });

    it('blackberry.app.authorURL should exist', function () {
        testAppValue("authorURL", "http://www.blah.com");
    });

    it('blackberry.app.authorURL should be read-only', function () {
        testAppReadOnly("authorURL");
    });

    it('blackberry.app.copyright should exist', function () {
        testAppValue("copyright", "Copyright 1998-2011 My Corp");
    });

    it('blackberry.app.copyright should be read-only', function () {
        testAppReadOnly("copyright");
    });

    it('blackberry.app.description - default value should exist', function () {
        window.navigator = { language: "iDoNotExist" };//Forces default value
        testAppValue("description", "This application tests a wide range of WebWorks functionalities.");
    });

    it('blackberry.app.description - localized value should exist', function () {
        window.navigator = { language: "fr-FR" };
        testAppValue("description", "French description");
    });


    it('blackberry.app.description should be read-only', function () {
        testAppReadOnly("description");
    });

    it('blackberry.app.description - localized value for regional locale[en-FR] should default to language locale[en] when unprovided', function () {
        window.navigator = { language: "en-FR" };
        testAppValue("description", "English description");//[en] locale data
    });

    it('blackberry.app.id should exist', function () {
        testAppValue("id", "WebWorksTest");
    });

    it('blackberry.app.id should be read-only', function () {
        testAppReadOnly("id");
    });

    it('blackberry.app.license should exist', function () {
        var license = blackberry.app.license;
        expect(license).toBeDefined();
        expect(license).toContain("Licensed under the Apache License, Version 2.0");
    });

    it('blackberry.app.license should be read-only', function () {
        testAppReadOnly("license");
    });

    it('blackberry.app.licenseURL should exist', function () {
        testAppValue("licenseURL", "http://www.apache.org/licenses/LICENSE-2.0");
    });

    it('blackberry.app.licenseURL should be read-only', function () {
        testAppReadOnly("licenseURL");
    });

    it('blackberry.app.name - default value should exist', function () {
        window.navigator = { language: "iDoNotExist" };//Forces default value
        testAppValue("name", "WebWorks Test Application");
    });

    it('blackberry.app.name - localized value should exist', function () {
        window.navigator = { language: "fr-FR" };
        testAppValue("name", "French application name");
    });

    it('blackberry.app.name - localized value for regional locale[en-FR] should default to language locale[en] when unprovided', function () {
        window.navigator = { language: "en-FR" };
        testAppValue("name", "English application name");//[en] locale data
    });

    it('blackberry.app.name should be read-only', function () {
        testAppReadOnly("name");
    });

    it('blackberry.app.version should exist', function () {
        testAppValue("version", "1.0.0");
    });

    it('blackberry.app.version should be read-only', function () {
        testAppReadOnly("version");
    });

});
