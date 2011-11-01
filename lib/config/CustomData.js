var ConfigConstants = require("./ConfigConstants.js"), 
	TransitionConstants = require("./TransitionConstants.js"), 
	_self;
	
_self = {
	"authorEmail" : "guocat@gmail.com",
	"copyright" : "@Rebecca",
	"customHeaders" : {
		"RIM-webworks" : "rim/webworks"
	},
	"onLocalPageLoad" : false,
	"author" : "Me",
	"onRemotePageLoad" : false,
	"version" : "1.0.0.0",
	"loadingScreenColor" : "#8080FF",
	"hasMultiAccess" : true,
	"license" : "",
	"disableAllCache" : true,
	"accessList" : [{
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system.event"
		}],
		"uri" : "http://atg05-yyz.rim.net/rebecca/whitelistsystem/event.htm"
	}, {
		"allowSubDomain" : true,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.ui.dialog"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.ui.menu"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.push"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system.event"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.utils"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.io.file"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.io.dir"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.pim.Address"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity.phone"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.app.event"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.app"
		}],
		"uri" : ConfigConstants.WIDGET_LOCAL_DOMAIN
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity.phone"
		}],
		"uri" : "http://atg05-yyz.rim.net/rebecca/whitelistsystem/phone.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity.phone"
		}],
		"uri" : "local:///phone.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system.event"
		}],
		"uri" : "local:///event.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity"
		}],
		"uri" : "http://atg05-yyz.rim.net/rebecca/whitelistsystem/identity.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity"
		}],
		"uri" : "local:///identity.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system"
		}],
		"uri" : "local:///system.htm"
	}, {
		"allowSubDomain" : false,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system"
		}],
		"uri" : "http://atg05-yyz.rim.net/rebecca/whitelistsystem/system.htm"
	}, {
		"allowSubDomain" : true,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.app"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.io.dir"
		}],
		"uri" : "http://laltshule-xp-3.rim.net"
	}, {
		"allowSubDomain" : true,
		"features" : [{
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.app"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.app.event"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.identity.phone"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.io.dir"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.io.file"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.push"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.system"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.ui.dialog"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.ui.menu"
		}, {
			"version" : "1.0.0.0",
			"required" : true,
			"id" : "blackberry.utils"
		}],
		"uri" : "http://rim.net"
	}],
	"licenseURL" : "",
	"widgetExtensions" : [],
	"transitionDuration" : 1000,
	"foregroundImage" : "img/4_colorful_bears.gif",
	"allowInvokeParams" : true,
	"authorURL" : "http://bbtools_win7_01/yui",
	"foregroundSource" : "main.htm",
	"content" : "main.htm",
	"description" : "this is local",
	"configXML" : "config.xml",
	"transitionType" : TransitionConstants.TRANSITION_SLIDEPUSH,
	"icon" : "img/4_colorful_bears.png",
	"onFirstLaunch" : false,
	"name" : "flTimeout"
};

module.exports = _self;
