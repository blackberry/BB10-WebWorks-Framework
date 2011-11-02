var srcPath = __dirname + '/../../lib/';

describe("whitelist", function () {
    var whitelist = require(srcPath + 'policy/whitelist');
    
    it("can allow access to any domain using uri *", function () {
        var accessList = null; /*[{
            allowSubDomain: false,      
            uri: "*"
        }];*/

        whitelist.initialize(accessList, true);
        expect(whitelist.isAccessAllowed('http://www.google.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.msn.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.cnn.com')).toEqual(true);
        expect(whitelist.isAccessAllowed('http://www.rim.com')).toEqual(true);
    });

    it("can allow access to google.com without *", function () {
        var accessList = [{
            uri : "http://google.com",
            allowSubDomain : true,
            features : null
        }];

        whitelist.initialize(accessList, false);
        expect(whitelist.isAccessAllowed("http://www.google.com")).toEqual(true);
        expect(whitelist.isAccessAllowed("http://www.cnn.com")).toEqual(false);
    });
});
    
    
