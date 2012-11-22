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

describe("Custom Headers", function () {
    var server_address = 'http://atg05-yyz.labyyz.testnet.rim.net/ffmb_ota/tumbler/header.pl';

    it('Ensure that the custom header is properly passed at package time', function () {
        var xhr = new XMLHttpRequest(),
            response;

        xhr.open('GET', server_address, false);
        xhr.send();
        expect(xhr.readyState).toBe(4);
        expect(xhr.status).toBe(200);
        response = xhr.responseText;
        expect(response.indexOf("HTTP_RIM") !== -1);
        expect(response.indexOf("WebWorks/App") !== -1);

    });
});

