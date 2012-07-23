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

var callbackArgs = {};

function testConnectionValue(field, value) {
    expect(blackberry.connection[field]).toBeDefined();
    expect(blackberry.connection[field]).toEqual(value);
}

function testConnectionReadOnly(field) {
    var before = blackberry.connection[field];
    blackberry.connection[field] = "MODIFIED";
    expect(blackberry.connection[field]).toEqual(before);
}

function checkConnectionCallbackArgs(args) {
    callbackArgs = args;
}

describe("blackberry.connection", function () {
    it('blackberry.connection should exist', function () {
        expect(blackberry.connection).toBeDefined();
    });

    it('blackberry.connection.* should be defined', function () {
        testConnectionValue("BB", "rim-bb");
        testConnectionValue("BLUETOOTH_DUN", "bluetooth_dun");
        testConnectionValue("CELL_4G", "4g");
        testConnectionValue("ETHERNET", "ethernet");
        testConnectionValue("NONE", "none");
        testConnectionValue("UNKNOWN", "unknown");
        testConnectionValue("USB", "usb");
        testConnectionValue("VPN", "vpn");
        testConnectionValue("WIFI", "wifi");
        testConnectionValue("CELL_2G", "2g");
        testConnectionValue("CELL_3G", "3g");
    });

    it('blackberry.connection.* should be read-only', function () {
        testConnectionReadOnly("BB");
        testConnectionReadOnly("BLUETOOTH_DUN");
        testConnectionReadOnly("CELL_4G");
        testConnectionReadOnly("ETHERNET");
        testConnectionReadOnly("NONE");
        testConnectionReadOnly("UNKNOWN");
        testConnectionReadOnly("USB");
        testConnectionReadOnly("VPN");
        testConnectionReadOnly("WIFI");
        testConnectionReadOnly("CELL_2G");
        testConnectionReadOnly("CELL_3G");
    });
    
});
