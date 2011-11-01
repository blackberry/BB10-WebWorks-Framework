var srcPath = __dirname + '/../../lib/';

describe("Config", function () {
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
	it("verify all testing config data", function () {
		expect(config.configXML).toEqual("config.xml");
		expect(config.configXMLDoc).toEqual(null);
		expect(config.backButtonBehavior).toEqual("back");
		expect(config.customHeaders).toBeDefined();
		expect(config.version).toEqual("1.0.0.0");
		expect(config.author).toEqual("Me");
		expect(config.authorURL).toEqual("http://bbtools_win7_01/yui");
		expect(config.authorEmail).toEqual("guocat@gmail.com");
		expect(config.copyright).toEqual("@Rebecca");
		expect(config.content).toEqual("main.htm");
		expect(config.contentCharset).toEqual("");
		expect(config.contentType).toEqual("");
		expect(config.description).toEqual("this is local");
		expect(config.icon).toEqual("img/4_colorful_bears.png");
		expect(config.iconHover).toEqual("");
		expect(config.id).toEqual("");
		expect(config.license).toEqual("");
		expect(config.licenseURL).toEqual("");
		expect(config.name).toEqual("flTimeout");
		expect(config.navigationMode).toEqual("pointer");
		expect(config.preferredTransports).toEqual(null);
		expect(config.transportTimeout).toEqual(300000);
		expect(config.hasMultiAccess).toEqual(true);
		expect(config.widgetExtensions).toBeDefined();
		expect(config.featureTable).toEqual(null);
		expect(config.accessList).toBeDefined();
		expect(config.loadingScreenColor).toEqual("#8080FF");
		expect(config.backgroundImage).toEqual("");
		expect(config.foregroundImage).toEqual("img/4_colorful_bears.gif");
		expect(config.onFirstLaunch).toEqual(false);
		expect(config.onLocalPageLoad).toEqual(false);
		expect(config.onRemotePageLoad).toEqual(false);
		expect(config.transitionType).toEqual(0);
		expect(config.transitionDuration).toEqual(1000);
		expect(config.transitionDirection).toEqual(128);
		expect(config.disableAllCache).toEqual(true);
		expect(config.aggressiveCacheAge).toEqual(2592000);
		expect(config.maxCacheSizeTotal).toEqual(1024);
		expect(config.maxCacheSizeItem).toEqual(128);
		expect(config.maxStandardCacheAge).toEqual(2592000);
		expect(config.runOnStartUp).toEqual(false);
		expect(config.allowInvokeParams).toEqual(true);
		expect(config.backgroundSource).toEqual("");
		expect(config.foregroundSource).toEqual("main.htm");
		expect(config.debugEnabled).toEqual(false);
	});
});
