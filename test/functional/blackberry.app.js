describe("blackberry.app", function () {
	xit('blackberry.app.event should exist', function () {
		expect(blackberry.app.event).toBeDefined();
	});

	it('blackberry.app.author should exist', function () {
		expect(blackberry.app.author).toBeDefined();
		expect(blackberry.app.author).toEqual("Research In Motion Ltd.");
	});

	it('blackberry.app.authorEmail should exist', function () {
		expect(blackberry.app.authorEmail).toBeDefined();
		expect(blackberry.app.authorEmail).toEqual("hello.bob@blah.com");
	});

	it('blackberry.app.authorURL should exist', function () {
		expect(blackberry.app.authorURL).toBeDefined();
		expect(blackberry.app.authorURL).toEqual("http://www.blah.com");
	});

	it('blackberry.app.copyright should exist', function () {
		expect(blackberry.app.copyright).toBeDefined();
		expect(blackberry.app.copyright).toEqual("Copyright 1998-2011 My Corp");
	});

	it('blackberry.app.description should exist', function () {
		expect(blackberry.app.description).toBeDefined();
		expect(blackberry.app.description).toEqual("This application points to a the functional test server.");
	});

	it('blackberry.app.id should exist', function () {
		expect(blackberry.app.id).toBeDefined();
		expect(blackberry.app.id).toEqual("jasmine");
	});

	it('blackberry.app.license should exist', function () {
		var license = blackberry.app.license;
		expect(license).toBeDefined();
		expect(license).toContain("Licensed under the Apache License, Version 2.0");
	});

	it('blackberry.app.licenseURL should exist', function () {
		expect(blackberry.app.licenseURL).toBeDefined();
		expect(blackberry.app.licenseURL).toEqual("http://www.apache.org/licenses/LICENSE-2.0");
	});

	it('blackberry.app.name should exist', function () {
		expect(blackberry.app.name).toBeDefined();
		expect(blackberry.app.name).toEqual("Jasmine");
	});

	it('blackberry.app.version should exist', function () {
		expect(blackberry.app.version).toBeDefined();
		expect(blackberry.app.version).toEqual("1.0.0");
	});
});
