describe("blackberry", function () {
	it('should exist', function () {
		expect(blackberry).toBeDefined();
	});
});


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

describe("blackberry.invoke", function () {
	it('invoke should exist', function () {
		expect(blackberry.invoke).not.toBeDefined();
	});
});

describe("webworks", function () {
	it('should exist', function () {
		expect(webworks).toBeDefined();
	});
});