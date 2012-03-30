describe("blackberry.app", function () {
	xit('blackberry.app.event should exist', function () {
		expect(blackberry.app.event).toBeDefined();
	});

	it('blackberry.app.author should exist', function () {
		expect(blackberry.app.author).toBeDefined('Research In Motion Ltd.');
	});

	it('blackberry.app.authorEmail should exist', function () {
		expect(blackberry.app.authorEmail).toBeDefined("hello.bob@blah.com");
	});

	it('blackberry.app.authorURL should exist', function () {
		expect(blackberry.app.authorURL).toBeDefined("http://www.blah.com");
	});

	it('blackberry.app.copyright should exist', function () {
		expect(blackberry.app.copyright).toBeDefined("Copyright 1998-2011 My Corp");
	});

	it('blackberry.app.description should exist', function () {
		expect(blackberry.app.description).toBeDefined("This application points to a the functional test server.");
	});

	it('blackberry.app.id should exist', function () {
		expect(blackberry.app.id).toBeDefined('jasmine');
	});

	it('blackberry.app.license should exist', function () {
		var license = blackberry.app.license;
		expect(license).toBeDefined();
		expect(license).toContain("Licensed under the Apache License, Version 2.0");
	});

	it('blackberry.app.licenseURL should exist', function () {
		expect(blackberry.app.licenseURL).toBeDefined("http://www.apache.org/licenses/LICENSE-2.0");
	});

	it('blackberry.app.name should exist', function () {
		expect(blackberry.app.name).toBeDefined("Jasmine");
	});

	it('blackberry.app.version should exist', function () {
		expect(blackberry.app.version).toBeDefined("1.0.0");
	});
});
