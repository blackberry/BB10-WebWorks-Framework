var srcPath = __dirname + '/../../lib/';

describe("whitelist", function () {
    var whitelist = require(srcPath + 'policy/whitelist');
    
    it("can allow access to any domain using uri *", function () {
        var accessList = [{
            allowSubDomain: false,      
            uri: "*"
        }];
                
        whitelist.init(accessList);
        expect(whitelist.checkAccess('http://www.google.com')).toEqual(true);
        expect(whitelist.checkAccess('http://www.msn.com')).toEqual(true);
        expect(whitelist.checkAccess('http://www.cnn.com')).toEqual(true);
        expect(whitelist.checkAccess('http://www.rim.com')).toEqual(true);
    });
    
});
    
    
