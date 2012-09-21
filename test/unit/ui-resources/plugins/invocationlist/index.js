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

describe("ui-resources/invocationlist", function () {
    var srcPath = "../../../../../",
        invocationlist = require(srcPath + 'ui-resources/plugins/invocationlist/index'),
        domNode = function () {
            var children = [];

            return {
                setAttribute: jasmine.createSpy(),
                appendChild: function (child) {
                    children.push(child);
                },
                style: {},
                addEventListener: jasmine.createSpy(),
                removeEventListener: jasmine.createSpy(),
                classList: {
                    add: jasmine.createSpy(),
                    remove: jasmine.createSpy()
                },
                blur: jasmine.createSpy(),
                children: children,
                innerHTML: "HTML"
            };
        },
        mockContext = {
            request: {},
            results: [{
                targets: [{
                    icon: 'icon.png',
                    label: 'Facebook',
                    key: 'facebook'
                }]
            }]
        },
        nodesById;

    beforeEach(function () {
        var invocationListNode = domNode(),
            cancelTitlebarNode = domNode(),
            targetLoaderNode = domNode(),
            invocationListContentNode = domNode();

        nodesById = {
            invocationlist: invocationListNode,
            cancelTitlebar: cancelTitlebarNode,
            targetLoader: targetLoaderNode,
            invocationListContent: invocationListContentNode
        };

        GLOBAL.document = {
            getElementById: function (id) {
                return nodesById[id];
            },

            createElement: function (node) {
                return domNode();
            },
            defaultView: {
                getComputedStyle: jasmine.createSpy().andReturn({
                    display: ""
                })
            },
            activeElement: domNode(),
            addEventListener: jasmine.createSpy(),
            removeEventListener: jasmine.createSpy()
        };
    });

    afterEach(function () {
        GLOBAL.document = null;
        nodesById = null;
    });

    describe('invocationlist methods', function () {
        it('should have show method', function () {
            expect(invocationlist.show).toBeDefined();
        }); 

        it('should have hide method', function () {
            expect(invocationlist.hide).toBeDefined();
        });
    });

    it('should be able to populate the DOM correctly on show', function () {
        spyOn(nodesById['cancelTitlebar'], 'appendChild');
        spyOn(nodesById['invocationListContent'], 'appendChild');

        invocationlist.show([mockContext]);

        // Check to see if the cancel title bar got built
        expect(nodesById['cancelTitlebar'].appendChild).toHaveBeenCalled();

        // View is in view (via transform)
        expect(nodesById['invocationlist'].style.webkitTransition).toEqual("-webkit-transform 250ms ease-out");
        expect(nodesById['invocationlist'].style.webkitTransform).toEqual('translate(0, 0)');
        expect(nodesById['invocationlist'].style.zIndex).toEqual(110);
        expect(nodesById['invocationlist'].classList.remove).toHaveBeenCalledWith('removed');

        expect(nodesById['invocationListContent'].innerHTML).toEqual("");
        expect(nodesById['invocationListContent'].setAttribute).toHaveBeenCalledWith('class', 'invocationListContainer');


        // One list item
        expect(nodesById['invocationListContent'].appendChild.callCount).toEqual(1);

        // Loader is not showing
        expect(nodesById['targetLoader'].classList.add).toHaveBeenCalledWith('hidden');
        expect(document.activeElement.blur).toHaveBeenCalled();
    });
});