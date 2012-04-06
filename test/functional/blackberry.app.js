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

describe("blackberry.app", function () {
	xit('blackberry.app.event should exist', function () {
		expect(blackberry.app.event).toBeDefined();
	});

	it('blackberry.app.author should exist', function () {
		expect(blackberry.app.author).toBeDefined('Research In Motion Ltd.');
	});

	xit('blackberry.app.authorEmail should exist', function () {
		expect(blackberry.app.authorEmail).toBeDefined();
	});

	xit('blackberry.app.authorURL should exist', function () {
		expect(blackberry.app.authorURL).toBeDefined();
	});

	xit('blackberry.app.copyright should exist', function () {
		expect(blackberry.app.copyright).toBeDefined();
	});

	xit('blackberry.app.description should exist', function () {
		expect(blackberry.app.description).toBeDefined();
	});
});
