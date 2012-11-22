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

var _apiDir = __dirname + "./../../../../ext/invoke/",
    _libDir = __dirname + "./../../../../lib/",
    invocationEvents,
    startupMode,
    mockedInvocation,
    trigger;

describe("invoke invocationEvents", function () {
    beforeEach(function () {
        mockedInvocation = {
            addEventListener: jasmine.createSpy("invocation addEventListener"),
            removeEventListener: jasmine.createSpy("invocation removeEventListener"),
        };
        GLOBAL.window.qnx = {
            webplatform: {
                getApplication: function () {
                    return {
                        invocation: mockedInvocation
                    };
                }
            }
        };

        //since multiple tests are requiring invocation events we must unrequire
        var name = require.resolve(_apiDir + "invocationEvents");
        delete require.cache[name];
        invocationEvents = require(_apiDir + "invocationEvents");
        trigger = function () {};
    });

    afterEach(function () {
        mockedInvocation = null;
        GLOBAL.window.qnx = null;
        trigger = null;
    });

    describe("onChildCardStartPeek", function () {
        it("add proper event to invocation for 'onChildCardStartPeek'", function () {
            invocationEvents.addEventListener("onChildCardStartPeek", trigger);
            expect(mockedInvocation.addEventListener).toHaveBeenCalledWith("cardPeekStarted", trigger);
        });

        it("remove proper event from invocation for 'onChildCardStartPeek", function () {
            invocationEvents.removeEventListener("onChildCardStartPeek", trigger);
            expect(mockedInvocation.removeEventListener).toHaveBeenCalledWith("cardPeekStarted", trigger);
        });
    });

    describe("onChildCardEndPeek", function () {
        it("add proper event to invocation for 'onChildCardEndPeek'", function () {
            invocationEvents.addEventListener("onChildCardEndPeek", trigger);
            expect(mockedInvocation.addEventListener).toHaveBeenCalledWith("cardPeekEnded", trigger);
        });

        it("remove proper event from invocation for 'onChildCardEndPeek", function () {
            invocationEvents.removeEventListener("onChildCardEndPeek", trigger);
            expect(mockedInvocation.removeEventListener).toHaveBeenCalledWith("cardPeekEnded", trigger);
        });
    });
    describe("onChildCardClosed", function () {
        it("add proper event to invocation for 'onChildCardClosed'", function () {
            invocationEvents.addEventListener("onChildCardClosed", trigger);
            expect(mockedInvocation.addEventListener).toHaveBeenCalledWith("childCardClosed", trigger);
        });

        it("remove proper event from invocation for 'onChildCardClosed", function () {
            invocationEvents.removeEventListener("onChildCardClosed", trigger);
            expect(mockedInvocation.removeEventListener).toHaveBeenCalledWith("childCardClosed", trigger);
        });
    });
});
