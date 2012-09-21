/*
 * Copyright 2012 Research In Motion Limited.
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
function testIdentityValue(field) {
    expect(blackberry.identity[field]).toBeDefined();
    expect(blackberry.identity[field]).toEqual(jasmine.any(String));
    expect(blackberry.identity[field]).not.toEqual("");
}

function testIdentityReadOnly(field) {
    var before = blackberry.identity[field];
    blackberry.identity[field] = "MODIFIED";
    expect(blackberry.identity[field]).toEqual(before);
}

describe("blackberry.identity", function () {
    it('blackberry.identity.uuid should exist', function () {
        testIdentityValue("uuid");
    });

    it('blackberry.identity.uuid should be read-only', function () {
        testIdentityReadOnly("uuid");
    });

    it("blackberry.identity.IMEI should exist", function () {
        testIdentityValue("IMEI");
        expect(blackberry.identity.IMEI).toMatch(/^[0-9]{15,16}$/);
    });

    it("blackberry.identity.IMEI should be read-only", function () {
        testIdentityReadOnly("IMEI");
    });

    /* This has been disabled because the device and the application
     * need to be specially configured in order for this test to work.*/
    xit("blackberry.identity.IMSI should exist", function () {
        testIdentityValue("IMSI");
        expect(blackberry.identity.IMSI).toMatch(/^[0-9]{14,15}$/);
    });

    /* This has been disabled because the device and the application
     * need to be specially configured in order for this test to work.*/
    xit("blackberry.identity.IMSI should be read-only", function () {
        testIdentityReadOnly("IMSI");
    });
});
