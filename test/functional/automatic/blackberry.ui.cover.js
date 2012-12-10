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

describe("blackberry.ui.cover", function () {
    it('blackberry.ui.cover.coverSize should exist', function () {
        expect(blackberry.ui.cover.coverSize).toBeDefined();
    });

    it('can get coverSize', function () {
        var size = blackberry.ui.cover.coverSize;
        expect(size.width).toBe(334);
        expect(size.height).toBe(396);
    });

    it('allows an application to update the window cover', function () {
        var exThrown = false,
            capture = { "x": 0, "y": 0, "width": 100, "height": 200 },
            label = {"label": "BlackBerry WebWorks Test", "size": 8};
        try {
            blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_SNAPSHOT, capture);
            blackberry.ui.cover.labels.push(label);
            blackberry.ui.cover.updateCover();
        } catch (exception) {
            exThrown = true;
        }
        expect(exThrown).toBe(false);
    });
});
