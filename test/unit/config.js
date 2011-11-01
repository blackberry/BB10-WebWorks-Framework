var srcPath = __dirname + '/../../lib/';

describe("Config", function() {
	var config = require(srcPath + 'config/Config.js');

/*
	for(var key in config) {
		if( typeof config[key] === 'number' || config[key] === null || typeof config[key] === 'boolean') {
			console.log("expect(config." + key + ").toEqual(" + config[key] + ");");
		} else if( typeof config[key] === 'object') {
			console.log("expect(config." + key + ").toBeDefined();");
		} else {
			console.log("expect(config." + key + ").toEqual(\"" + config[key] + "\");");
		}

	}
*/
	it("verify all testing config data", function() {
		expect(config.configXML).toEqual("config.xml");
		expect(config.configXMLDoc).toEqual(null);
		expect(config.backButtonBehavior).toEqual("back");
		expect(config.customHeaders).toBeDefined();
		expect(config.version).toEqual("1.0.0");
		expect(config.author).toEqual("Me");
		expect(config.authorURL).toEqual("");
		expect(config.authorEmail).toEqual("");
		expect(config.copyright).toEqual("");
		expect(config.content).toEqual("index.html");
		expect(config.contentCharset).toEqual("");
		expect(config.contentType).toEqual("");
		expect(config.description).toEqual("");
		expect(config.icon).toEqual("AIRApp_72.png");
		expect(config.iconHover).toEqual("");
		expect(config.id).toEqual("");
		expect(config.license).toEqual("");
		expect(config.licenseURL).toEqual("");
		expect(config.name).toEqual("File Transfer");
		expect(config.navigationMode).toEqual("pointer");
		expect(config.preferredTransports).toEqual(null);
		expect(config.transportTimeout).toEqual(300000);
		expect(config.hasMultiAccess).toEqual(true);
		expect(config.widgetExtensions).toBeDefined();
		expect(config.featureTable).toEqual(null);
		expect(config.accessList).toBeDefined();
		expect(config.loadingScreenColor).toEqual("#FFFFFF");
		expect(config.backgroundImage).toEqual("");
		expect(config.foregroundImage).toEqual("");
		expect(config.onFirstLaunch).toEqual(false);
		expect(config.onLocalPageLoad).toEqual(false);
		expect(config.onRemotePageLoad).toEqual(false);
		expect(config.transitionType).toEqual(-1);
		expect(config.transitionDuration).toEqual(250);
		expect(config.transitionDirection).toEqual(128);
		expect(config.disableAllCache).toEqual(false);
		expect(config.aggressiveCacheAge).toEqual(2592000);
		expect(config.maxCacheSizeTotal).toEqual(1024);
		expect(config.maxCacheSizeItem).toEqual(128);
		expect(config.maxStandardCacheAge).toEqual(2592000);
		expect(config.runOnStartUp).toEqual(false);
		expect(config.allowInvokeParams).toEqual(false);
		expect(config.backgroundSource).toEqual("");
		expect(config.foregroundSource).toEqual("index.html");
		expect(config.debugEnabled).toEqual(false);
	});
});
