/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var srcPath = __dirname + "/../../lib/";

describe("whitelist", function () {
    var Whitelist = require(srcPath + "policy/whitelist").Whitelist;
    
    describe("when user includes a wildcard access", function () {
        it("can allow access to any domain using uri *", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : true,
                accessList : null
            });

            expect(whitelist.isAccessAllowed("http://www.google.com")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.msn.com")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.cnn.com")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.rim.com")).toEqual(true);
            expect(whitelist.isAccessAllowed("local:///index.html")).toEqual(true);
            expect(whitelist.isAccessAllowed("file://store/home/user/documents/file.doc")).toEqual(true);
        });
    });

    describe("when user does not include a wildcard access", function () {
        it("can deny all web access when no uris are whitelisted", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : null
            });

            expect(whitelist.isAccessAllowed("http://www.google.com")).toEqual(false);
        });
    
        it("can deny all API access when no uris are whitelisted", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : null
            });

            expect(whitelist.isFeatureAllowed("http://www.google.com"), "blackberry.app").toEqual(false);
        });

        it("can allow access to whitelisted HTTP URL", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com",
                    allowSubDomain : true,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.google.com")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.cnn.com")).toEqual(false);
        });
    
        it("can deny access to non-whitelisted HTTP URL", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com",
                    allowSubDomain : true,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.cnn.com")).toEqual(false);
        });

        it("can allow access to whitelisted feature for whitelisted HTTP uris", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com",
                    allowSubDomain : false,
                    features : [{
                        id : "blackberry.app",
                        required : true,
                        version : "1.0.0"
                    }]
                }]
            });

            expect(whitelist.isFeatureAllowed("http://google.com", "blackberry.app")).toEqual(true);
        });

        it("can deny access to non-whitelisted feature for whitelisted HTTP uris", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com",
                    allowSubDomain : false,
                    features : [{
                        id : "blackberry.app",
                        required : true,
                        version : "1.0.0"
                    }]
                }]
            });

            expect(whitelist.isFeatureAllowed("http://www.google.com", "blackberry.io.file")).toEqual(false);
        });

        it("can allow access for query strings using a query string wildcard", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://www.google.com/search?*",
                    allowSubDomain : true,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.google.com/search?q=awesome")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.google.com/search?a=anyLetter")).toEqual(true);
            expect(whitelist.isAccessAllowed("http://www.google.com/blah?q=awesome")).toEqual(false);
        });
    
        it("can allow access for ports given just the whitelist url", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://www.awesome.com",
                    allowSubDomain : true,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.awesome.com:9000")).toEqual(true);
        });
    
        it("can allow folder level access of whitelisted uris", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://www.awesome.com/parent/child",
                    allowSubDomain : false,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.awesome.com/parent/child")).toEqual(true);
        });

        it("can deny access to parent folders of whitelisted uris", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://www.awesome.com/parent/child",
                    allowSubDomain : false,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.awesome.com/parent")).toEqual(false);
        });
    
        it("can deny access to sibling folders of whitelisted uris", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://www.awesome.com/parent/child/",
                    allowSubDomain : false,
                    features : null
                }]
            });

            expect(whitelist.isAccessAllowed("http://www.awesome.com/parent/sibling/")).toEqual(false);
        });
        
        it("can allow API permissions at a folder level", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com/ninjas",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.app",
                        required : true,
                        version : "1.0.0"
                    }]
                }, {
                    uri : "http://google.com/pirates",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.media.camera",
                        required : true,
                        version : "1.0.0"
                    }]
                }]
            });

            expect(whitelist.isFeatureAllowed("http://google.com/ninjas", "blackberry.app")).toEqual(true);        
            expect(whitelist.isFeatureAllowed("http://google.com/pirates", "blackberry.media.camera")).toEqual(true);        
        });
    
        it("can deny API permissions at a folder level", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com/ninjas",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.app",
                        required : true,
                        version : "1.0.0"
                    }]
                }, {
                    uri : "http://google.com/pirates",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.media.camera",
                        required : true,
                        version : "1.0.0"
                    }]
                }]
            });

            expect(whitelist.isFeatureAllowed("http://google.com/ninjas", "blackberry.media.camera")).toEqual(false);        
            expect(whitelist.isFeatureAllowed("http://google.com/pirates", "blackberry.app")).toEqual(false);        
        });
    
        it("can allow access specific folder rules to override more general domain rules", function () {
            var whitelist = new Whitelist({
                hasMultiAccess : false,
                accessList : [{
                    uri : "http://google.com",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.app",
                        required : true,
                        version : "1.0.0"
                    }]
                }, {
                    uri : "http://google.com/folder",
                    allowSubDomain : true,
                    features : [{
                        id : "blackberry.media.camera",
                        required : true,
                        version : "1.0.0"
                    }]
                }]
            });

            expect(whitelist.isFeatureAllowed("http://google.com/folder", "blackberry.app")).toEqual(false);        
            expect(whitelist.isFeatureAllowed("http://google.com/folder", "blackberry.media.camera")).toEqual(true);        
        });
	
        describe("when access uris have subdomains", function () {
            it("can allow access to whitelisted features for the subdomains", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://google.com",
                        allowSubDomain : true,
                        features : [{
                            id : "blackberry.app",
                            required : true,
                            version : "1.0.0"
                        }]
                    }]
                });

                expect(whitelist.isFeatureAllowed("http://abc.google.com", "blackberry.app")).toEqual(true);        
                expect(whitelist.isFeatureAllowed("http://xyz.google.com", "blackberry.app")).toEqual(true);        
            });

            it("can allow access to subdomains of whitelisted uris", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://awesome.com/",
                        allowSubDomain : true,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("http://subdomain.awesome.com")).toEqual(true);
            });
    
            it("can disallow access to subdomains of whitelisted uris", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://awesome.com/",
                        allowSubDomain : false,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("http://subdomain.awesome.com")).toEqual(false);
            });
    
            it("can disallow access to subdomains of a specified uri", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://awesome.com/",
                        allowSubDomain : true,
                        features : null
                    }, {
                        uri : "http://moreawesome.com/",
                        allowSubDomain : false,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("http://subdomain.moreawesome.com")).toEqual(false);
            });
    
            it("can allow specific subdomain rules to override more general domain rules when subdomains are allowed", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://google.com",
                        allowSubDomain : true,
                        features : [{
                            id : "blackberry.app",
                            required : true,
                            version : "1.0.0"
                        }]
                    }, {
                        uri : "http://sub.google.com",
                        allowSubDomain : true,
                        features : [{
                            id : "blackberry.media.camera",
                            required : true,
                            version : "1.0.0"
                        }]
                    }]
                });

                expect(whitelist.isFeatureAllowed("http://sub.google.com", "blackberry.app")).toEqual(false);        
                expect(whitelist.isFeatureAllowed("http://sub.google.com", "blackberry.media.camera")).toEqual(true);        
            });
    
            it("can allow specific subdomain rules to override more general domain rules when subdomains are disallowed", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "http://google.com",
                        allowSubDomain : false,
                        features : [{
                            id : "blackberry.app",
                            required : true,
                            version : "1.0.0"
                        }]
                    }, {
                        uri : "http://sub.google.com",
                        allowSubDomain : false,
                        features : [{
                            id : "blackberry.media.camera",
                            required : true,
                            version : "1.0.0"
                        }]
                    }]
                });

                expect(whitelist.isFeatureAllowed("http://sub.google.com", "blackberry.app")).toEqual(false);        
                expect(whitelist.isFeatureAllowed("http://sub.google.com", "blackberry.media.camera")).toEqual(true);
            });
        });
	
        describe("when uris with other protocols are requested", function () {
            it("can allow access to whitelisted HTTPS URL", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "https://google.com",
                        allowSubDomain : true,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("https://www.google.com")).toEqual(true);
                expect(whitelist.isAccessAllowed("https://www.cnn.com")).toEqual(false);
            });

            it("can deny access to non-whitelisted HTTPS URL", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "https://google.com",
                        allowSubDomain : true,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("https://www.cnn.com")).toEqual(false);
            });

            it("can allow access to local URLs", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "WIDGET_LOCAL",	// packager always inserts a local access into access list
                        allowSubDomain : false
                    }]
                });

                expect(whitelist.isAccessAllowed("local:///index.html")).toEqual(true);
                expect(whitelist.isAccessAllowed("local:///appDir/subDir/index.html")).toEqual(true);
            });
    
            it("can allow access to whitelisted features for local URLs", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "WIDGET_LOCAL",	// packager always inserts a local access into access list
                        allowSubDomain : false,
                        features : [{
                            id : "blackberry.media.microphone",
                            required : true,
                            version : "2.0.0"
                        }, {
                            id : "blackberry.media.camera",
                            required : true,
                            version : "1.0.0"
                        }]
                    }]
                });

                expect(whitelist.isFeatureAllowed("local:///index.html", "blackberry.media.microphone")).toEqual(true);
                expect(whitelist.isFeatureAllowed("local:///index.html", "blackberry.media.camera")).toEqual(true);
            });

            it("can allow access to whitelisted file URL", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "file://store/home/user/documents",
                        allowSubDomain : false,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("file://store/home/user/documents/file.doc")).toEqual(true);        
            });
    
            it("can deny file URL access when no file urls are whitelisted", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : null
                });

                expect(whitelist.isAccessAllowed("file://store/home/user/documents/file.doc")).toEqual(false);        
            });    
    
            it("can allow access to a subfolder of a whitelisted file URL", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "file://store/home/user/",
                        allowSubDomain : false,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("file://store/home/user/documents/file.doc")).toEqual(true);        
            });
    
            it("can allow access to RTSP protocol urls", function () {
                var whitelist = new Whitelist({
                    hasMultiAccess : false,
                    accessList : [{
                        uri : "rtsp://media.com",
                        allowSubDomain : false,
                        features : null
                    }]
                });

                expect(whitelist.isAccessAllowed("rtsp://media.com/video.avi")).toEqual(true);        
            });
        });	
    });	
});
