var srcPath = __dirname + '/../../lib/';

describe("whitelist", function () {
    var whitelist = require(srcPath + 'policy/whitelist');
    
    it("can allow access to any domain using uri *", function () {
        var hasGlobalAccess = true,
            accessList = null; /*[{
            allowSubDomain: false,      
            uri: "*"
        }];*/

        whitelist.initialize(accessList, hasGlobalAccess);
        expect(whitelist.isAccessAllowed('http://www.google.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.msn.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.cnn.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.rim.com')).toEqual(true);
    });

    it("can allow access to domain without *", function () {
        var hasGlobalAccess = false,
            accessList = [{
                uri : "http://google.com",
                allowSubDomain : true,
                features : null
            }];

        whitelist.initialize(accessList, hasGlobalAccess);
        expect(whitelist.isAccessAllowed("http://www.google.com")).toEqual(true);
        expect(whitelist.isAccessAllowed("http://www.cnn.com")).toEqual(false);
    });

    it("can allow access to feature", function () {
        var hasGlobalAccess = false,
            accessList = [{
                uri : "http://google.com",
                allowSubDomain : true,
                features : [{
                    id : "blackberry.app",
                    required : true,
                    version : "1.0.0"
                }]
            }];

        whitelist.initialize(accessList, hasGlobalAccess);
        expect(whitelist.isFeatureAllowed("http://www.google.com", "blackberry.app")).toEqual(true);
        expect(whitelist.isFeatureAllowed("http://www.goo.com", "blackberry.app")).toEqual(false);
        expect(whitelist.isFeatureAllowed("http://www.google.com", "blackberry.io.file")).toEqual(false);
    });

    it("can allow access to local URLs", function () {
        var hasGlobalAccess = false,
            accessList = [{
                uri : "WIDGET_LOCAL",
                allowSubDomain : false,
                features : [{
                    id : "blackberry.media.microphone",
                    required : true,
                    version : "2.0.0"
                }]
            }];

        whitelist.initialize(accessList, hasGlobalAccess);
        expect(whitelist.isAccessAllowed("local:///index.html")).toEqual(true);
        expect(whitelist.isFeatureAllowed("local:///index.html", "blackberry.media.microphone")).toEqual(true);
    });

});
    
    
