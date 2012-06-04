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

var srcPath = __dirname + '/../../../lib/',
    framework = require(srcPath + 'framework'),
    util = require(srcPath + "utils"),
    webview,
    Whitelist = require(srcPath + 'policy/whitelist').Whitelist,
    mock_request = {
        url: "http://www.dummy.com",
        allow: jasmine.createSpy(),
        deny: jasmine.createSpy()
    };

describe("framework", function () {
    beforeEach(function () {
        GLOBAL.qnx = {
            callExtensionMethod : function () {
                return 42;
            }
        };
        webview = util.requireWebview();
        spyOn(webview, "create").andCallFake(function (done) {
            done();
        });
        spyOn(webview, "destroy");
        spyOn(webview, "executeJavascript");
        spyOn(webview, "setURL");
        spyOn(console, "log");
    });

    it("can start a webview instance", function () {
        framework.start();
        expect(webview.create).toHaveBeenCalled();
    });

    it("on start passing callback and setting object parameters to create method of webview", function () {
        framework.start();
        expect(webview.create).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
    });

    it("setting object should have debugEnabled to be defined", function () {
        framework.start();
        expect((webview.create.mostRecentCall.args)[1].debugEnabled).toBeDefined();
    });

    it("can start a webview instance with a url", function () {
        var url = "http://www.google.com";
        framework.start(url);
        expect(webview.setURL).toHaveBeenCalledWith(url);
    });

    it("can stop a webview instance", function () {
        framework.start();
        framework.stop();
        expect(webview.destroy).toHaveBeenCalled();
    });

});
