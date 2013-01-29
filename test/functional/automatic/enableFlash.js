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

describe("Enabling Flash", function () {
	it('should have libflashplayer.so loaded in the navigator when the config has the correct feature-id', function () {
        var plugin,
            flashFound = false;

        for (plugin in navigator.plugins) {
            if (plugin && navigator.plugins[plugin].filename && navigator.plugins[plugin].filename === "libflashplayer.so") {
                flashFound = true;
                break;
            }
        }

        expect(flashFound).toBe(true);
    });

    describe("in a child webview", function () {
        var childWindow,
            pageLoaded = false;

        beforeEach(function () {
            childWindow = window.open("local:///index.html");
            childWindow.onload = function () {
                console.log(childWindow.navigator.plugins);
                pageLoaded = true;
            };
        });

        afterEach(function () {
            childWindow.close();
        });

        it('should have libflashplayer.so loaded in the navigator of a childWebView when the config has the correct feature-id', function () {
            var flashFound = false;

            waitsFor(function () {
                return pageLoaded || childWindow.navigator.plugins.length;
            }, 10000);

            runs(function () {
                var plugin;

                for (plugin in childWindow.navigator.plugins) {
                    if (plugin && childWindow.navigator.plugins[plugin].filename && childWindow.navigator.plugins[plugin].filename === "libflashplayer.so") {
                        flashFound = true;
                        break;
                    }
                }

                expect(flashFound).toBe(true);
            });

        });
    });
});

