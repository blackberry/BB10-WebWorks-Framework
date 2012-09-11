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
var _libDir = __dirname + "/../../../../lib/",
    ppsUtils,
    network = require(_libDir + "pps/ppsNetwork"),
    utils = require(_libDir + "utils"),
    mockedPPS,
    mode = "0",
    openedPPSPath;//PPS path that is currently open

function testNetworkStatus(validPPSInterfaces, expectedPPSInterface, expectedPPSType) {
    var callback = jasmine.createSpy();
    
    mockedPPS.readPPSObject = jasmine.createSpy().andCallFake(function (pathToPPS, callback, options) {
        var result = {};
        
        if (pathToPPS.indexOf(".all") !== -1) {
            //Return data for .all?deltadir PPS call
            result = {"@rndis0": "",
                    "@ecm0": "",
                    "@ti0": "",
                    "@ppp0": ""};
        } else if (utils.arrayContains(validPPSInterfaces, pathToPPS)) {
            result = {"ip_addresses": ["169.254.0.1/255.255.255.252", "fe80::8060:7ff:feed:2389%rndis0/ffff:ffff:ffff:ffff::"],
                    "type": expectedPPSType
            };
        }
        
        callback(result);
    });
    
    spyOn(ppsUtils, "createObject").andReturn(mockedPPS);
    network.getNetworkInfo(callback);

    expect(mockedPPS.readPPSObject).toHaveBeenCalledWith(expectedPPSInterface, jasmine.any(Function));
    expect(callback).toHaveBeenCalledWith({
        ipv4Address: "169.254.0.1",
        ipv6Address: "fe80::8060:7ff:feed:2389",
    });
}
    
describe("network.js", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {};
        ppsUtils = require(_libDir + "pps/ppsUtils");
        mockedPPS = {
            readPPSObject: jasmine.createSpy(),
        };
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        ppsUtils = null;
        mockedPPS = null;
    });

    describe("getNetworkStatus", function () {
        it("can get the network information for rndis0 connections", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/rndis0'], '/pps/services/networking/interfaces/rndis0', "usb");
        });
        
        it("can get the network information for ecm0 connections", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/ecm0'], '/pps/services/networking/interfaces/ecm0', "usb");
        });
        
        it("can get the network information for ti0 connections", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/ti0'], '/pps/services/networking/interfaces/ti0', "wifi");
        });
        
        it("can get the network information for ppp0 connections", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/ppp0'], '/pps/services/networking/interfaces/ppp0', "wifi");
        });
        
        it("first tries to grab USB IPs from rndis0", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/rndis0',
                '/pps/services/networking/interfaces/ecm0',
                '/pps/services/networking/interfaces/ti0',
                '/pps/services/networking/interfaces/ppp0'], '/pps/services/networking/interfaces/rndis0', "usb");
        });
        
        it("tries to grab USB IPs from ecm0 if rndis0 is undefined", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/ecm0',
                '/pps/services/networking/interfaces/ti0',
                '/pps/services/networking/interfaces/ppp0'], '/pps/services/networking/interfaces/ecm0', "usb");
        });
        
        it("tries to grab WIFI IPs from ti0 if USB interfaces undefined", function () {
            testNetworkStatus(['/pps/services/networking/interfaces/ti0',
                '/pps/services/networking/interfaces/ppp0'], '/pps/services/networking/interfaces/ti0', "wifi");
        });
    });
});