/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/blackberry.invoke/",
    mockedInvocation,
    index;

describe("blackberry.invoke index", function () {

    beforeEach(function () {
        mockedInvocation = {
            invoke: jasmine.createSpy("invocation.invoke"),
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };

        index = require(_apiDir + "index");
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        index = null;
    });

    it("can invoke with target", function () {
        var successCB = jasmine.createSpy(),
            mockedArgs = {
                "request": encodeURIComponent(JSON.stringify({target: "abc.xyz"}))
            };

        index.invoke(successCB, null, mockedArgs);
        expect(mockedInvocation.invoke).toHaveBeenCalledWith({
            target: "abc.xyz"
        }, jasmine.any(Function));
        expect(successCB).toHaveBeenCalled();
    });

    it("can invoke with uri", function () {
        var successCB = jasmine.createSpy(),
            mockedArgs = {
                "request": encodeURIComponent(JSON.stringify({uri: "http://www.rim.com"}))
            };

        index.invoke(successCB, null, mockedArgs);
        expect(mockedInvocation.invoke).toHaveBeenCalledWith({
            uri: "http://www.rim.com"
        }, jasmine.any(Function));
        expect(successCB).toHaveBeenCalled();
    });
});

