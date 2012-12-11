/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

function inject(script_url){
    var s = document.createElement('script');
    s.src = script_url;
    s.async=false;
    document.getElementsByTagName('head')[0].appendChild(s);
}

function testBB() {

    if(!blackberry) {
        alert("Test failed, webworks was not successfully injected");
        return;
    }

    document.addEventListener("webworksready", function () {
        alert("Test passed WebWorks ready was triggered after being injected");
    });
}
