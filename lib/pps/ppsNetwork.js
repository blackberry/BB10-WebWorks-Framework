/*
 *  Copyright 2012 Research In Motion Limited.
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

//Wrapping PPSUtils as PPSReader in order to keep our code aligned with the browser code
//Eventually this code will go in webplaform, so having them aligned will help this transition.
var self,
    ppsObj,
    NETWORK_INTERFACE_ROOT = '/pps/services/networking/interfaces/',
    NETWORK_INTERFACES;

function getInterfaces(callback) {
    var interfaces = [];

    ppsObj.readPPSObject(NETWORK_INTERFACE_ROOT + ".all", function (data) {
        if (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    interfaces.push(key.substring(1));//remove the prepended @sign
                }
            }
        }
        
        //Sort the interfaces In order of precedence
        interfaces = interfaces.sort(function (a, b) {
            var precedence = {
                'rndis0': 1,//USB
                'ecm0': 2,//USB
                'ppp0': 4//Bluetooth
            };
            
            //if not in pecedence list, place after usb but before ppp0
            return (precedence[a] ? precedence[a] : 3) - (precedence[b] ? precedence[b] : 3);
        });
        
        NETWORK_INTERFACES = interfaces;
        callback();
    }, "?deltadir");
}

function handleNetworkStatusForInterface(networkInterface) {
    var ipAddresses = networkInterface.ip_addresses,
        type = networkInterface.type,
        ip4,
        ip6;
        
    if ((type === "wifi" || type === "usb") && ipAddresses && ipAddresses.length === 2) {
        // The ip addresses are returned in an array of the format:
        // [ 'ipv4Address/subnet', 'ipv6Address%interface/subnet' ]
        // so we trim them down here for the convenience of the caller.
        // In the case of wifi, ip6 comes first then ip4
        if (ipAddresses[0].match("^([0-9]{1,3}([.][0-9]{1,3}){3}).*")) {
            //first address is IP4 [USB IP]
            ip4 = ipAddresses[0];
            ip6 = ipAddresses[1];
        } else {
            //first address is IP6 [WIFI IP]
            ip6 = ipAddresses[0];
            ip4 = ipAddresses[1];
        }
        return {
            ipv4Address: ip4.substr(0, ip4.indexOf('/')),
            ipv6Address: ip6.substr(0, ip6.indexOf('%')),
        };
    }
}

function getNetworkStatusForInterface(i, callback) {
    if (i < NETWORK_INTERFACES.length) {
        ppsObj.readPPSObject(NETWORK_INTERFACE_ROOT + NETWORK_INTERFACES[i], function (networkInterface) {
            var networkStatus = handleNetworkStatusForInterface(networkInterface);
            if (networkStatus) {
                callback(networkStatus);
                return;
            }

            getNetworkStatusForInterface(++i, callback);
        });
    } else {
        callback();
    }
}

self = {
    getNetworkInfo : function (callback) {
        ppsObj = require("../../lib/pps/ppsUtils").createObject();
        if (callback) {
            getInterfaces(function () {
                //Will recursively get the network status for each interface
                getNetworkStatusForInterface(0, callback);
            });
        }
    }
};

module.exports = self;