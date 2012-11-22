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

var _extIntDir = __dirname + "./../../../../ext-internal",
    _apiDir = _extIntDir + "/automation",
    _ID = require(_apiDir + "/manifest").namespace,
    internal = {
        pps: require(_extIntDir + "/pps/client")
    },
    client,
    mockedWebworks;

describe("automation client", function () {

    beforeEach(function () {
        GLOBAL.window = GLOBAL;
        mockedWebworks = {
            execSync: jasmine.createSpy()
        };
        GLOBAL.window.webworks = mockedWebworks;
        GLOBAL.internal = internal;
        client = require(_apiDir + "/client");
    });

    afterEach(function () {
        delete GLOBAL.window;
        delete GLOBAL.internal;
        client = null;
    });

    describe("swipeDown", function () {
        it("can call execSync", function () {
            client.swipeDown();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(
                "internal.pps", 
                "syncWrite",
                { 
                    writeData: {
                        action : "nativeGesture", 
                        duration: "500", 
                        points : "[[(384,-10)(384,500)]]", 
                        _src: "desktop", 
                        _dest: "ui-agent"
                    },
                    path: "/pps/services/agent/ui-agent/control"
                }
            );
        });
    });

    describe("swipeUp", function () {
        it("can call execSync", function () {
            client.swipeUp();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(
                "internal.pps", 
                "syncWrite",
                { 
                    writeData: {
                        action : "nativeGesture", 
                        duration: "500", 
                        points : "[[(384,2000)(384,500)]]", 
                        _src: "desktop", 
                        _dest: "ui-agent"
                    },
                    path: "/pps/services/agent/ui-agent/control"
                }
            );
        });
    });

    describe("touch", function () {
        it("can call execSync", function () {
            client.touch(123, 456);
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(
                "internal.pps", 
                "syncWrite",
                { 
                    writeData: {
                        action : "nativeTouch", 
                        points : "[[(123,456)]]", 
                        _src: "desktop", 
                        _dest: "ui-agent"
                    },
                    path: "/pps/services/agent/ui-agent/control"
                }
            );
        });
    });

    describe("showKeyboard", function () {
        it("can call execSync", function () {
            client.showKeyboard();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(
                "internal.pps", 
                "syncWrite",
                { 
                    writeData: {
                        msg : "show", 
                    },
                    path: "/pps/services/input/control",
                    options: {
                        fileMode : 1
                    }
                }
            );
        });
    });

    describe("hideKeyboard", function () {
        it("can call execSync", function () {
            client.hideKeyboard();
            expect(mockedWebworks.execSync).toHaveBeenCalledWith(
                "internal.pps", 
                "syncWrite",
                { 
                    writeData: {
                        msg : "hide", 
                    },
                    path: "/pps/services/input/control",
                    options: {
                        fileMode : 1 
                    }
                }
            );
        });
    });

});
