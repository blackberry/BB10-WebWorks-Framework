var srcPath = __dirname + '/../../lib/';

describe("Config", function () {
	var config = require(srcPath + 'config/config.js');

	it("verify user value is correctly mixed", function () {
		expect(config.copyright).toEqual("@Rebecca");
	});

	it("verify default value is correctly mixed", function () {
		expect(config.widgetExtensions).toEqual(null);
	});

});
