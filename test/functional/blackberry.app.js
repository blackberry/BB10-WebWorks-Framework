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
function testValue(field, value) {
    expect(blackberry.app[field]).toBeDefined();
    expect(blackberry.app[field]).toEqual(value);
}

function testReadOnly(field) {
    var before = blackberry.app[field];
    blackberry.app[field] = "MODIFIED";
    expect(blackberry.app[field]).toEqual(before);
}

describe("blackberry.app", function () {
    xit('blackberry.app.event should exist', function () {
        expect(blackberry.app.event).toBeDefined();
    });

    it('blackberry.app.author should exist', function () {
        testValue("author", "Research In Motion Ltd.");
    });

    it('blackberry.app.author should be read-only', function () {
        testReadOnly("author");
    });

    it('blackberry.app.authorEmail should exist', function () {
        testValue("authorEmail", "hello.bob@blah.com");
    });

    it('blackberry.app.authorEmail should be read-only', function () {
        testReadOnly("authorEmail");
    });

    it('blackberry.app.authorURL should exist', function () {
        testValue("authorURL", "http://www.blah.com");
    });

    it('blackberry.app.authorURL should be read-only', function () {
        testReadOnly("authorURL");
    });

    it('blackberry.app.copyright should exist', function () {
        testValue("copyright", "Copyright 1998-2011 My Corp");
    });

    it('blackberry.app.copyright should be read-only', function () {
        testReadOnly("copyright");
    });

    it('blackberry.app.description should exist', function () {
        testValue("description", "This application points to a the functional test server.");
    });

    it('blackberry.app.description should be read-only', function () {
        testReadOnly("description");
    });

    it('blackberry.app.id should exist', function () {
        testValue("id", "jasmine");
    });

    it('blackberry.app.id should be read-only', function () {
        testReadOnly("id");
    });

    it('blackberry.app.license should exist', function () {
        var license = blackberry.app.license;
        expect(license).toBeDefined();
        expect(license).toContain("Licensed under the Apache License, Version 2.0");
    });

    it('blackberry.app.license should be read-only', function () {
        testReadOnly("license");
    });

    it('blackberry.app.licenseURL should exist', function () {
        testValue("licenseURL", "http://www.apache.org/licenses/LICENSE-2.0");
    });

    it('blackberry.app.licenseURL should be read-only', function () {
        testReadOnly("licenseURL");
    });

    it('blackberry.app.name should exist', function () {
        testValue("name", "Jasmine");
    });

    it('blackberry.app.name should be read-only', function () {
        testReadOnly("name");
    });

    it('blackberry.app.version should exist', function () {
        testValue("version", "1.0.0");
    });

    it('blackberry.app.version should be read-only', function () {
        testReadOnly("version");
    });
});
