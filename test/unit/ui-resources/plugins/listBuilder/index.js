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

describe("ui-resources/listBuilder", function () {

    var srcPath = '../../../../../',
    listBuilder = require(srcPath + 'ui-resources/plugins/listBuilder/index'),
    listHeader,
    listContent,
    listContainer,
    mockedController,
    mockedApplication,
    invocation;

    beforeEach(function () {
        invocation = {
                TARGET_TYPE_ALL : '',
                ACTION_TYPE_MENU : ''
            };
        mockedController = {
            remoteExec: jasmine.createSpy()
        };
        mockedApplication = {
            invocation : {
                TARGET_TYPE_ALL : '',
                ACTION_TYPE_MENU : ''
            }
        };
        GLOBAL.window = {
            qnx : {
                webplatform : {
                    getController : function () {
                        return mockedController;
                    },
                    getApplication : function () {
                        return mockedApplication;
                    }
                }
            },
            btoa : jasmine.createSpy()
        };
        GLOBAL.document = {
            createTextNode: jasmine.createSpy(),
            createElement: jasmine.createSpy().andReturn({
                appendChild: jasmine.createSpy(),
                setAttribute: jasmine.createSpy(),
                addEventListener: jasmine.createSpy(),
                onTouchEnd: jasmine.createSpy()
            }),
            getElementById: function (id) {
                var returnElement;
                if (id === "listHeader") {
                    listHeader = {
                        innerHTML: jasmine.any(String),
                        appendChild: jasmine.createSpy()
                    };
                    returnElement = listHeader;
                } else if (id === "listContent") {
                    listContent = {
                        innerHTML: jasmine.any(String),
                        appendChild: jasmine.createSpy()
                    };
                    returnElement = listContent;
                } else if (id === "listContainer") {
                    listContainer = { setAttribute: jasmine.createSpy()};
                    returnElement = listContainer;
                }
                return returnElement;
            }
        };
        GLOBAL.qnx = {
            callExtensionMethod: jasmine.createSpy("bond"),
            webplatform : {
                getController : function () {
                    return mockedController;
                }
            }
        };
    });

    afterEach(function () {
        listBuilder.hide();
    });

    it("has an init function", function () {
        expect(listBuilder.init).toBeDefined();
    });

    it("has a populateList function", function () {
        listBuilder.init();
        expect(listBuilder.populateList).toBeDefined();
    });

    it("cause a populateList function to be called properly", function () {
        listBuilder.populateList(jasmine.any(Array), jasmine.any(Object));
        expect(listContent.appendChild).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it("has a show function", function () {
        expect(listBuilder.show).toBeDefined();
    });

    it("cause a show function to be called properly", function () {
        listBuilder.show();
        expect(listContainer.setAttribute).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
    });

    it("has a hide function", function () {
        expect(listBuilder.hide).toBeDefined();
    });

    it("cause a hide function to be called properly", function () {
        listBuilder.hide();
        expect(listContainer.setAttribute).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
    });
});
