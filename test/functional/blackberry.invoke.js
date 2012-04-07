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

describe("blackberry.invoke", function () {
    it('blackberry.invoke should exist', function () {
        expect(blackberry.invoke).toBeDefined();
    });

    it('BrowserArguments should exist', function () {
        expect(blackberry.invoke.BrowserArguments).toBeDefined();
    });

    it('invoke should invoke google.com', function () {
        var args = new blackberry.invoke.BrowserArguments("http://www.google.com"),
            confirm;

        try {
            blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
        } catch (e) {
            console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
    });

    it('invoke should invoke user specified link', function () {
        var url = window.prompt("Please enter a URL"),
            args = new blackberry.invoke.BrowserArguments(url),
            confirm;

        try {
            blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
        } catch (e) {
            console.log(e);
        }

        confirm = window.confirm("Did it invoke?");

        expect(confirm).toEqual(true);
    });
});