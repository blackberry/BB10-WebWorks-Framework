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

var _apiDir = __dirname + "./../../../../ext/ui.cover/",
    _libDir = __dirname + "./../../../../lib/",
    events = require(_libDir + "event"),
    eventExt = require(__dirname + "./../../../../ext/event/index"),
    index,
    mockedCoverSize,
    mockedUpdateCover;

describe("index ui.cover", function () {
    beforeEach(function () {
        index = require(_apiDir + "index");
        mockedCoverSize = '{"width":334,"height":396}';
        mockedUpdateCover = jasmine.createSpy("update cover");
        GLOBAL.window = {
            qnx: {
                webplatform: {
                    getApplication: function () {
                        return {
                            coverSize: mockedCoverSize,
                            updateCover: mockedUpdateCover,
                            getEnv: function (path) {
                                if (path === "HOME")
                                    return "/accounts/home";
                            }
                        };
                    }
                }
            }
        };
    });

    afterEach(function () {
        delete GLOBAL.window;
        index = null;
        mockedCoverSize = null;
        mockedUpdateCover = null;
    });

    it("gets coverSize", function () {
        var success = jasmine.createSpy(),
            fail = jasmine.createSpy();
        index.coverSize(success, fail);
        expect(fail).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith({width: 334, height: 396});
    });

    it("resetCover", function () {
        var success = jasmine.createSpy(),
            fail = jasmine.createSpy(),
            resetCover = {cover: "reset"};

        index.resetCover(success, fail, {cover: encodeURIComponent(JSON.stringify(resetCover))});
        expect(success).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        expect(mockedUpdateCover).toHaveBeenCalledWith(resetCover);
    });

    it("updateCover", function () {
        var success = jasmine.createSpy(),
            fail = jasmine.createSpy(),
            fakeCover = {
                cover: {
                    type: "file",
                    path: "/path/to/application/cover.jpg"
                },
                text: [{"label": "cover label", "size": 5, "wrap": true}],
            };
        index.updateCover(success, fail, {cover: encodeURIComponent(JSON.stringify(fakeCover))}, null);
        expect(success).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        expect(mockedUpdateCover).toHaveBeenCalledWith(fakeCover);
    });

    it("updateCover strips file:// prefix before sending to webplatform", function () {
        var success = jasmine.createSpy(),
            fail = jasmine.createSpy(),
            fakeCover = {
                "cover": {
                    type: "file",
                    path: "file:///path/to/application/cover.jpg"
                },
                text: [{"label": "cover label", "size": 5, "wrap": true}],
            };
        index.updateCover(success, fail, {cover: encodeURIComponent(JSON.stringify(fakeCover))}, null);
        expect(success).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        expect(mockedUpdateCover).toHaveBeenCalledWith({
            "cover": {
                type: "file",
                path: "/path/to/application/cover.jpg"
            },
            text: [{"label": "cover label", "size": 5, "wrap": true}],
        });
    });

});
