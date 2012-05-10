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

function testConnectionValue(field, value) {
    expect(blackberry.connection[field]).toBeDefined();
    expect(blackberry.connection[field]).toEqual(value);
}

function testConnectionReadOnly(field) {
    var before = blackberry.connection[field];
    blackberry.connection[field] = "MODIFIED";
    expect(blackberry.connection[field]).toEqual(before);
}

describe("blackberry.connection", function () {
    it('blackberry.connection should exist', function () {
        expect(blackberry.connection).toBeDefined();
    });

    it('blackberry.connection.* should be defined', function () {
        testConnectionValue("BB", 6);
        testConnectionValue("BLUETOOTH_DUN", 3);
        testConnectionValue("CELLULAR", 7);
        testConnectionValue("ETHERNET", 1);
        testConnectionValue("NONE", 8);
        testConnectionValue("UNKNOWN", 0);
        testConnectionValue("USB", 4);
        testConnectionValue("VPN", 5);
        testConnectionValue("WIFI", 2);
    });

    it('blackberry.connection.* should be read-only', function () {
        testConnectionReadOnly("BB");
        testConnectionReadOnly("BLUETOOTH_DUN");
        testConnectionReadOnly("CELLULAR");
        testConnectionReadOnly("ETHERNET");
        testConnectionReadOnly("NONE");
        testConnectionReadOnly("UNKNOWN");
        testConnectionReadOnly("USB");
        testConnectionReadOnly("VPN");
        testConnectionReadOnly("WIFI");
    });

    it('blackberry.connection.type should return blackberry.connection.WIFI if device is connected to wi-fi', function () {
        window.alert("Please make sure device is connected to wi-fi.");
        expect(blackberry.connection.type).toEqual(blackberry.connection.WIFI);
    });

    it('blackberry.connection.type should return blackberry.connection.NONE if device has no connection', function () {
        window.alert("Please make sure device not connected.");
        expect(blackberry.connection.type).toEqual(blackberry.connection.NONE);
    });
});